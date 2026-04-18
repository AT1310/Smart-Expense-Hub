// =============================================
// pages/AddEditExpensePage.js
// Handles both Adding a new expense AND
// Editing an existing expense.
// Reuses the same form - detects mode from URL
// =============================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { expenseAPI } from '../utils/api';
import './AddEditExpensePage.css';

// Valid categories (must match backend model)
const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment',
                    'Healthcare', 'Housing', 'Education', 'Bills', 'Other'];

// Helper: format a Date object to "YYYY-MM-DD" for date input
const toInputDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
};

const AddEditExpensePage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // If URL has an :id, we're in edit mode

  // isEditMode is true when editing an existing expense
  const isEditMode = Boolean(id);

  // Form field values
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',       // Default category
    date: toInputDate(new Date()), // Default to today
    description: '',
  });

  // Loading, error, success states
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode); // Load expense data in edit mode
  const [error, setError] = useState('');

  // =============================================
  // If in edit mode, fetch the existing expense data
  // and pre-fill the form
  // =============================================
  useEffect(() => {
    if (isEditMode) {
      const loadExpense = async () => {
        try {
          const res = await expenseAPI.getOne(id); // Fetch expense by ID
          const expense = res.data.expense;

          // Pre-fill form with existing values
          setFormData({
            title: expense.title,
            amount: expense.amount.toString(), // Convert number to string for input
            category: expense.category,
            date: toInputDate(expense.date),
            description: expense.description || '',
          });
        } catch (err) {
          setError('Failed to load expense data. Please go back and try again.');
        } finally {
          setFetchLoading(false);
        }
      };

      loadExpense();
    }
  }, [id, isEditMode]); // Only run when id changes

  // Update form field when user types or selects
  const handleChange = (e) => {
    setError(''); // Clear error when user starts typing
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.title.trim()) {
      setError('Please enter a title for the expense');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    if (!formData.date) {
      setError('Please select a date');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        // UPDATE existing expense
        await expenseAPI.update(id, formData);
      } else {
        // CREATE new expense
        await expenseAPI.create(formData);
      }

      // Success - go back to dashboard
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // Show loading while fetching existing expense in edit mode
  if (fetchLoading) {
    return (
      <div className="loading-screen">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div className="expense-form-page">
      <div className="container">

        {/* Back button + Title */}
        <div className="form-page-header">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary btn-sm"
          >
            ← Back
          </button>
          <h1>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h1>
        </div>

        <div className="form-card card">

          {/* Error message */}
          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Expense Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g. Lunch at restaurant, Uber ride"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                required
                autoFocus
              />
            </div>

            {/* Amount + Category row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Amount (₹) *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {/* Render an option for each category */}
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description (optional) */}
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                placeholder="Add any notes about this expense..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
                maxLength={500}
              />
              {/* Character counter */}
              <div className="char-count text-muted">
                {formData.description.length}/500
              </div>
            </div>

            {/* Form buttons */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    {isEditMode ? 'Saving...' : 'Adding...'}
                  </>
                ) : (
                  isEditMode ? 'Save Changes' : 'Add Expense'
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default AddEditExpensePage;
