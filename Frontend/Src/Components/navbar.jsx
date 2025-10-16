import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { FaChessKnight, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { FaUserFriends } from 'react-icons/fa';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FaChessKnight className="nav-logo-icon" />
          ChessApp
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Play</Link>
          <Link to="/profile" className="nav-link">
            <FaUser /> Profile
          </Link>
          <Link to="/friends" className="nav-link">
            <FaUserFriends /> Friends
          </Link>
          <Link to="/settings" className="nav-link">
            <FaCog /> Settings
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <div className="nav-user">
          <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-elo">ELO: {user?.stats?.elo}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;