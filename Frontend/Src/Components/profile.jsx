import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaTrophy, FaChessBoard } from 'react-icons/fa';

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
  const winRate = totalGames > 0 ? ((user?.stats?.wins / totalGames) * 100).toFixed(1) : 0;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-large">{user?.username?.[0]?.toUpperCase()}</div>
        <h1>{user?.username}</h1>
        <div className="profile-elo">
          <FaTrophy className="trophy-icon" />
          ELO Rating: {user?.stats?.elo}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{user?.stats?.wins}</div>
          <div className="stat-label">Wins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{user?.stats?.losses}</div>
          <div className="stat-label">Losses</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{user?.stats?.draws}</div>
          <div className="stat-label">Draws</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{winRate}%</div>
          <div className="stat-label">Win Rate</div>
        </div>
      </div>

      <div className="game-history">
        <h2>
          <FaChessBoard /> Recent Games
        </h2>
        
        {loading ? (
          <div className="loading">Loading game history...</div>
        ) : gameHistory.length === 0 ? (
          <div className="no-games">No games played yet. Start your first game!</div>
        ) : (
          <div className="history-list">
            {gameHistory.map((game) => {
              const isWhite = game.whitePlayer._id === user.id;
              const opponent = isWhite ? game.blackPlayer : game.whitePlayer;
              const result = game.winner === 'draw' ? 'Draw' : 
                           (game.winner === (isWhite ? 'white' : 'black') ? 'Won' : 'Lost');
              
              return (
                <div key={game._id} className={`history-item ${result.toLowerCase()}`}>
                  <div className="history-info">
                    <div className="history-opponent">vs {opponent.username}</div>
                    <div className="history-date">
                      {new Date(game.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`history-result ${result.toLowerCase()}`}>
                    {result}
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