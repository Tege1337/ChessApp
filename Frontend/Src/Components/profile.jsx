import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { FaTrophy, FaChessBoard, FaFire, FaPercent } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function Profile() {
  const { user, token } = useAuth();
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameHistory();
  }, []);

  const fetchGameHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGameHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch game history:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalGames = user?.stats?.wins + user?.stats?.losses + user?.stats?.draws;
  const winRate = totalGames > 0 ? ((user?.stats?.wins / totalGames) * 100).toFixed(0) : 0;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-large">{user?.username?.[0]?.toUpperCase()}</div>
        <h1>{user?.username}</h1>
        <div className="profile-elo">
          <FaTrophy /> {user?.stats?.elo} ELO
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card-modern wins">
          <div className="stat-icon"><FaTrophy /></div>
          <div className="stat-value">{user?.stats?.wins}</div>
          <div className="stat-label">Wins</div>
        </div>
        <div className="stat-card-modern losses">
          <div className="stat-icon"><FaFire /></div>
          <div className="stat-value">{user?.stats?.losses}</div>
          <div className="stat-label">Losses</div>
        </div>
        <div className="stat-card-modern draws">
          <div className="stat-icon"><FaChessBoard /></div>
          <div className="stat-value">{user?.stats?.draws}</div>
          <div className="stat-label">Draws</div>
        </div>
        <div className="stat-card-modern winrate">
          <div className="stat-icon"><FaPercent /></div>
          <div className="stat-value">{winRate}%</div>
          <div className="stat-label">Win Rate</div>
        </div>
      </div>

      {/* Game History */}
      <div className="game-history-modern">
        <h2>Recent Games</h2>
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : gameHistory.length === 0 ? (
          <div className="no-games">No games yet. Start playing!</div>
        ) : (
          <div className="history-list-modern">
            {gameHistory.map((game) => {
              const isWhite = game.whitePlayer._id === user.id;
              const opponent = isWhite ? game.blackPlayer : game.whitePlayer;
              const result = game.winner === 'draw' ? 'draw' : 
                           (game.winner === (isWhite ? 'white' : 'black') ? 'won' : 'lost');
              
              return (
                <div key={game._id} className={`history-card ${result}`}>
                  <div className="history-result-badge">{result.toUpperCase()}</div>
                  <div className="history-info">
                    <div className="history-opponent">vs {opponent.username}</div>
                    <div className="history-date">
                      {new Date(game.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;