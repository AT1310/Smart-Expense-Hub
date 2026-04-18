// =============================================
// components/CategoryChart.js
// Visual breakdown of spending by category
// Built with pure CSS (no chart library needed!)
// =============================================

import React from 'react';
import './CategoryChart.css';

// Format number as Indian Rupee currency
const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Category colors for the bars
const CATEGORY_COLORS = {
  Food: '#fb923c',
  Transport: '#60a5fa',
  Shopping: '#a78bfa',
  Entertainment: '#fb7185',
  Healthcare: '#4ade80',
  Housing: '#facc15',
  Education: '#38bdf8',
  Bills: '#f87171',
  Other: '#94a3b8',
};

// Props:
//   categoryStats - array of { _id: 'Food', totalAmount: 1500, count: 5 }
//   total         - grand total (used to calculate percentages)
const CategoryChart = ({ categoryStats, total }) => {

  // If no data, show a placeholder
  if (!categoryStats || categoryStats.length === 0) {
    return (
      <div className="category-chart card">
        <h3>Spending by Category</h3>
        <p className="text-muted" style={{ marginTop: '16px' }}>
          No expense data yet.
        </p>
      </div>
    );
  }

  return (
    <div className="category-chart card">
      <h3>Spending by Category</h3>

      <div className="chart-list">
        {categoryStats.map((item) => {
          // Calculate what percentage this category is of the total
          const percentage = total > 0 ? ((item.totalAmount / total) * 100).toFixed(1) : 0;
          const color = CATEGORY_COLORS[item._id] || '#94a3b8';

          return (
            <div key={item._id} className="chart-item">
              {/* Category name and amount */}
              <div className="chart-item-header">
                <span className="chart-category-name">{item._id}</span>
                <span className="chart-amount">{formatAmount(item.totalAmount)}</span>
              </div>

              {/* Progress bar showing the percentage */}
              <div className="chart-bar-bg">
                <div
                  className="chart-bar-fill"
                  style={{
                    width: `${percentage}%`,   // Bar width = percentage of total
                    backgroundColor: color,     // Each category gets a unique color
                  }}
                />
              </div>

              {/* Percentage and transaction count */}
              <div className="chart-item-footer">
                <span className="chart-percent">{percentage}%</span>
                <span className="chart-count">{item.count} transactions</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChart;
