import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useAuth } from '../Context/AuthContext';
import { FaRobot, FaTimes, FaUndo, FaTrophy, FaPuzzlePiece, FaArrowRight, FaLightbulb, FaRandom } from 'react-icons/fa';
import { PUZZLES, getPuzzlesByRating, getRandomPuzzle } from '../Data/puzzles';

function Practice() {
  const { user } = useAuth();
  const [mode, setMode] = useState(null); // 'bot' or 'puzzle'
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [playerColor, setPlayerColor] = useState('white');
  const [status, setStatus] = useState('Choose a mode');
  const [gameOverMessage, setGameOverMessage] = useState(null);
  const [thinking, setThinking] = useState(false);

  // Puzzle mode
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);

  const boardStyle = user?.settings?.boardStyle || 'classic';

  const boardStyles = {
    classic: { light: '#d1d5db', dark: '#4b5563' },
    modern: { light: '#e0e7ff', dark: '#4f46e5' },
    wood: { light: '#f0d9b5', dark: '#b58863' }
  };

  // Bot makes a move
  const makeBotMove = (currentGame, diff) => {
    setThinking(true);
    
    setTimeout(() => {
      const moves = currentGame.moves({ verbose: true });
      if (moves.length === 0) return;

      let selectedMove;

      if (diff === 'easy') {
        selectedMove = moves[Math.floor(Math.random() * moves.length)];
      } else if (diff === 'medium') {
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
        selectedMove = getBestMove(currentGame, moves);
      }

      const newGame = new Chess(currentGame.fen());
      newGame.move(selectedMove);
      setGame(newGame);
      setThinking(false);

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
        setGameOverMessage({ title: 'Draw', message: 'Game ended in a draw', type: 'draw' });
      } else if (newGame.isCheck()) {
        setStatus('Check!');
      } else {
        setStatus('Your turn');
      }
    }, 500);
  };

  const getBestMove = (currentGame, moves) => {
    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let bestMove = moves[0];
    let bestScore = -Infinity;

    moves.forEach(move => {
      let score = Math.random() * 0.5;
      if (move.captured) score += pieceValues[move.captured] * 10;
      const testGame = new Chess(currentGame.fen());
      testGame.move(move);
      if (testGame.inCheck()) score += 5;
      const centerSquares = ['d4', 'd5', 'e4', 'e5'];
      if (centerSquares.includes(move.to)) score += 2;
      if (move.piece === 'n' || move.piece === 'b') score += 1;
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });

    return bestMove;
  };

  const startBotGame = (diff, color) => {
    const newGame = new Chess();
    setGame(newGame);
    setDifficulty(diff);
    setPlayerColor(color);
    setGameStarted(true);
    setMode('bot');
    setGameOverMessage(null);
    setStatus(color === 'white' ? 'Your turn' : 'Bot is thinking...');

    if (color === 'black') {
      makeBotMove(newGame, diff);
    }
  };

  const startPuzzle = (difficulty = 'random') => {
    let puzzle;
    
    if (difficulty === 'easy') {
      const easyPuzzles = getPuzzlesByRating(600, 1200);
      puzzle = easyPuzzles[Math.floor(Math.random() * easyPuzzles.length)];
    } else if (difficulty === 'medium') {
      const mediumPuzzles = getPuzzlesByRating(1200, 1800);
      puzzle = mediumPuzzles[Math.floor(Math.random() * mediumPuzzles.length)];
    } else if (difficulty === 'hard') {
      const hardPuzzles = getPuzzlesByRating(1800, 2500);
      puzzle = hardPuzzles[Math.floor(Math.random() * hardPuzzles.length)];
    } else {
      puzzle = getRandomPuzzle();
    }
    
    setCurrentPuzzle(puzzle);
    const newGame = new Chess(puzzle.fen);
    setGame(newGame);
    setMode('puzzle');
    setGameStarted(true);
    setSolutionIndex(0);
    setPuzzleSolved(false);
    setMoveHistory([]);
    setPlayerColor(newGame.turn() === 'w' ? 'white' : 'black');
    setStatus(`Rating: ${puzzle.rating} - Find the best move!`);
    setGameOverMessage(null);
  };

  const nextPuzzle = () => {
    startPuzzle(difficulty);
  };

  const resetGame = () => {
    setGame(new Chess());
    setGameStarted(false);
    setMode(null);
    setDifficulty(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setStatus('Choose a mode');
    setGameOverMessage(null);
    setCurrentPuzzle(null);
    setPuzzleSolved(false);
  };

  const undoMove = () => {
    const newGame = new Chess(game.fen());
    newGame.undo();
    newGame.undo();
    setGame(newGame);
    setSelectedSquare(null);
    setLegalMoves([]);
    setStatus('Your turn');
  };

  const showHint = () => {
    if (currentPuzzle && solutionIndex < currentPuzzle.solution.length) {
      const move = currentPuzzle.solution[solutionIndex];
      const from = move.substring(0, 2);
      const to = move.substring(2, 4);
      setSelectedSquare(from);
      const moves = game.moves({ square: from, verbose: true });
      setLegalMoves(moves.map(m => m.to));
      setStatus(`Hint: Move from ${from} to ${to}`);
    }
  };

  const onSquareClick = (square) => {
    if (!gameStarted || thinking || puzzleSolved) return;
    if (game.isGameOver()) return;

    if (mode === 'puzzle') {
      const turn = game.turn();
      if ((turn === 'w' && playerColor !== 'white') || (turn === 'b' && playerColor !== 'black')) return;
    } else {
      const turn = game.turn();
      if ((turn === 'w' && playerColor !== 'white') || (turn === 'b' && playerColor !== 'black')) return;
    }

    if (selectedSquare) {
      const newGame = new Chess(game.fen());
      const move = newGame.move({ from: selectedSquare, to: square, promotion: 'q' });

      if (move) {
        setGame(newGame);
        setSelectedSquare(null);
        setLegalMoves([]);

        if (mode === 'puzzle') {
          checkPuzzleMove(move);
        } else {
          handleBotGameMove(newGame);
        }
      } else {
        const piece = newGame.get(square);
        const turn = newGame.turn();
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
      const turn = game.turn();
      if (piece && ((turn === 'w' && piece.color === 'w') || (turn === 'b' && piece.color === 'b'))) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setLegalMoves(moves.map(m => m.to));
      }
    }
  };

  const checkPuzzleMove = (move) => {
    const expectedMove = currentPuzzle.solution[solutionIndex];
    const madeMove = move.from + move.to;

    if (madeMove === expectedMove) {
      setMoveHistory([...moveHistory, madeMove]);
      setSolutionIndex(solutionIndex + 1);

      if (solutionIndex + 1 >= currentPuzzle.solution.length) {
        setPuzzleSolved(true);
        setStatus('Puzzle solved! 🎉');
        setGameOverMessage({
          title: 'Puzzle Solved!',
          message: `Rating: ${currentPuzzle.rating} - Great job!`,
          type: 'win'
        });
      } else {
        setStatus('Correct! Continue...');
        // Auto-make opponent's response if there are more moves
        if (solutionIndex + 1 < currentPuzzle.solution.length) {
          setTimeout(() => {
            const nextMove = currentPuzzle.solution[solutionIndex + 1];
            const from = nextMove.substring(0, 2);
            const to = nextMove.substring(2, 4);
            const newGame = new Chess(game.fen());
            newGame.move({ from, to, promotion: 'q' });
            setGame(newGame);
            setSolutionIndex(solutionIndex + 2);
            setStatus('Your turn - find the next move!');
          }, 500);
        }
      }
    } else {
      setStatus('❌ Wrong move! Try again.');
      setGame(new Chess(currentPuzzle.fen));
      setSolutionIndex(0);
      setMoveHistory([]);
    }
  };

  const handleBotGameMove = (newGame) => {
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
      setGameOverMessage({ title: 'Draw', message: 'Game ended in a draw', type: 'draw' });
    } else {
      setStatus('Bot is thinking...');
      makeBotMove(newGame, difficulty);
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    if (!gameStarted || thinking || puzzleSolved) return false;
    if (game.isGameOver()) return false;

    if (mode === 'puzzle') {
      const turn = game.turn();
      if ((turn === 'w' && playerColor !== 'white') || (turn === 'b' && playerColor !== 'black')) return false;
    } else {
      const turn = game.turn();
      if ((turn === 'w' && playerColor !== 'white') || (turn === 'b' && playerColor !== 'black')) return false;
    }

    const newGame = new Chess(game.fen());
    try {
      const move = newGame.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });

      if (move) {
        setGame(newGame);
        setSelectedSquare(null);
        setLegalMoves([]);

        if (mode === 'puzzle') {
          checkPuzzleMove(move);
        } else {
          handleBotGameMove(newGame);
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

  const currentBoardStyle = boardStyles[boardStyle];

  return (
    <div className="practice-container">
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
            {mode === 'puzzle' && (
              <button className="play-again-btn" onClick={nextPuzzle}>
                <FaArrowRight /> Next Puzzle
              </button>
            )}
            {mode === 'bot' && (
              <button className="play-again-btn" onClick={resetGame}>
                Play Again
              </button>
            )}
          </div>
        </div>
      )}

      <div className="practice-header">
        <FaRobot className="practice-icon" />
        <h1>Practice Mode</h1>
      </div>

      {!gameStarted ? (
        <div className="mode-selection">
          <h2>Choose Practice Mode</h2>
          
          <div className="mode-cards">
            <div className="mode-card" onClick={() => setMode('bot-select')}>
              <div className="mode-icon"><FaRobot /></div>
              <h3>Play vs Bot</h3>
              <p>Practice against AI opponents</p>
            </div>

            <div className="mode-card" onClick={() => setMode('puzzle-select')}>
              <div className="mode-icon"><FaPuzzlePiece /></div>
              <h3>Solve Puzzles</h3>
              <p>Improve your tactical skills</p>
            </div>
          </div>

          {mode === 'bot-select' && (
            <div className="difficulty-selection">
              <h2>Choose Difficulty</h2>
              <div className="difficulty-cards">
                <div className="difficulty-card easy">
                  <div className="difficulty-icon">🤖</div>
                  <h3>Easy</h3>
                  <p>Random moves - Perfect for beginners</p>
                  <div className="color-selection">
                    <button onClick={() => startBotGame('easy', 'white')} className="color-btn white">
                      Play as White
                    </button>
                    <button onClick={() => startBotGame('easy', 'black')} className="color-btn black">
                      Play as Black
                    </button>
                  </div>
                </div>

                <div className="difficulty-card medium">
                  <div className="difficulty-icon">🎯</div>
                  <h3>Medium</h3>
                  <p>Tactical moves - Good challenge</p>
                  <div className="color-selection">
                    <button onClick={() => startBotGame('medium', 'white')} className="color-btn white">
                      Play as White
                    </button>
                    <button onClick={() => startBotGame('medium', 'black')} className="color-btn black">
                      Play as Black
                    </button>
                  </div>
                </div>

                <div className="difficulty-card hard">
                  <div className="difficulty-icon">🧠</div>
                  <h3>Hard</h3>
                  <p>Strategic play - Real challenge</p>
                  <div className="color-selection">
                    <button onClick={() => startBotGame('hard', 'white')} className="color-btn white">
                      Play as White
                    </button>
                    <button onClick={() => startBotGame('hard', 'black')} className="color-btn black">
                      Play as Black
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === 'puzzle-select' && (
            <div className="difficulty-selection">
              <h2>Choose Puzzle Difficulty</h2>
              <div className="difficulty-cards">
                <div className="difficulty-card easy" onClick={() => { setDifficulty('easy'); startPuzzle('easy'); }}>
                  <div className="difficulty-icon">⭐</div>
                  <h3>Easy</h3>
                  <p>Rating: 600-1200</p>
                  <button className="color-btn white">Start Easy Puzzles</button>
                </div>

                <div className="difficulty-card medium" onClick={() => { setDifficulty('medium'); startPuzzle('medium'); }}>
                  <div className="difficulty-icon">⭐⭐</div>
                  <h3>Medium</h3>
                  <p>Rating: 1200-1800</p>
                  <button className="color-btn white">Start Medium Puzzles</button>
                </div>

                <div className="difficulty-card hard" onClick={() => { setDifficulty('hard'); startPuzzle('hard'); }}>
                  <div className="difficulty-icon">⭐⭐⭐</div>
                  <h3>Hard</h3>
                  <p>Rating: 1800+</p>
                  <button className="color-btn white">Start Hard Puzzles</button>
                </div>

                <div className="difficulty-card" style={{borderColor: 'var(--accent)'}} onClick={() => { setDifficulty('random'); startPuzzle('random'); }}>
                  <div className="difficulty-icon"><FaRandom /></div>
                  <h3>Random</h3>
                  <p>All difficulties mixed</p>
                  <button className="color-btn white">Start Random Puzzles</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="practice-game">
          <div className="practice-sidebar">
            {mode === 'bot' && (
              <div className="bot-card">
                <div className="bot-avatar"><FaRobot /></div>
                <div className="bot-info">
                  <div className="bot-label">OPPONENT</div>
                  <div className="bot-name">
                    {difficulty === 'easy' ? 'Easy Bot' : difficulty === 'medium' ? 'Medium Bot' : 'Hard Bot'}
                  </div>
                  <div className="bot-difficulty">{difficulty.toUpperCase()}</div>
                </div>
              </div>
            )}

            {mode === 'puzzle' && currentPuzzle && (
              <div className="puzzle-info-card">
                <div className="puzzle-icon"><FaPuzzlePiece /></div>
                <h3>Chess Puzzle</h3>
                <p className="puzzle-difficulty">Rating: {currentPuzzle.rating}</p>
                <p className="puzzle-desc">{currentPuzzle.themes?.join(', ') || 'Tactical puzzle'}</p>
                <p className="puzzle-moves">Moves to find: {currentPuzzle.solution.length}</p>
              </div>
            )}

            <div className="status-card">
              <div className="status-text">{status}</div>
              {thinking && <div className="bot-thinking">Bot is thinking...</div>}
            </div>

            <div className="game-controls">
              {mode === 'bot' && (
                <button onClick={undoMove} className="control-btn undo" disabled={thinking || game.history().length < 2}>
                  <FaUndo /> Undo Move
                </button>
              )}
              {mode === 'puzzle' && !puzzleSolved && (
                <button onClick={showHint} className="control-btn hint">
                  <FaLightbulb /> Show Hint
                </button>
              )}
              {mode === 'puzzle' && (
                <button onClick={nextPuzzle} className="control-btn new-game">
                  <FaArrowRight /> Next Puzzle
                </button>
              )}
              <button onClick={resetGame} className="control-btn new-game">
                <FaTrophy /> Main Menu
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
              customDarkSquareStyle={{ backgroundColor: currentBoardStyle.dark }}
              customLightSquareStyle={{ backgroundColor: currentBoardStyle.light }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Practice;