import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { FaChessKnight } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      console.error('Login error details:', err);
      setError(err.message || 'Login failed. Please try again.');
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
          <h1>Welcome Back</h1>
          <p>Enter your credentials to continue your chess journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
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
                placeholder="Enter your password"
                className="modern-input"
              />
              <span className="input-border"></span>
            </div>
          </div>

          <div className="form-footer">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`} 
            disabled={loading}
          >
            <span className="button-text">
              {loading ? 'Logging in...' : 'Sign In'}
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
          <span>Don't have an account?</span>
          <Link to="/register" className="auth-link">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;