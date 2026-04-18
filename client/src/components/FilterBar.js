// =============================================
// components/FilterBar.js
// Provides controls to filter expenses by
// category and date range
// =============================================

import React from 'react';
import './FilterBar.css';

// All valid expense categories (must match backend)
const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Healthcare', 'Housing', 'Education', 'Bills', 'Other'];

// Props:
//   filters     - current filter values { category, startDate, endDate }
//   onFilter    - called when user changes any filter
//   onReset     - called when user clicks Reset button
const FilterBar = ({ filters, onFilter, onReset }) => {

  // Handle any input change and pass updated filters to parent
  const handleChange = (e) => {
    const { name, value } = e.target; // Get input name and new value
    onFilter({ ...filters, [name]: value }); // Update only the changed field
  };

  return (
    <div className="filter-bar card">
      <div className="filter-title">🔍 Filter Expenses</div>
      <div className="filter-controls">

        {/* Category Filter */}
        <div className="form-group filter-group">
          <label>Category</label>
          <select name="category" value={filters.category} onChange={handleChange}>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Start Date Filter */}
        <div className="form-group filter-group">
          <label>From Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>

        {/* End Date Filter */}
        <div className="form-group filter-group">
          <label>To Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>

        {/* Reset Filters Button */}
        <div className="filter-reset">
          <button onClick={onReset} className="btn btn-secondary btn-sm">
            Reset Filters
          </button>
        </div>

      </div>
    </div>
  );
};

export default FilterBar;
