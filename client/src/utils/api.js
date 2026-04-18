// =============================================
// utils/api.js - Axios API Configuration
// Centralized place for all API calls
// This keeps our components clean and simple
// =============================================

import axios from 'axios';

// Base URL for all API requests - from .env file
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an axios instance with default settings
// This way we don't repeat BASE_URL in every API call
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Tell server we're sending JSON
  },
});

// =============================================
// REQUEST INTERCEPTOR
// Runs before every API request is sent
// Automatically adds the JWT token to every request
// =============================================
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Add "Bearer TOKEN" to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Continue with the request
  },
  (error) => {
    return Promise.reject(error); // If error, reject the promise
  }
);

// =============================================
// EXPENSE API FUNCTIONS
// These functions make HTTP requests to the backend
// =============================================

export const expenseAPI = {
  // Get all expenses (with optional filters)
  // filters = { category: 'Food', startDate: '2024-01-01', endDate: '2024-12-31' }
  getAll: (filters = {}) => {
    const params = new URLSearchParams(); // Build query string from filters

    if (filters.category && filters.category !== 'All') {
      params.append('category', filters.category);
    }
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    // Example URL: /api/expenses?category=Food&startDate=2024-01-01
    return api.get(`/expenses?${params.toString()}`);
  },

  // Get statistics (totals, category breakdown, monthly)
  getStats: () => api.get('/expenses/stats'),

  // Get a single expense by ID
  getOne: (id) => api.get(`/expenses/${id}`),

  // Create a new expense
  create: (expenseData) => api.post('/expenses', expenseData),

  // Update an existing expense
  update: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),

  // Delete an expense
  delete: (id) => api.delete(`/expenses/${id}`),
};

export default api;
