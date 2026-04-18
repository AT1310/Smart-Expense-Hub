// =============================================
// components/MonthlyChart.js
// Shows monthly spending as a bar chart
// Pure CSS bars, no external library needed
// =============================================

import React from 'react';
import './MonthlyChart.css';

// Month names for display
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Format as compact currency (e.g. ₹1.2K, ₹15K)
const formatCompact = (amount) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

// Props:
//   monthlyStats - array of { _id: 1, totalAmount: 5000 } (_id = month number 1-12)
const MonthlyChart = ({ monthlyStats }) => {

  if (!monthlyStats || monthlyStats.length === 0) {
    return (
      <div className="monthly-chart card">
        <h3>Monthly Summary ({new Date().getFullYear()})</h3>
        <p className="text-muted" style={{ marginTop: '16px' }}>
          No data for this year yet.
        </p>
      </div>
    );
  }

  // Find the highest monthly amount - used to scale bar heights
  const maxAmount = Math.max(...monthlyStats.map(m => m.totalAmount));

  // Create an array for all 12 months (fill missing months with 0)
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const monthData = monthlyStats.find(m => m._id === i + 1); // _id is 1-based
    return {
      month: MONTH_NAMES[i],         // e.g. 'Jan'
      amount: monthData?.totalAmount || 0,
      count: monthData?.count || 0,
    };
  });

  // Get current month index to highlight it
  const currentMonth = new Date().getMonth(); // 0-based

  return (
    <div className="monthly-chart card">
      <h3>Monthly Summary ({new Date().getFullYear()})</h3>

      <div className="monthly-bars">
        {allMonths.map((item, index) => {
          // Calculate bar height as a percentage of the tallest bar
          const heightPercent = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
          const isCurrentMonth = index === currentMonth;

          return (
            <div key={item.month} className="monthly-bar-group">
              {/* Amount label at top (only show if non-zero) */}
              {item.amount > 0 && (
                <div className="bar-amount">{formatCompact(item.amount)}</div>
              )}

              {/* The bar itself */}
              <div className="bar-track">
                <div
                  className={`bar-fill ${isCurrentMonth ? 'bar-current' : ''}`}
                  style={{ height: `${heightPercent}%` }}
                  title={`${item.month}: ₹${item.amount.toFixed(2)}`}
                />
              </div>

              {/* Month label at bottom */}
              <div className={`bar-label ${isCurrentMonth ? 'bar-label-current' : ''}`}>
                {item.month}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyChart;
