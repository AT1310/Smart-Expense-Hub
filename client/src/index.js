// =============================================
// index.js - React App Entry Point
// This is where React starts rendering your app
// =============================================

import React from 'react';
import ReactDOM from 'react-dom/client'; // New React 18 way to render
import App from './App';                  // Main App component
import './styles/global.css';             // Global styles

// Find the <div id="root"> in public/index.html and mount our app there
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // StrictMode helps catch potential bugs during development
  // It renders components twice in dev to detect side effects
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
