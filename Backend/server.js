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

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://chess-app-rose.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"]
  }
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

let games = new Map();
let waitingPlayers = [];
let userSockets = new Map(); // userId -> socketId

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) return next(new Error('User not found'));
    
    socket.userId = user._id.toString();
    socket.username = user.username;
    socket.elo = user.stats.elo;
    next();
  } catch (error) {
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
    if (!gameData) return;

    const { chess, white, black, moves } = gameData;
    const isWhiteTurn = chess.turn() === 'w';
    const isPlayersTurn = (isWhiteTurn && socket.userId === white.id) || (!isWhiteTurn && socket.userId === black.id);
    
    if (!isPlayersTurn) return;

    try {
      const result = chess.move(move);
      if (result) {
        moves.push({ ...move, timestamp: new Date() });

        io.to(gameId).emit('moveMade', {
          move: result,
          fen: chess.fen(),
          isCheck: chess.isCheck(),
          isCheckmate: chess.isCheckmate(),
          isGameOver: chess.isGameOver()
        });

        if (chess.isGameOver()) {
          await handleGameEnd(gameId, gameData, chess);
        }
      }
    } catch (error) {
      console.error('Invalid move');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.username);
    userSockets.delete(socket.userId);
    
    const index = waitingPlayers.findIndex(p => p.userId === socket.userId);
    if (index !== -1) waitingPlayers.splice(index, 1);
    
    games.forEach((gameData, gameId) => {
      if (gameData.players.includes(socket.userId)) {
        io.to(gameId).emit('opponentDisconnected');
        games.delete(gameId);
      }
    });
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