const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

let games = new Map();
let waitingPlayers = [];

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinGame', () => {
    if (waitingPlayers.length > 0) {
      const opponent = waitingPlayers.shift();
      const gameId = 'game-' + Date.now();
      const game = new Chess();
      
      games.set(gameId, {
        chess: game,
        white: socket.id,
        black: opponent.id,
        players: [socket.id, opponent.id]
      });

      socket.join(gameId);
      opponent.join(gameId);

      socket.emit('gameStart', { gameId, color: 'white', fen: game.fen() });
      opponent.emit('gameStart', { gameId, color: 'black', fen: game.fen() });
    } else {
      waitingPlayers.push(socket);
      socket.emit('waiting');
    }
  });

  socket.on('makeMove', ({ gameId, move }) => {
    const gameData = games.get(gameId);
    if (!gameData) return;

    const { chess, white, black } = gameData;
    const isWhiteTurn = chess.turn() === 'w';
    const isPlayersTurn = (isWhiteTurn && socket.id === white) || (!isWhiteTurn && socket.id === black);
    
    if (!isPlayersTurn) return;

    try {
      const result = chess.move(move);
      if (result) {
        io.to(gameId).emit('moveMade', {
          move: result,
          fen: chess.fen(),
          isGameOver: chess.isGameOver()
        });

        if (chess.isGameOver()) {
          games.delete(gameId);
        }
      }
    } catch (error) {
      console.error('Invalid move');
    }
  });

  socket.on('disconnect', () => {
    const index = waitingPlayers.findIndex(p => p.id === socket.id);
    if (index !== -1) waitingPlayers.splice(index, 1);
    
    games.forEach((gameData, gameId) => {
      if (gameData.players.includes(socket.id)) {
        io.to(gameId).emit('opponentDisconnected');
        games.delete(gameId);
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log('Server running on port ' + PORT));