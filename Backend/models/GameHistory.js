const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  whitePlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blackPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  winner: {
    type: String,
    enum: ['white', 'black', 'draw'],
    default: null
  },
  moves: [{
    from: String,
    to: String,
    piece: String,
    timestamp: Date
  }],
  endReason: {
    type: String,
    enum: ['checkmate', 'stalemate', 'draw', 'resignation', 'timeout']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  }
});

module.exports = mongoose.model('GameHistory', gameHistorySchema);