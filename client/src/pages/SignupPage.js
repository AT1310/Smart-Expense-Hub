// =============================================
// pages/SignupPage.js
// New user registration form
// On success, redirects to dashboard
// =============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, error, clearError } = useAuth();

  // Form state - tracks all input field values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  // Local validation error (e.g. passwords don't match)
  const [localError, setLocalError] = useState('');

  // Update field value when user types
  const handleChange = (e) => {
    clearError();
    setLocalError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation: check passwords match before sending to server
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return; // Stop here, don't send to server
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Call register function from AuthContext
    const result = await register(formData.name, formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard'); // Go to dashboard after signup
    }
  };

  // Show either local error or server error
  const displayError = localError || error;

  return (
    <div className="auth-page">
      <div className="auth-card card">

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">💰</div>
          <h1>Create account</h1>
          <p className="text-secondary">Start tracking your expenses today</p>
        </div>

        {/* Error Message */}
        {displayError && (
          <div className="alert alert-error">
            ⚠️ {displayError}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

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
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" /> Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Link to Login */}
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </p>

      </div>
    </div>
  );
};

export default SignupPage;
