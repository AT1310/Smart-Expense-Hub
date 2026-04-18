// =============================================
// index.js - Main Entry Point for the Server
// This file starts our Express server and connects to MongoDB
// =============================================

// Load environment variables from .env file
// Must be called FIRST before anything else
require('dotenv').config();

const express = require('express');  // Web framework for Node.js
const cors = require('cors');        // Allows frontend to communicate with backend
const connectDB = require('./config/db'); // Our database connection function

// Import our route files
const authRoutes = require('./routes/auth');         // Login/Signup routes
const expenseRoutes = require('./routes/expenses');   // Expense CRUD routes

// Create the Express application
const app = express();

// =============================================
// MIDDLEWARE SETUP
// Middleware runs on every request before routes
// =============================================

// Enable CORS - allows our React frontend to make requests to this server
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Only allow requests from our frontend
  credentials: true // Allow cookies to be sent
}));

// Parse incoming JSON requests (so we can read req.body)
app.use(express.json());

// =============================================
// DATABASE CONNECTION
// Connect to MongoDB before starting the server
// =============================================
connectDB();

// =============================================
// ROUTES
// These define what happens when certain URLs are hit
// =============================================

// All routes starting with /api/auth go to authRoutes (login, signup)
app.use('/api/auth', authRoutes);

// All routes starting with /api/expenses go to expenseRoutes (CRUD)
app.use('/api/expenses', expenseRoutes);

// Simple health check route - useful to test if server is running
app.get('/', (req, res) => {
  res.json({ message: 'Smart Expense Tracker API is running! 🚀' });
});

// =============================================
// START SERVER
// Listen on the port defined in .env (default: 5000)
// =============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
});
