require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const { Chess } = require('chess.js');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const User = require('./models/user');
const GameHistory = require('./models/GameHistory');
const friendsRoutes = require('./routes/friends');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://chess-app-rose.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/friends', friendsRoutes);

let games = new Map();
let waitingPlayers = [];
let userSockets = new Map(); // userId -> socketId

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.log('No token provided');
      return next(new Error('Authentication required'));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log('User not found:', decoded.userId);
      return next(new Error('User not found'));
    }
    
    socket.userId = user._id.toString();
    socket.username = user.username;
    socket.elo = user.stats.elo;
    
    // Remove any existing socket connections for this user
    const existingSocketId = userSockets.get(socket.userId);
    if (existingSocketId && io.sockets.sockets.has(existingSocketId)) {
      io.sockets.sockets.get(existingSocketId).disconnect(true);
    }
    
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.username);
  userSockets.set(socket.userId, socket.id);

  socket.on('joinGame', async () => {
    // Find opponent from waiting list
    if (waitingPlayers.length > 0) {
      const opponent = waitingPlayers.shift();
      const gameId = 'game-' + Date.now();
      const game = new Chess();
      
      games.set(gameId, {
        chess: game,
        white: { id: socket.userId, username: socket.username, elo: socket.elo },
        black: { id: opponent.userId, username: opponent.username, elo: opponent.elo },
        players: [socket.userId, opponent.userId],
        moves: []
      });

      socket.join(gameId);
      opponent.join(gameId);

      socket.emit('gameStart', {
        gameId,
        color: 'white',
        opponent: { username: opponent.username, elo: opponent.elo },
        fen: game.fen()
      });
      
      opponent.emit('gameStart', {
        gameId,
        color: 'black',
        opponent: { username: socket.username, elo: socket.elo },
        fen: game.fen()
      });

      console.log(`Game ${gameId} started: ${socket.username} vs ${opponent.username}`);
    } else {
      waitingPlayers.push(socket);
      socket.emit('waiting');
    }
  });

  socket.on('makeMove', async ({ gameId, move }) => {
    const gameData = games.get(gameId);
    if (!gameData) {
      console.log('Game not found:', gameId);
      return;
    }

    const { chess, white, black, moves } = gameData;
    const isWhiteTurn = chess.turn() === 'w';
    const isPlayersTurn = (isWhiteTurn && socket.userId === white.id) || (!isWhiteTurn && socket.userId === black.id);
    
    if (!isPlayersTurn) {
      console.log('Not player\'s turn:', socket.username);
      return;
    }

    try {
      const result = chess.move(move);
      if (result) {
        const moveData = {
          ...move,
          piece: result.piece,
          color: result.color,
          flags: result.flags,
          san: result.san,
          timestamp: new Date()
        };
        moves.push(moveData);

        const gameState = {
          move: moveData,
          fen: chess.fen(),
          lastMove: { from: move.from, to: move.to },
          isCheck: chess.isCheck(),
          isCheckmate: chess.isCheckmate(),
          isStalemate: chess.isStalemate(),
          isDraw: chess.isDraw(),
          isGameOver: chess.isGameOver(),
          turn: chess.turn()
        };

        // Update game data in the map
        games.set(gameId, { ...gameData, chess, moves });

        // Emit move to both players
        io.to(gameId).emit('moveMade', gameState);

        if (gameState.isGameOver) {
          await handleGameEnd(gameId, gameData, chess);
        }
      } else {
        socket.emit('moveError', { message: 'Invalid move' });
      }
    } catch (error) {
      console.error('Move error:', error);
      socket.emit('moveError', { message: 'Invalid move' });
    }
  });

  // Handle chat messages
  socket.on('sendChatMessage', ({ gameId, message }) => {
    const gameData = games.get(gameId);
    if (!gameData || !gameData.players.includes(socket.userId)) {
      console.log('Invalid chat attempt:', { gameId, userId: socket.userId });
      return;
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.log('Invalid message format');
      return;
    }

    const chatMessage = {
      username: socket.username,
      message: message.slice(0, 200).trim(), // Limit message length
      timestamp: new Date(),
      userId: socket.userId
    };

    io.to(gameId).emit('chatMessage', chatMessage);
  });

  socket.on('disconnect', async () => {
    console.log('Client disconnected:', socket.username);
    userSockets.delete(socket.userId);
    
    // Remove from waiting list if present
    const index = waitingPlayers.findIndex(p => p.userId === socket.userId);
    if (index !== -1) {
      waitingPlayers.splice(index, 1);
      console.log('Removed from waiting list:', socket.username);
    }
    
    // Handle active games
    for (const [gameId, gameData] of games.entries()) {
      if (gameData.players.includes(socket.userId)) {
        // Notify opponent
        io.to(gameId).emit('opponentDisconnected', {
          username: socket.username,
          gameId: gameId
        });
        
        // Save game result if it was in progress
        if (gameData.moves.length > 0) {
          const winner = gameData.white.id === socket.userId ? 'black' : 'white';
          await handleGameEnd(gameId, gameData, gameData.chess, 'disconnect');
        }
        
        games.delete(gameId);
        console.log('Game cleaned up:', gameId);
      }
    }
  });
});

// Calculate ELO change
function calculateElo(winnerElo, loserElo, isDraw = false) {
  const K = 32;
  const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));
  
  if (isDraw) {
    return {
      winnerChange: Math.round(K * (0.5 - expectedWinner)),
      loserChange: Math.round(K * (0.5 - expectedLoser))
    };
  }
  
  return {
    winnerChange: Math.round(K * (1 - expectedWinner)),
    loserChange: Math.round(K * (0 - expectedLoser))
  };
}

// Handle game end
async function handleGameEnd(gameId, gameData, chess) {
  const { white, black, moves } = gameData;
  
  let winner = null;
  let endReason = '';
  
  if (chess.isCheckmate()) {
    winner = chess.turn() === 'w' ? 'black' : 'white';
    endReason = 'checkmate';
  } else if (chess.isStalemate()) {
    winner = 'draw';
    endReason = 'stalemate';
  } else if (chess.isDraw()) {
    winner = 'draw';
    endReason = 'draw';
  }

  // Save game history
  await GameHistory.create({
    gameId,
    whitePlayer: white.id,
    blackPlayer: black.id,
    winner,
    moves,
    endReason,
    endedAt: new Date()
  });

  // Update user stats
  const isDraw = winner === 'draw';
  const winnerId = winner === 'white' ? white.id : (winner === 'black' ? black.id : null);
  const loserId = winner === 'white' ? black.id : (winner === 'black' ? white.id : null);

  if (isDraw) {
    const eloChanges = calculateElo(white.elo, black.elo, true);
    
    await User.findByIdAndUpdate(white.id, {
      $inc: {
        'stats.draws': 1,
        'stats.elo': eloChanges.winnerChange
      }
    });
    
    await User.findByIdAndUpdate(black.id, {
      $inc: {
        'stats.draws': 1,
        'stats.elo': eloChanges.loserChange
      }
    });
  } else {
    const winnerUser = await User.findById(winnerId);
    const loserUser = await User.findById(loserId);
    
    const eloChanges = calculateElo(winnerUser.stats.elo, loserUser.stats.elo);
    
    await User.findByIdAndUpdate(winnerId, {
      $inc: {
        'stats.wins': 1,
        'stats.elo': eloChanges.winnerChange
      }
    });
    
    await User.findByIdAndUpdate(loserId, {
      $inc: {
        'stats.losses': 1,
        'stats.elo': eloChanges.loserChange
      }
    });
  }

  games.delete(gameId);
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));