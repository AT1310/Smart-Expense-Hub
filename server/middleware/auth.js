// =============================================
// middleware/auth.js - JWT Authentication Middleware
// This protects routes by verifying the user's token
// Think of it as a "security guard" that checks ID before entry
// =============================================

const jwt = require('jsonwebtoken'); // Library to create and verify tokens
const User = require('../models/User'); // User model to look up user info

// This is a middleware function - it runs BEFORE the actual route handler
// req = request from client, res = response to send back, next = move to next middleware/route
const protect = async (req, res, next) => {
  let token; // Will store the JWT token if found

  // Check if the request has an Authorization header with a Bearer token
  // Authorization header format: "Bearer eyJhbGciOiJIUzI1NiIs..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header (split by space, take second part)
      // "Bearer TOKEN" → split → ["Bearer", "TOKEN"] → [1] → "TOKEN"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      // If valid: returns the decoded payload (contains user ID)
      // If invalid/expired: throws an error
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the ID from the token
      // .select('-password') means: get everything EXCEPT the password field
      req.user = await User.findById(decoded.id).select('-password');

      // Check if user still exists (might have been deleted)
      if (!req.user) {
        return res.status(401).json({ message: 'User not found, token invalid' });
      }

      // Token is valid! Move to the next function (the actual route)
      next();

    } catch (error) {
      // Token verification failed (expired, tampered, or invalid)
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was provided in the request
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Export the middleware so routes can use it
module.exports = { protect };
