import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

// Add error boundary for development
if (process.env.NODE_ENV === 'development') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes('ResizeObserver')) return;
    originalConsoleError.apply(console, args);
  };
}

const root = document.getElementById('root');
if (!root) {
  console.error('Root element not found');
} else {
  const app = ReactDOM.createRoot(root);
  
  app.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}