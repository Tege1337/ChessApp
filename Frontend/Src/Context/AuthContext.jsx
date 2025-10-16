import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

// Add request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await fetchUserProfile();
      } catch (error) {
        console.error('Auth initialization failed:', error);
        logout();
      }
    };

    initAuth();
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000 // 5 second timeout
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      if (error.code === 'ECONNABORTED' || !error.response) {
        // Connection error - server might be down
        console.log('Server connection failed');
        setUser(null);
      } else if (error.response?.status === 401) {
        // Invalid token
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (!error.response) {
        throw new Error('Unable to connect to server');
      } else {
        throw new Error('An error occurred during login');
      }
    }
  };

  const register = async (username, email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateSettings = async (settings) => {
    const response = await axios.patch(`${API_URL}/api/user/settings`, settings, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(response.data);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateSettings, loading }}>
      {children}
    </AuthContext.Provider>
  );
};