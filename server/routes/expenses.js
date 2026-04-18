// =============================================
// routes/expenses.js - Expense CRUD Routes
// Handles: Create, Read, Update, Delete expenses
// Base URL: /api/expenses
// All routes are PROTECTED (require JWT token)
// =============================================

const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense'); // Expense database model
const { protect } = require('../middleware/auth'); // Auth middleware

// Apply the 'protect' middleware to ALL routes in this file
// This means every route here requires a valid JWT token
router.use(protect);

// =============================================
// GET /api/expenses
// Get all expenses for the logged-in user
// Supports filters: ?category=Food&startDate=2024-01-01&endDate=2024-12-31
// =============================================
router.get('/', async (req, res) => {
  try {
    // Start with a base query - only get expenses belonging to this user
    let query = { user: req.user._id };

    // Apply category filter if provided in query params
    // Example: /api/expenses?category=Food
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Apply date range filters if provided
    if (req.query.startDate || req.query.endDate) {
      query.date = {}; // Create empty date filter object

      if (req.query.startDate) {
        // $gte means "greater than or equal to" (from this date onwards)
        query.date.$gte = new Date(req.query.startDate);
      }

      if (req.query.endDate) {
        // $lte means "less than or equal to" (up to this date)
        // Add 1 day to include the end date itself (end of day)
        const endDate = new Date(req.query.endDate);
        endDate.setDate(endDate.getDate() + 1);
        query.date.$lte = endDate;
      }
    }

    // Find all expenses matching our query, sorted by date (newest first)
    const expenses = await Expense.find(query).sort({ date: -1 });

    // Count total expenses for this user (unfiltered, for stats)
    const totalCount = await Expense.countDocuments({ user: req.user._id });

    res.status(200).json({
      count: expenses.length,  // Number of returned expenses
      totalCount,              // Total expenses (unfiltered)
      expenses,                // The actual expense data
    });

  } catch (error) {
    console.error('Error fetching expenses:', error.message);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
});

// =============================================
// GET /api/expenses/stats
// Get statistics: total amount, by category, by month
// =============================================
router.get('/stats', async (req, res) => {
  try {
    // MongoDB aggregation pipeline to calculate category totals
    // This groups all expenses by category and sums their amounts
    const categoryStats = await Expense.aggregate([
      // Stage 1: Filter - only expenses belonging to this user
      { $match: { user: req.user._id } },

      // Stage 2: Group - group by category and sum amounts
      {
        $group: {
          _id: '$category',            // Group by the 'category' field
          totalAmount: { $sum: '$amount' }, // Sum all amounts in each group
          count: { $sum: 1 },          // Count how many expenses per category
        }
      },

      // Stage 3: Sort - sort by total amount (highest first)
      { $sort: { totalAmount: -1 } }
    ]);

    // Aggregation to get monthly totals for the current year
    const currentYear = new Date().getFullYear();

    const monthlyStats = await Expense.aggregate([
      // Filter for current user AND current year
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: new Date(`${currentYear}-01-01`), // From Jan 1 of current year
            $lte: new Date(`${currentYear}-12-31`), // To Dec 31 of current year
          }
        }
      },

      // Group by month and sum amounts
      {
        $group: {
          _id: { $month: '$date' },          // Group by month number (1-12)
          totalAmount: { $sum: '$amount' },   // Sum amounts per month
          count: { $sum: 1 },                 // Count expenses per month
        }
      },

      // Sort by month (January first)
      { $sort: { _id: 1 } }
    ]);

    // Calculate the total of ALL expenses for this user
    const totalResult = await Expense.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Extract total (if no expenses, default to 0)
    const totalExpenses = totalResult.length > 0 ? totalResult[0].total : 0;

    res.status(200).json({
      totalExpenses,   // Grand total
      categoryStats,   // Array of { _id: 'Food', totalAmount: 150, count: 5 }
      monthlyStats,    // Array of { _id: 1, totalAmount: 500, count: 10 } (1 = January)
    });

  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

// =============================================
// GET /api/expenses/:id
// Get a single expense by its ID
// =============================================
router.get('/:id', async (req, res) => {
  try {
    // Find the expense by ID
    const expense = await Expense.findById(req.params.id);

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Security check: make sure this expense belongs to the logged-in user
    // .toString() converts MongoDB ObjectId to string for comparison
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this expense' });
    }

    res.status(200).json({ expense });

  } catch (error) {
    console.error('Error fetching expense:', error.message);
    res.status(500).json({ message: 'Server error while fetching expense' });
  }
});

// =============================================
// POST /api/expenses
// Create a new expense
// =============================================
router.post('/', async (req, res) => {
  try {
    // Extract expense data from request body
    const { title, amount, category, date, description } = req.body;

    // Validate required fields
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: 'Please provide title, amount, category, and date' });
    }

    // Validate amount is a positive number
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Create the new expense in the database
    // We automatically set 'user' to the logged-in user's ID
    const expense = await Expense.create({
      user: req.user._id, // Link this expense to the logged-in user
      title,
      amount: parseFloat(amount), // Ensure it's stored as a number
      category,
      date: new Date(date),       // Convert string to Date object
      description: description || '', // Optional field, default to empty string
    });

    res.status(201).json({
      message: 'Expense added successfully',
      expense,
    });

  } catch (error) {
    console.error('Error creating expense:', error.message);
    res.status(500).json({ message: 'Server error while creating expense' });
  }
});

// =============================================
// PUT /api/expenses/:id
// Update an existing expense
// =============================================
router.put('/:id', async (req, res) => {
  try {
    // Find the expense by ID
    const expense = await Expense.findById(req.params.id);

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Security check: only the owner can update their expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }

    const { title, amount, category, date, description } = req.body;

    // Update only the fields that were provided in the request
    // If a field isn't provided, keep the existing value
    if (title) expense.title = title;
    if (amount) expense.amount = parseFloat(amount);
    if (category) expense.category = category;
    if (date) expense.date = new Date(date);
    if (description !== undefined) expense.description = description;

    // Save the updated expense to the database
    const updatedExpense = await expense.save();

    res.status(200).json({
      message: 'Expense updated successfully',
      expense: updatedExpense,
    });

  } catch (error) {
    console.error('Error updating expense:', error.message);
    res.status(500).json({ message: 'Server error while updating expense' });
  }
});

// =============================================
// DELETE /api/expenses/:id
// Delete an expense permanently
// =============================================
router.delete('/:id', async (req, res) => {
  try {
    // Find the expense by ID
    const expense = await Expense.findById(req.params.id);

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Security check: only the owner can delete their expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    // Delete the expense from the database
    await expense.deleteOne();

    res.status(200).json({ message: 'Expense deleted successfully' });

  } catch (error) {
    console.error('Error deleting expense:', error.message);
    res.status(500).json({ message: 'Server error while deleting expense' });
  }
});

module.exports = router;
