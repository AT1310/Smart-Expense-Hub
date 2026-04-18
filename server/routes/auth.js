// =============================================
// routes/auth.js - Authentication Routes
// Handles: User Signup and Login
// Base URL: /api/auth
// =============================================

const express = require('express');
const router = express.Router(); // Create a mini-app to define routes
const jwt = require('jsonwebtoken');    // For creating tokens
const User = require('../models/User'); // User database model
const { protect } = require('../middleware/auth'); // Auth middleware

// =============================================
// HELPER FUNCTION: Generate JWT Token
// This creates a token that the user sends with every request
// The token proves "I am logged in" without needing to re-send password
// =============================================
const generateToken = (userId) => {
  // jwt.sign() creates the token
  // Payload: data we want to store in the token (just the user ID)
  // Secret: our private key used to sign the token
  // Options: token expires in 30 days
  return jwt.sign(
    { id: userId },          // Payload - what we store in the token
    process.env.JWT_SECRET,  // Secret key from .env file
    { expiresIn: '30d' }     // Token expires after 30 days
  );
};

// =============================================
// POST /api/auth/register
// Create a new user account
// Public route (no authentication needed)
// =============================================
router.post('/register', async (req, res) => {
  // Destructure the request body to get signup data
  const { name, email, password } = req.body;

  try {
    // Validate that all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Create a new user in the database
    // Note: password will be automatically hashed by the User model's pre-save hook
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate a JWT token for the new user
    const token = generateToken(user._id);

    // Send back the token and user info (but NOT the password)
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// =============================================
// POST /api/auth/login
// Login with existing credentials
// Public route (no authentication needed)
// =============================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate that email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Look up the user by email (convert to lowercase for consistency)
    const user = await User.findOne({ email: email.toLowerCase() });

    // If no user found with that email, return error
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the stored hashed password
    // matchPassword() is the method we defined in the User model
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Password is correct! Generate and send a JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// =============================================
// GET /api/auth/me
// Get current logged-in user's info
// Protected route (requires valid JWT token)
// =============================================
router.get('/me', protect, async (req, res) => {
  // 'protect' middleware already verified the token and attached user to req.user
  // We just send back the user data (without password)
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    }
  });
});

module.exports = router;
