import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { FaTrophy, FaChessBoard, FaFire, FaPercent, FaUserEdit } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function Profile() {
  const { user, token } = useAuth();
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameHistory();
    // eslint-disable-next-line
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
    <div className="profile-modern-container">
      {/* Profile Card */}
      <div className="profile-modern-header">
        <div className="profile-modern-avatar">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div className="profile-modern-info">
          <h1>{user?.username}</h1>
          <div className="profile-modern-elo">
            <FaTrophy /> {user?.stats?.elo} ELO
          </div>
          <div className="profile-modern-email">{user?.email}</div>
        </div>
        <button className="profile-edit-btn" title="Edit Profile">
          <FaUserEdit />
        </button>
      </div>

      {/* Stats */}
      <div className="profile-modern-stats">
        <div className="stat-modern-card wins">
          <div className="stat-modern-icon"><FaTrophy /></div>
          <div className="stat-modern-value">{user?.stats?.wins}</div>
          <div className="stat-modern-label">Wins</div>
        </div>
        <div className="stat-modern-card losses">
          <div className="stat-modern-icon"><FaFire /></div>
          <div className="stat-modern-value">{user?.stats?.losses}</div>
          <div className="stat-modern-label">Losses</div>
        </div>
        <div className="stat-modern-card draws">
          <div className="stat-modern-icon"><FaChessBoard /></div>
          <div className="stat-modern-value">{user?.stats?.draws}</div>
          <div className="stat-modern-label">Draws</div>
        </div>
        <div className="stat-modern-card winrate">
          <div className="stat-modern-icon"><FaPercent /></div>
          <div className="stat-modern-value">{winRate}%</div>
          <div className="stat-modern-label">Win Rate</div>
        </div>
      </div>

      {/* Game History */}
      <div className="profile-modern-history">
        <h2>Recent Games</h2>
        {loading ? (
          <div className="profile-modern-loading">Loading...</div>
        ) : gameHistory.length === 0 ? (
          <div className="profile-modern-no-games">No games yet. Start playing!</div>
        ) : (
          <div className="profile-modern-history-list">
            {gameHistory.map((game) => {
              const isWhite = game.whitePlayer._id === user.id;
              const opponent = isWhite ? game.blackPlayer : game.whitePlayer;
              const result = game.winner === 'draw'
                ? 'draw'
                : (game.winner === (isWhite ? 'white' : 'black') ? 'won' : 'lost');
              return (
                <div key={game._id} className={`profile-modern-history-card ${result}`}>
                  <div className={`profile-modern-result-badge ${result}`}>
                    {result.toUpperCase()}
                  </div>
                  <div className="profile-modern-history-info">
                    <div className="profile-modern-opponent">
                      vs {opponent.username}
                    </div>
                    <div className="profile-modern-date">
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