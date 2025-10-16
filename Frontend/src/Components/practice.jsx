import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useAuth } from '../Context/AuthContext';
import { FaRobot, FaTimes, FaUndo, FaTrophy } from 'react-icons/fa';

function Practice() {
  const { user } = useAuth();
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [playerColor, setPlayerColor] = useState('white');
  const [status, setStatus] = useState('Choose difficulty to start');
  const [gameOverMessage, setGameOverMessage] = useState(null);
  const [thinking, setThinking] = useState(false);

  // Bot makes a move
  const makeBotMove = (currentGame, diff) => {
    setThinking(true);
    
    setTimeout(() => {
      const moves = currentGame.moves({ verbose: true });
      if (moves.length === 0) return;

      let selectedMove;

      if (diff === 'easy') {
        // Easy: Random move
        selectedMove = moves[Math.floor(Math.random() * moves.length)];
      } else if (diff === 'medium') {
        // Medium: Prefer captures, checks, or random
        const captures = moves.filter(m => m.captured);
        const checks = moves.filter(m => {
          const testGame = new Chess(currentGame.fen());
          testGame.move(m);
          return testGame.inCheck();
        });
        
        if (captures.length > 0 && Math.random() > 0.3) {
          selectedMove = captures[Math.floor(Math.random() * captures.length)];
        } else if (checks.length > 0 && Math.random() > 0.5) {
          selectedMove = checks[Math.floor(Math.random() * checks.length)];
        } else {
          selectedMove = moves[Math.floor(Math.random() * moves.length)];
        }
      } else if (diff === 'hard') {
        // Hard: Evaluate positions (simple minimax)
        selectedMove = getBestMove(currentGame, moves);
      }

      const newGame = new Chess(currentGame.fen());
      newGame.move(selectedMove);
      setGame(newGame);
      setThinking(false);

      // Check game state
      if (newGame.isCheckmate()) {
        const winner = newGame.turn() === 'w' ? 'Black' : 'White';
        setStatus(`Checkmate! ${winner} wins!`);
        setGameOverMessage({
          title: winner === playerColor.charAt(0).toUpperCase() + playerColor.slice(1) ? 'Victory!' : 'Defeat!',
          message: `${winner} wins by checkmate`,
          type: winner === playerColor.charAt(0).toUpperCase() + playerColor.slice(1) ? 'win' : 'loss'
        });
      } else if (newGame.isDraw()) {
        setStatus('Draw!');
        setGameOverMessage({
          title: 'Draw',
          message: 'Game ended in a draw',
          type: 'draw'
        });
      } else if (newGame.isCheck()) {
        setStatus('Check!');
      } else {
        setStatus('Your turn');
      }
    }, 500); // Bot "thinks" for 500ms
  };

  // Simple evaluation for hard mode
  const getBestMove = (currentGame, moves) => {
    const pieceValues = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 0
    };

    let bestMove = moves[0];
    let bestScore = -Infinity;

    moves.forEach(move => {
      let score = Math.random() * 0.5; // Add randomness

      // Prioritize captures
      if (move.captured) {
        score += pieceValues[move.captured] * 10;
      }

      // Prioritize checks
      const testGame = new Chess(currentGame.fen());
      testGame.move(move);
      if (testGame.inCheck()) {
        score += 5;
      }

      // Prioritize center control
      const centerSquares = ['d4', 'd5', 'e4', 'e5'];
      if (centerSquares.includes(move.to)) {
        score += 2;
      }

      // Prioritize piece development
      if (move.piece === 'n' || move.piece === 'b') {
        score += 1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });

    return bestMove;
  };

  const startGame = (diff, color) => {
    const newGame = new Chess();
    setGame(newGame);
    setDifficulty(diff);
    setPlayerColor(color);
    setGameStarted(true);
    setGameOverMessage(null);
    setStatus(color === 'white' ? 'Your turn' : 'Bot is thinking...');

    // If player chose black, bot makes first move
    if (color === 'black') {
      makeBotMove(newGame, diff);
    }
  };

  const resetGame = () => {
    setGame(new Chess());
    setGameStarted(false);
    setDifficulty(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setStatus('Choose difficulty to start');
    setGameOverMessage(null);
  };

  const undoMove = () => {
    const newGame = new Chess(game.fen());
    newGame.undo(); // Undo bot move
    newGame.undo(); // Undo player move
    setGame(newGame);
    setSelectedSquare(null);
    setLegalMoves([]);
    setStatus('Your turn');
  };

  const onSquareClick = (square) => {
    if (!gameStarted || thinking) return;
    if (game.isGameOver()) return;

    const turn = game.turn();
    if ((turn === 'w' && playerColor !== 'white') || (turn === 'b' && playerColor !== 'black')) {
      return;
    }

    if (selectedSquare) {
      const newGame = new Chess(game.fen());
      const move = newGame.move({
        from: selectedSquare,
        to: square,
        promotion: 'q'
      });

      if (move) {
        setGame(newGame);
        setSelectedSquare(null);
        setLegalMoves([]);
        
        if (newGame.isCheckmate()) {
          const winner = newGame.turn() === 'w' ? 'Black' : 'White';
          setStatus(`Checkmate! ${winner} wins!`);
          setGameOverMessage({
            title: 'Victory!',
            message: 'You won by checkmate!',
            type: 'win'
          });
        } else if (newGame.isDraw()) {
          setStatus('Draw!');
          setGameOverMessage({
            title: 'Draw',
            message: 'Game ended in a draw',
            type: 'draw'
          });
        } else {
          setStatus('Bot is thinking...');
          makeBotMove(newGame, difficulty);
        }
      } else {
        const piece = newGame.get(square);
        if (piece && ((turn === 'w' && piece.color === 'w') || (turn === 'b' && piece.color === 'b'))) {
          setSelectedSquare(square);
          const moves = newGame.moves({ square, verbose: true });
          setLegalMoves(moves.map(m => m.to));
        } else {
          setSelectedSquare(null);
          setLegalMoves([]);
        }
      }
    } else {
      const piece = game.get(square);
      if (piece && ((turn === 'w' && piece.color === 'w') || (turn === 'b' && piece.color === 'b'))) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setLegalMoves(moves.map(m => m.to));
      }
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    if (!gameStarted || thinking) return false;
    if (game.isGameOver()) return false;

    const turn = game.turn();
    if ((turn === 'w' && playerColor !== 'white') || (turn === 'b' && playerColor !== 'black')) {
      return false;
    }

    const newGame = new Chess(game.fen());
    try {
      const move = newGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move) {
        setGame(newGame);
        setSelectedSquare(null);
        setLegalMoves([]);

        if (newGame.isCheckmate()) {
          const winner = newGame.turn() === 'w' ? 'Black' : 'White';
          setStatus(`Checkmate! ${winner} wins!`);
          setGameOverMessage({
            title: 'Victory!',
            message: 'You won by checkmate!',
            type: 'win'
          });
        } else if (newGame.isDraw()) {
          setStatus('Draw!');
          setGameOverMessage({
            title: 'Draw',
            message: 'Game ended in a draw',
            type: 'draw'
          });
        } else {
          setStatus('Bot is thinking...');
          makeBotMove(newGame, difficulty);
        }
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
  legalMoves.forEach(square => {
    customSquareStyles[square] = { 
      background: 'radial-gradient(circle, rgba(20, 184, 166, 0.5) 25%, transparent 25%)',
      borderRadius: '50%'
    };
  });

  return (
    <div className="practice-container">
      {/* Game Over Popup */}
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
            <button className="play-again-btn" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}

      <div className="practice-header">
        <FaRobot className="practice-icon" />
        <h1>Practice Mode</h1>
      </div>

      {!gameStarted ? (
        <div className="difficulty-selection">
          <h2>Choose Difficulty</h2>
          <div className="difficulty-cards">
            <div className="difficulty-card easy">
              <div className="difficulty-icon">🤖</div>
              <h3>Easy</h3>
              <p>Random moves - Perfect for beginners</p>
              <div className="color-selection">
                <button onClick={() => startGame('easy', 'white')} className="color-btn white">
                  Play as White
                </button>
                <button onClick={() => startGame('easy', 'black')} className="color-btn black">
                  Play as Black
                </button>
              </div>
            </div>

            <div className="difficulty-card medium">
              <div className="difficulty-icon">🎯</div>
              <h3>Medium</h3>
              <p>Tactical moves - Good challenge</p>
              <div className="color-selection">
                <button onClick={() => startGame('medium', 'white')} className="color-btn white">
                  Play as White
                </button>
                <button onClick={() => startGame('medium', 'black')} className="color-btn black">
                  Play as Black
                </button>
              </div>
            </div>

            <div className="difficulty-card hard">
              <div className="difficulty-icon">🧠</div>
              <h3>Hard</h3>
              <p>Strategic play - Real challenge</p>
              <div className="color-selection">
                <button onClick={() => startGame('hard', 'white')} className="color-btn white">
                  Play as White
                </button>
                <button onClick={() => startGame('hard', 'black')} className="color-btn black">
                  Play as Black
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="practice-game">
          <div className="practice-sidebar">
            <div className="bot-card">
              <div className="bot-avatar">
                <FaRobot />
              </div>
              <div className="bot-info">
                <div className="bot-label">OPPONENT</div>
                <div className="bot-name">
                  {difficulty === 'easy' ? 'Easy Bot' : difficulty === 'medium' ? 'Medium Bot' : 'Hard Bot'}
                </div>
                <div className="bot-difficulty">{difficulty.toUpperCase()}</div>
              </div>
            </div>

            <div className="status-card">
              <div className="status-text">{status}</div>
              {thinking && <div className="bot-thinking">Bot is thinking...</div>}
            </div>

            <div className="game-controls">
              <button onClick={undoMove} className="control-btn undo" disabled={thinking || game.history().length < 2}>
                <FaUndo /> Undo Move
              </button>
              <button onClick={resetGame} className="control-btn new-game">
                <FaTrophy /> New Game
              </button>
            </div>

            <div className="player-card current-player-card">
              <div className="player-avatar current-avatar">
                {user.username[0].toUpperCase()}
              </div>
              <div className="player-details">
                <div className="player-label">YOU ({playerColor})</div>
                <div className="player-username">{user.username}</div>
                <div className="player-elo-badge">{user.stats.elo} ELO</div>
              </div>
            </div>
          </div>

          <div className="board-container">
            <Chessboard 
              position={game.fen()} 
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
              boardOrientation={playerColor}
              boardWidth={500}
              customSquareStyles={customSquareStyles}
              customBoardStyle={{
                borderRadius: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
              }}
              customDarkSquareStyle={{ backgroundColor: '#4b5563' }}
              customLightSquareStyle={{ backgroundColor: '#d1d5db' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Practice;