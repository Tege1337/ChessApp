import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import io from 'socket.io-client';
import { useAuth } from '../Context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function GameBoard() {
  const { token, user } = useAuth();
  const [game, setGame] = useState(new Chess());
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState('Click "Find Game" to start');
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const newSocket = io(API_URL, {
      auth: { token }
    });

    setSocket(newSocket);

    newSocket.on('waiting', () => {
      setIsWaiting(true);
      setStatus('Waiting for opponent...');
    });

    newSocket.on('gameStart', ({ gameId, color, opponent, fen }) => {
      setGameId(gameId);
      setPlayerColor(color);
      setOpponent(opponent);
      setIsWaiting(false);
      const newGame = new Chess(fen);
      setGame(newGame);
      setStatus(`Game started! You are playing as ${color} against ${opponent.username} (ELO: ${opponent.elo})`);
    });

    newSocket.on('moveMade', ({ fen, isCheck, isCheckmate, isGameOver }) => {
      const newGame = new Chess(fen);
      setGame(newGame);
      
      if (isCheckmate) {
        setStatus(`Checkmate! ${newGame.turn() === 'w' ? 'Black' : 'White'} wins!`);
      } else if (isGameOver) {
        setStatus('Game Over!');
      } else if (isCheck) {
        setStatus('Check!');
      } else {
        setStatus(`${newGame.turn() === 'w' ? 'White' : 'Black'}'s turn`);
      }
    });

    newSocket.on('opponentDisconnected', () => {
      setStatus('Opponent disconnected. You win!');
      setGameId(null);
    });

    return () => newSocket.close();
  }, [token]);

  const findGame = () => {
    if (socket) {
      socket.emit('joinGame');
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    if (!gameId || !playerColor || !socket) return false;
    
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
        socket.emit('makeMove', {
          gameId,
          move: { from: sourceSquare, to: targetSquare, promotion: 'q' }
        });
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  };

  return (
    <div className="game-container">
      <div className="game-info">
        <div className="status-bar">{status}</div>
        
        {opponent && (
          <div className="opponent-info">
            <div className="opponent-avatar">{opponent.username[0].toUpperCase()}</div>
            <div>
              <div className="opponent-name">{opponent.username}</div>
              <div className="opponent-elo">ELO: {opponent.elo}</div>
            </div>
          </div>
        )}
        
        {!gameId && !isWaiting && (
          <button onClick={findGame} className="find-game-button">
            Find Game
          </button>
        )}
      </div>

      <div className="board-wrapper">
        <Chessboard 
          position={game.fen()} 
          onPieceDrop={onDrop}
          boardOrientation={playerColor || 'white'}
          customBoardStyle={{
            borderRadius: '10px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
          }}
        />
      </div>

      {user && (
        <div className="player-info">
          <div className="player-avatar">{user.username[0].toUpperCase()}</div>
          <div>
            <div className="player-name">{user.username}</div>
            <div className="player-elo">ELO: {user.stats.elo}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameBoard;