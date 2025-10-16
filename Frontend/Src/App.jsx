import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [game, setGame] = useState(new Chess());
  const [gameId, setGameId] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [status, setStatus] = useState('Click "Find Game" to start');
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    socket.on('waiting', () => {
      setIsWaiting(true);
      setStatus('Waiting for opponent...');
    });

    socket.on('gameStart', ({ gameId, color, fen }) => {
      setGameId(gameId);
      setPlayerColor(color);
      setIsWaiting(false);
      const newGame = new Chess(fen);
      setGame(newGame);
      setStatus(`Game started! You are playing as ${color}`);
    });

    socket.on('moveMade', ({ fen, isGameOver }) => {
      const newGame = new Chess(fen);
      setGame(newGame);
      
      if (isGameOver) {
        if (newGame.isCheckmate()) {
          setStatus(`Checkmate! ${newGame.turn() === 'w' ? 'Black' : 'White'} wins!`);
        } else if (newGame.isStalemate()) {
          setStatus('Stalemate! Game is a draw.');
        } else if (newGame.isDraw()) {
          setStatus('Draw!');
        }
      } else if (newGame.isCheck()) {
        setStatus('Check!');
      } else {
        setStatus(`${game.turn() === 'w' ? 'White' : 'Black'}'s turn`);
      }
    });

    socket.on('opponentDisconnected', () => {
      setStatus('Opponent disconnected. Game over.');
    });

    return () => {
      socket.off('waiting');
      socket.off('gameStart');
      socket.off('moveMade');
      socket.off('opponentDisconnected');
    };
  }, [game]);

  const findGame = () => {
    socket.emit('joinGame');
  };

  const onDrop = (sourceSquare, targetSquare) => {
    if (!gameId || !playerColor) return false;
    
    const gameCopy = new Chess(game.fen());
    const turn = gameCopy.turn();
    
    if ((turn === 'w' && playerColor !== 'white') || (turn === 'b' && playerColor !== 'black')) {
      return false;
    }

    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move) {
        setGame(gameCopy);
        socket.emit('makeMove', { gameId, move: { from: sourceSquare, to: targetSquare, promotion: 'q' } });
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  };

  return (
    <div className="App">
      <h1>Online Chess</h1>
      <div className="status">{status}</div>
      {!gameId && !isWaiting && (
        <button onClick={findGame} className="find-game-btn">Find Game</button>
      )}
      <div className="board-container">
        <Chessboard 
          position={game.fen()} 
          onPieceDrop={onDrop}
          boardOrientation={playerColor || 'white'}
        />
      </div>
    </div>
  );
}

export default App;