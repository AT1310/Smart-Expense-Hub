// =============================================
// pages/DashboardPage.js
// Main page after login.
// Shows stats, charts, and expense list with filters.
// =============================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { expenseAPI } from '../utils/api';
import StatsCard from '../components/StatsCard';
import ExpenseCard from '../components/ExpenseCard';
import CategoryChart from '../components/CategoryChart';
import MonthlyChart from '../components/MonthlyChart';
import FilterBar from '../components/FilterBar';
import './DashboardPage.css';

// Format number as Indian Rupee currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const DashboardPage = () => {
  const { user } = useAuth(); // Get current user from context

  // State for expense list
  const [expenses, setExpenses] = useState([]);

  // State for stats (totals, categories, monthly)
  const [stats, setStats] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Success message (e.g. after deleting)
  const [successMsg, setSuccessMsg] = useState('');

  // Filter state - what filters are currently applied
  const [filters, setFilters] = useState({
    category: 'All',
    startDate: '',
    endDate: '',
  });

  // =============================================
  // Fetch expenses from the backend
  // useCallback prevents this function from being
  // recreated on every render (performance optimization)
  // =============================================
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      // Pass current filters to the API function
      const res = await expenseAPI.getAll(filters);
      setExpenses(res.data.expenses); // Update the expense list
    } catch (err) {
      setError('Failed to load expenses. Please try again.');
    } finally {
      setLoading(false); // Always stop loading, success or fail
    }
  }, [filters]); // Re-run whenever filters change

  // =============================================
  // Fetch statistics (runs once on mount and after deletes)
  // =============================================
  const fetchStats = useCallback(async () => {
    try {
      const res = await expenseAPI.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err.message);
    }
  }, []);

  // Run fetch functions when the component loads or filters change
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // =============================================
  // Handle filter changes from FilterBar component
  // =============================================
  const handleFilter = (newFilters) => {
    setFilters(newFilters); // This triggers fetchExpenses via useEffect
  };

  // Reset all filters to default values
  const handleResetFilters = () => {
    setFilters({ category: 'All', startDate: '', endDate: '' });
  };

  // =============================================
  // Handle expense deletion
  // =============================================
  const handleDelete = async (expenseId) => {
    try {
      await expenseAPI.delete(expenseId); // Call DELETE /api/expenses/:id

      // Remove from local state without re-fetching (faster UX)
      setExpenses(prev => prev.filter(e => e._id !== expenseId));

      // Refresh stats since totals changed
      fetchStats();

      // Show success message briefly
      setSuccessMsg('Expense deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000); // Clear after 3 seconds
    } catch (err) {
      setError('Failed to delete expense');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">

        {/* Page Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="text-secondary">
              Welcome back, <strong>{user?.name}</strong>
            </p>
          </div>
          <Link to="/expenses/add" className="btn btn-primary">
            + Add Expense
          </Link>
        </div>

        {/* Success / Error Messages */}
        {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {/* =============================================
            STATS CARDS ROW
            ============================================= */}
        <div className="stats-grid">
          <StatsCard
            icon="💰"
            label="Total Spent"
            value={formatCurrency(stats?.totalExpenses)}
            color="var(--accent-light)"
          />
          <StatsCard
            icon="📋"
            label="Total Transactions"
            value={expenses.length}
            sub="in current view"
          />
          <StatsCard
            icon="📊"
            label="Categories Used"
            value={stats?.categoryStats?.length || 0}
            sub="distinct categories"
          />
          <StatsCard
            icon="📅"
            label="This Month"
            value={formatCurrency(
              // Find current month's data from monthly stats
              stats?.monthlyStats?.find(m => m._id === new Date().getMonth() + 1)?.totalAmount || 0
            )}
            color="var(--success)"
          />
        </div>

        {/* =============================================
            CHARTS ROW
            ============================================= */}
        {stats && (
          <div className="charts-grid">
            <CategoryChart
              categoryStats={stats.categoryStats}
              total={stats.totalExpenses}
            />
            <MonthlyChart monthlyStats={stats.monthlyStats} />
          </div>
        )}

        {/* =============================================
            FILTERS
            ============================================= */}
        <FilterBar
          filters={filters}
          onFilter={handleFilter}
          onReset={handleResetFilters}
        />

        {/* =============================================
            EXPENSE LIST
            ============================================= */}
        <div className="expense-list-section">
          <div className="flex-between mb-2">
            <h2>
              Expenses
              {/* Show count badge */}
              <span className="expense-count">{expenses.length}</span>
            </h2>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="list-loading">
              <span className="spinner" />
              <span className="text-secondary">Loading expenses...</span>
            </div>
          ) : expenses.length === 0 ? (
            /* Empty state */
            <div className="empty-state card">
              <div className="empty-icon">🧾</div>
              <h3>No expenses found</h3>
              <p className="text-secondary">
                {filters.category !== 'All' || filters.startDate || filters.endDate
                  ? 'Try adjusting your filters'
                  : 'Add your first expense to get started!'}
              </p>
              <Link to="/expenses/add" className="btn btn-primary mt-2">
                + Add First Expense
              </Link>
            </div>
          ) : (
            /* Expense list */
            <div className="expense-list">
              {expenses.map(expense => (
                <ExpenseCard
                  key={expense._id}       // React needs a unique key for lists
                  expense={expense}        // Pass expense data to card
                  onDelete={handleDelete}  // Pass delete handler
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
