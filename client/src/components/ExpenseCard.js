// =============================================
// components/ExpenseCard.js
// Displays a single expense row in the list
// =============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ExpenseCard.css';

// Helper: return CSS class name based on category name
const getCategoryClass = (category) => {
  return `badge badge-${category.toLowerCase()}`;
};

// Helper: format a number as currency (e.g. 1500 → ₹1,500.00)
const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Helper: format a date object to readable string
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Category emoji icons for visual appeal
const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚗',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Healthcare: '💊',
  Housing: '🏠',
  Education: '📚',
  Bills: '📄',
  Other: '📦',
};

const ExpenseCard = ({ expense, onDelete }) => {
  const navigate = useNavigate();

  // Navigate to edit page when Edit is clicked
  const handleEdit = () => {
    navigate(`/expenses/edit/${expense._id}`);
  };

  // Call the parent's onDelete function with this expense's ID
  const handleDelete = () => {
    if (window.confirm(`Delete "${expense.title}"? This cannot be undone.`)) {
      onDelete(expense._id);
    }
  };

  return (
    <div className="expense-card">
      {/* Left: Icon + Info */}
      <div className="expense-info">
        <div className="expense-icon">
          {CATEGORY_ICONS[expense.category] || '📦'}
        </div>
        <div className="expense-details">
          <div className="expense-title">{expense.title}</div>
          <div className="expense-meta">
            <span className={getCategoryClass(expense.category)}>
              {expense.category}
            </span>
            <span className="expense-date">{formatDate(expense.date)}</span>
          </div>
          {/* Show description if it exists */}
          {expense.description && (
            <div className="expense-description">{expense.description}</div>
          )}
        </div>
      </div>

      {/* Right: Amount + Actions */}
      <div className="expense-right">
        <div className="expense-amount">{formatAmount(expense.amount)}</div>
        <div className="expense-actions">
          <button onClick={handleEdit} className="btn btn-secondary btn-sm">
            Edit
          </button>
          <button onClick={handleDelete} className="btn btn-danger btn-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
