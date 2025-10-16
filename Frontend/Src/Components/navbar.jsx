import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { FaChessKnight, FaUser, FaCog, FaSignOutAlt, FaUserFriends, FaRobot } from 'react-icons/fa';

function Navbar() {
  const { logout, user } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <FaChessKnight /> Chess Arena
      </Link>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          <FaChessKnight /> Play
        </Link>
        <Link to="/practice" className="nav-link">
          <FaRobot /> Practice
        </Link>
        <Link to="/friends" className="nav-link">
          <FaUserFriends /> Friends
        </Link>
        <Link to="/profile" className="nav-link">
          <FaUser /> Profile
        </Link>
        <Link to="/settings" className="nav-link">
          <FaCog /> Settings
        </Link>
        <button onClick={logout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;