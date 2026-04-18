// =============================================
// components/Navbar.js - Top Navigation Bar
// Shows app name, navigation links, and logout button
// =============================================

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();     // Get user info and logout function
  const location = useLocation();          // Current URL path (to highlight active link)

  // Handle logout click
  const handleLogout = () => {
    logout(); // Clears token and user state, will redirect to login
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">

          {/* Logo / App Name */}
          <Link to="/dashboard" className="navbar-brand">
            <span className="navbar-logo">💰</span>
            <span className="navbar-title">ExpenseTracker</span>
          </Link>

          {/* Navigation Links */}
          <div className="navbar-links">
            <Link
              to="/dashboard"
              className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link
              to="/expenses/add"
              className={`navbar-link ${location.pathname === '/expenses/add' ? 'active' : ''}`}
            >
              + Add Expense
            </Link>
          </div>

          {/* User Info + Logout */}
          <div className="navbar-user">
            {/* Show first letter of user's name as avatar */}
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{user?.name}</span>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
