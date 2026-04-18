// =============================================
// pages/LoginPage.js
// User login form - email + password
// On success, redirects to dashboard
// =============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth(); // Get login function from context

  // Local state for the form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Track if a request is in progress (to disable button)
  const [loading, setLoading] = useState(false);

  // Update form field when user types
  const handleChange = (e) => {
    clearError(); // Clear any existing error message
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // The spread operator (...formData) copies all existing fields,
    // then [e.target.name]: e.target.value updates the changed field
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit

    setLoading(true); // Disable button while waiting

    // Call login function from AuthContext
    const result = await login(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      // Login successful - go to dashboard
      navigate('/dashboard');
    }
    // If not successful, the error is stored in AuthContext and will display
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">💰</div>
          <h1>Welcome back</h1>
          <p className="text-secondary">Log in to your expense tracker</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" /> Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Link to Signup */}
        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup">Create one free</Link>
        </p>

        {/* Test credentials hint */}
        <div className="auth-demo">
          <p>Demo: test@example.com / password123</p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
