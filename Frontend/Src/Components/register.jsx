import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { FaChessKnight } from 'react-icons/fa';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-background-pattern"></div>
        <div className="auth-background-overlay"></div>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-container">
            <FaChessKnight className="auth-logo" />
          </div>
          <h1>Create Account</h1>
          <p>Join our chess community and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label>Username</label>
            <div className="input-container">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                placeholder="Choose a username"
                className="modern-input"
              />
              <span className="input-border"></span>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="modern-input"
              />
              <span className="input-border"></span>
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-container">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Create a password"
                className="modern-input"
              />
              <span className="input-border"></span>
            </div>
            <span className="input-hint">Must be at least 6 characters</span>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-container">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                className="modern-input"
              />
              <span className="input-border"></span>
            </div>
          </div>

          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
            </label>
          </div>

          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`} 
            disabled={loading}
          >
            <span className="button-text">
              {loading ? 'Creating Account...' : 'Create Account'}
            </span>
            <span className="button-loader"></span>
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="social-auth">
          <button className="social-button google">
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Continue with Google
          </button>
        </div>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;