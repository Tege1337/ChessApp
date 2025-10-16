import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import io from 'socket.io-client';
import { useAuth } from '../Context/AuthContext';
import { FaSearch, FaTrophy, FaChessPawn } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function GameBoard() {
  const { token, user } = useAuth();
  const [game, setGame] = useState(new Chess());
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState('Ready to play!');
  const [isWaiting, setIsWaiting] = useState(false);
  const [dots, setDots] = useState('');

  // Animated dots for waiting state
  useEffect(() => {
    if (isWaiting) {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isWaiting]);

  useEffect(() => {
    const newSocket = io(API_URL, {
      auth: { token }
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Connected to game server');
      setStatus('Connected! Ready to play.');
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setStatus('Connection error. Please refresh the page.');
    });

    newSocket.on('waiting', () => {
      setIsWaiting(true);
      setStatus('Searching for opponent');
    });

    newSocket.on('gameStart', ({ gameId, color, opponent, fen }) => {
      setGameId(gameId);
      setPlayerColor(color);
      setOpponent(opponent);
      setIsWaiting(false);
      const newGame = new Chess(fen);
      setGame(newGame);
      setStatus(`Game started! You are ${color}`);
    });

    newSocket.on('moveMade', ({ fen, isCheck, isCheckmate, isGameOver }) => {
      const newGame = new Chess(fen);
      setGame(newGame);
      
      if (isCheckmate) {
        setStatus(`Checkmate! ${newGame.turn() === 'w' ? 'Black' : 'White'} wins!`);
      } else if (isGameOver) {
        setStatus('Game Over - Draw');
      } else if (isCheck) {
        setStatus('Check! ⚠️');
      } else {
        setStatus(`${newGame.turn() === 'w' ? 'White' : 'Black'}'s turn`);
      }
    });

    newSocket.on('opponentDisconnected', () => {
      setStatus('Opponent disconnected. You win! 🎉');
      setGameId(null);
      setOpponent(null);
      setPlayerColor(null);
      setIsWaiting(false);
    });

    return () => newSocket.close();
  }, [token]);

  const findGame = () => {
    if (socket && socket.connected) {
      socket.emit('joinGame');
      setIsWaiting(true);
      setStatus('Joining matchmaking queue...');
    } else {
      setStatus('Not connected to server. Please refresh.');
    }
  };

  const cancelSearch = () => {
    setIsWaiting(false);
    setStatus('Search cancelled');
    // You could emit a 'cancelSearch' event to the server here
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
      <div className="game-sidebar">
        {/* Status Card */}
        <div className="status-card">
          <div className="status-icon">
            {isWaiting ? <FaSearch className="pulse" /> : <FaChessPawn />}
          </div>
          <div className="status-text">{status}</div>
          {isWaiting && <div className="searching-dots">{dots}</div>}
        </div>

        {/* Opponent Info */}
        {opponent && (
          <div className="player-card opponent-card">
            <div className="player-card-header">
              <span className="player-label">Opponent</span>
              <FaTrophy className="trophy-small" />
            </div>
            <div className="player-card-content">
              <div className="player-avatar opponent-avatar">
                {opponent.username[0].toUpperCase()}
              </div>
              <div className="player-details">
                <div className="player-username">{opponent.username}</div>
                <div className="player-elo-badge">{opponent.elo} ELO</div>
              </div>
            </div>
          </div>
        )}

        {/* Matchmaking Queue */}
        {isWaiting && (
          <div className="queue-card">
            <div className="queue-animation">
              <div className="queue-circle"></div>
              <div className="queue-circle"></div>
              <div className="queue-circle"></div>
            </div>
            <h3>Finding opponent{dots}</h3>
            <p>Looking for a player with similar ELO</p>
            <button onClick={cancelSearch} className="cancel-button">
              Cancel Search
            </button>
          </div>
        )}

        {/* Find Game Button */}
        {!gameId && !isWaiting && (
          <button onClick={findGame} className="find-game-btn">
            <FaSearch />
            <span>Find Game</span>
          </button>
        )}

        {/* Current Player Info */}
        {user && (
          <div className="player-card current-player-card">
            <div className="player-card-header">
              <span className="player-label">You</span>
              {gameId && <span className="color-badge">{playerColor}</span>}
            </div>
            <div className="player-card-content">
              <div className="player-avatar current-avatar">
                {user.username[0].toUpperCase()}
              </div>
              <div className="player-details">
                <div className="player-username">{user.username}</div>
                <div className="player-elo-badge">{user.stats.elo} ELO</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chess Board */}
      <div className="board-container">
        <Chessboard 
          position={game.fen()} 
          onPieceDrop={onDrop}
          boardOrientation={playerColor || 'white'}
          customBoardStyle={{
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
          }}
          customDarkSquareStyle={{ backgroundColor: '#7c3aed' }}
          customLightSquareStyle={{ backgroundColor: '#e9d5ff' }}
        />
      </div>
    </div>
  );
}

export default GameBoard;