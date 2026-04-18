// =============================================
// App.js - Main Application Component
// Sets up routing and wraps app with AuthProvider
// =============================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import our context provider (global authentication state)
import { AuthProvider, useAuth } from './context/AuthContext';

// Import all our page components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AddEditExpensePage from './pages/AddEditExpensePage';
import Navbar from './components/Navbar';

// =============================================
// ProtectedRoute Component
// Redirects to login if user is not authenticated
// Wrap any route that requires login with this
// =============================================
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Get current user from context

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the protected component
  return children;
};

// =============================================
// PublicRoute Component
// Redirects logged-in users away from login/signup pages
// If already logged in, no point showing login page
// =============================================
const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// =============================================
// AppRoutes Component
// Defines all the URL routes in our application
// =============================================
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Show navbar only when user is logged in */}
      {user && <Navbar />}

      <Routes>
        {/* Default route - redirect based on login status */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        {/* Public Routes - accessible without login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes - require login */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses/add"
          element={
            <ProtectedRoute>
              <AddEditExpensePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses/edit/:id"
          element={
            <ProtectedRoute>
              <AddEditExpensePage />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

// =============================================
// App Component - Root of the React tree
// AuthProvider wraps everything so all components
// can access user authentication state
// =============================================
function App() {
  return (
    // Router enables navigation between pages
    <Router>
      {/* AuthProvider gives all children access to auth state */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
