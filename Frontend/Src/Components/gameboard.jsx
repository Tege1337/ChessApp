import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import io from 'socket.io-client';
import { useAuth } from '../Context/AuthContext';
import { FaSearch, FaTrophy, FaChessPawn, FaTimes } from 'react-icons/fa';

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
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [gameOverMessage, setGameOverMessage] = useState(null);
  const [premove, setPremove] = useState(null);

  const boardStyle = user?.settings?.boardStyle || 'classic';

  const boardStyles = {
    classic: {
      light: '#d1d5db',
      dark: '#4b5563'
    },
    modern: {
      light: '#e0e7ff',
      dark: '#4f46e5'
    },
    wood: {
      light: '#f0d9b5',
      dark: '#b58863'
    }
  };

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
      setGameOverMessage(null);
      setPremove(null);
    });

    newSocket.on('moveMade', ({ fen, isCheck, isCheckmate, isGameOver }) => {
      const newGame = new Chess(fen);
      
      // Execute premove if it's our turn now and we have a premove set
      if (premove && newGame.turn() === (playerColor === 'white' ? 'w' : 'b')) {
        setTimeout(() => {
          const testGame = new Chess(newGame.fen());
          const move = testGame.move({
            from: premove.from,
            to: premove.to,
            promotion: 'q'
          });
          
          if (move && socket) {
            setGame(testGame);
            socket.emit('makeMove', {
              gameId,
              move: { from: premove.from, to: premove.to, promotion: 'q' }
            });
          }
          setPremove(null);
          setSelectedSquare(null);
          setLegalMoves([]);
        }, 100);
      } else {
        setGame(newGame);
      }
      
      setSelectedSquare(null);
      setLegalMoves([]);
      
      if (isCheckmate) {
        const winner = newGame.turn() === 'w' ? 'Black' : 'White';
        setStatus(`Checkmate! ${winner} wins!`);
        setGameOverMessage({
          title: 'Checkmate!',
          message: `${winner} wins!`,
          type: winner.toLowerCase() === playerColor ? 'win' : 'loss'
        });
        setPremove(null);
      } else if (isGameOver) {
        setStatus('Game Over - Draw');
        setGameOverMessage({
          title: 'Draw',
          message: 'Game ended in a draw',
          type: 'draw'
        });
        setPremove(null);
      } else if (isCheck) {
        setStatus('Check! ⚠️');
      } else {
        setStatus(`${newGame.turn() === 'w' ? 'White' : 'Black'}'s turn`);
      }
    });

    newSocket.on('opponentDisconnected', () => {
      setStatus('Opponent disconnected. You win! 🎉');
      setGameOverMessage({
        title: 'Victory!',
        message: 'Opponent disconnected',
        type: 'win'
      });
      setPremove(null);
      setTimeout(() => {
        setGameId(null);
        setOpponent(null);
        setPlayerColor(null);
        setGameOverMessage(null);
      }, 3000);
    });

    return () => newSocket.close();
  }, [token, premove, gameId, playerColor, socket]);

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
  };

  const isMyTurn = () => {
    const turn = game.turn();
    return (turn === 'w' && playerColor === 'white') || (turn === 'b' && playerColor === 'black');
  };

  const onSquareClick = (square) => {
    if (!gameId || !playerColor) return;

    const gameCopy = new Chess(game.fen());
    const piece = gameCopy.get(square);
    const myColor = playerColor === 'white' ? 'w' : 'b';

    // If it's not my turn, handle premoves
    if (!isMyTurn()) {
      if (selectedSquare) {
        // Set premove
        setPremove({ from: selectedSquare, to: square });
        setSelectedSquare(null);
        setLegalMoves([]);
      } else if (piece && piece.color === myColor) {
        // Select piece for premove
        setSelectedSquare(square);
        const moves = gameCopy.moves({ square, verbose: true });
        setLegalMoves(moves.map(m => m.to));
      }
      return;
    }

    // Normal move (it's my turn)
    if (selectedSquare) {
      const move = gameCopy.move({
        from: selectedSquare,
        to: square,
        promotion: 'q'
      });

      if (move && socket) {
        setGame(gameCopy);
        socket.emit('makeMove', {
          gameId,
          move: { from: selectedSquare, to: square, promotion: 'q' }
        });
        setSelectedSquare(null);
        setLegalMoves([]);
        setPremove(null);
      } else if (piece && piece.color === myColor) {
        // Clicking on another own piece - select it
        setSelectedSquare(square);
        const moves = gameCopy.moves({ square, verbose: true });
        setLegalMoves(moves.map(m => m.to));
      } else {
        // Invalid move - deselect
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    } else if (piece && piece.color === myColor) {
      // Select piece
      setSelectedSquare(square);
      const moves = gameCopy.moves({ square, verbose: true });
      setLegalMoves(moves.map(m => m.to));
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    if (!gameId || !playerColor) return false;
    
    const gameCopy = new Chess(game.fen());
    
    // If not our turn, set as premove
    if (!isMyTurn()) {
      setPremove({ from: sourceSquare, to: targetSquare });
      return false;
    }

    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move && socket) {
        setGame(gameCopy);
        socket.emit('makeMove', {
          gameId,
          move: { from: sourceSquare, to: targetSquare, promotion: 'q' }
        });
        setSelectedSquare(null);
        setLegalMoves([]);
        setPremove(null);
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  };

  const customSquareStyles = {};
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
  }
  if (premove) {
    customSquareStyles[premove.from] = { backgroundColor: 'rgba(239, 68, 68, 0.4)' };
    customSquareStyles[premove.to] = { backgroundColor: 'rgba(239, 68, 68, 0.6)' };
  }
  legalMoves.forEach(square => {
    customSquareStyles[square] = { 
      background: 'radial-gradient(circle, rgba(20, 184, 166, 0.5) 25%, transparent 25%)',
      borderRadius: '50%'
    };
  });

  const currentBoardStyle = boardStyles[boardStyle];

  return (
    <div className="game-container">
      {gameOverMessage && (
        <div className="game-over-overlay">
          <div className={`game-over-popup ${gameOverMessage.type}`}>
            <button className="close-popup" onClick={() => setGameOverMessage(null)}>
              <FaTimes />
            </button>
            <h2>{gameOverMessage.title}</h2>
            <p>{gameOverMessage.message}</p>
            <div className="popup-icon">
              {gameOverMessage.type === 'win' ? '👑' : gameOverMessage.type === 'loss' ? '😔' : '🤝'}
            </div>
          </div>
        </div>
      )}

      <div className="game-sidebar">
        {opponent && (
          <div className="player-card opponent-card">
            <div className="player-avatar opponent-avatar">
              {opponent.username[0].toUpperCase()}
            </div>
            <div className="player-details">
              <div className="player-label">OPPONENT</div>
              <div className="player-username">{opponent.username}</div>
              <div className="player-elo-badge">{opponent.elo} ELO</div>
            </div>
          </div>
        )}

        <div className="status-card">
          <div className="status-text">{status}</div>
          {isWaiting && <div className="searching-dots">{dots}</div>}
          {premove && <div className="premove-indicator">⏱️ Premove set</div>}
        </div>

        {isWaiting && (
          <div className="queue-card">
            <div className="queue-animation">
              <div className="queue-circle"></div>
              <div className="queue-circle"></div>
              <div className="queue-circle"></div>
            </div>
            <p>Finding opponent{dots}</p>
            <button onClick={cancelSearch} className="cancel-button">
              Cancel
            </button>
          </div>
        )}

        {!gameId && !isWaiting && (
          <button onClick={findGame} className="find-game-btn">
            <FaSearch />
            <span>Find Game</span>
          </button>
        )}

        {user && (
          <div className="player-card current-player-card">
            <div className="player-avatar current-avatar">
              {user.username[0].toUpperCase()}
            </div>
            <div className="player-details">
              <div className="player-label">YOU {gameId && `(${playerColor})`}</div>
              <div className="player-username">{user.username}</div>
              <div className="player-elo-badge">{user.stats.elo} ELO</div>
            </div>
          </div>
        )}
      </div>

      <div className="board-container">
        <Chessboard 
          position={game.fen()} 
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          boardOrientation={playerColor || 'white'}
          boardWidth={500}
          customSquareStyles={customSquareStyles}
          customBoardStyle={{
            borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
          customDarkSquareStyle={{ backgroundColor: currentBoardStyle.dark }}
          customLightSquareStyle={{ backgroundColor: currentBoardStyle.light }}
        />
      </div>
    </div>
  );
}

export default GameBoard;