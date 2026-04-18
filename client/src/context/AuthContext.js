// =============================================
// context/AuthContext.js - Global Authentication State
// React Context lets us share state across all components
// without having to pass props through every level
// =============================================

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the context object
// This is like creating a "channel" to broadcast state
const AuthContext = createContext();

// The base URL for all API calls - comes from .env file
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// =============================================
// AuthProvider Component
// Wrap your entire app with this so all child
// components can access authentication state
// =============================================
export const AuthProvider = ({ children }) => {
  // State to store the current logged-in user
  const [user, setUser] = useState(null);

  // State to track if we're still loading user data
  const [loading, setLoading] = useState(true);

  // State for any authentication errors
  const [error, setError] = useState(null);

  // =============================================
  // EFFECT: Check for existing login on app start
  // This runs once when the app first loads
  // It checks localStorage for a saved token
  // =============================================
  useEffect(() => {
    const loadUser = async () => {
      // Check if a token exists in localStorage (from previous login)
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Set the default Authorization header for all future axios requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Verify the token is still valid by fetching user data
          const res = await axios.get(`${API_URL}/auth/me`);
          setUser(res.data.user); // Store user data in state
        } catch (err) {
          // Token is invalid or expired - clear it
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }

      setLoading(false); // Done loading whether we found a user or not
    };

    loadUser();
  }, []); // Empty array = run only once on mount

  // =============================================
  // REGISTER FUNCTION
  // Creates a new user account
  // =============================================
  const register = async (name, email, password) => {
    try {
      setError(null); // Clear any previous errors

      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      // Save token to localStorage so user stays logged in after refresh
      localStorage.setItem('token', res.data.token);

      // Set token as default header for all future API calls
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      // Update user state - this will re-render components that use it
      setUser(res.data.user);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  // =============================================
  // LOGIN FUNCTION
  // Logs in an existing user
  // =============================================
  const login = async (email, password) => {
    try {
      setError(null);

      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      // Save token and set as default header
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // =============================================
  // LOGOUT FUNCTION
  // Clears the user session
  // =============================================
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Remove the default Authorization header
    delete axios.defaults.headers.common['Authorization'];

    // Clear user from state
    setUser(null);
  };

  // Clear error messages (called when user starts typing in forms)
  const clearError = () => setError(null);

  // Everything we want to share with the rest of the app
  const value = {
    user,        // Current user object (null if not logged in)
    loading,     // True while checking for existing session
    error,       // Error message if login/register fails
    register,    // Function to create account
    login,       // Function to log in
    logout,      // Function to log out
    clearError,  // Function to clear error messages
  };

  // Provide the value to all child components
  // Show nothing while checking for existing session (avoids flash of login page)
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access auth context in any component
// Instead of: const { user, login } = useContext(AuthContext)
// You can write: const { user, login } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};

export default AuthContext;
