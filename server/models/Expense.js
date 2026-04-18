// =============================================
// models/Expense.js - Expense Database Schema
// This defines what an "Expense" looks like in our database
// =============================================

const mongoose = require('mongoose');

// Define the valid categories for expenses
// This ensures data consistency - users can only pick from these options
const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Housing',
  'Education',
  'Bills',
  'Other'
];

// Schema defines the structure of each expense document in MongoDB
const ExpenseSchema = new mongoose.Schema({
  // Reference to the user who owns this expense
  // This links each expense to a specific user
  user: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB's ID type
    ref: 'User',    // References the 'User' model
    required: true, // Every expense must belong to a user
  },

  // What the expense was for (e.g., "Lunch at restaurant")
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100, // Limit to 100 characters
  },

  // How much was spent
  amount: {
    type: Number,
    required: true,
    min: 0,         // Amount cannot be negative
  },

  // What type of expense this is
  category: {
    type: String,
    required: true,
    enum: CATEGORIES, // Value must be one of the CATEGORIES array
    default: 'Other', // Default category if none is provided
  },

  // When this expense occurred
  date: {
    type: Date,
    required: true,
    default: Date.now, // Default to current date if not provided
  },

  // Optional additional notes about the expense
  description: {
    type: String,
    trim: true,
    maxlength: 500, // Limit to 500 characters
    default: '',
  },

  // Automatically track when this record was created/updated
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Add an index on the 'user' and 'date' fields for faster queries
// When we filter by user + date, MongoDB can find results much faster
ExpenseSchema.index({ user: 1, date: -1 }); // 1 = ascending, -1 = descending

// Export the model so routes can use it
module.exports = mongoose.model('Expense', ExpenseSchema);

// Also export categories so frontend can use the same list
module.exports.CATEGORIES = CATEGORIES;
