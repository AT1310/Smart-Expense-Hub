// =============================================
// components/StatsCard.js
// A simple card that shows a single statistic
// Used on the dashboard for totals, counts, etc.
// =============================================

import React from 'react';
import './StatsCard.css';

// Props:
//   icon    - emoji icon (e.g. "💰")
//   label   - description (e.g. "Total Expenses")
//   value   - the main number or text to display
//   color   - optional CSS color for the value
//   sub     - optional small subtext below the value
const StatsCard = ({ icon, label, value, color, sub }) => {
  return (
    <div className="stats-card card">
      <div className="stats-icon">{icon}</div>
      <div className="stats-label">{label}</div>
      <div className="stats-value" style={{ color: color || 'var(--text-primary)' }}>
        {value}
      </div>
      {sub && <div className="stats-sub">{sub}</div>}
    </div>
  );
};

export default StatsCard;
