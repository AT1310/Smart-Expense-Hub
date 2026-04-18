// =============================================
// models/User.js - User Database Schema
// This defines what a "User" looks like in our database
// =============================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Library to hash (encrypt) passwords

// A "Schema" defines the structure of documents in a MongoDB collection
// Think of it like a blueprint for our User data
const UserSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,       // Must be text
    required: true,     // This field is mandatory
    trim: true,         // Remove extra spaces from start/end
  },

  // User's email address (used for login)
  email: {
    type: String,
    required: true,
    unique: true,       // No two users can have the same email
    lowercase: true,    // Always store email in lowercase
    trim: true,
  },

  // User's password (will be stored as a hash, NOT plain text)
  password: {
    type: String,
    required: true,
    minlength: 6,       // Password must be at least 6 characters
  },

  // When this user account was created
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically set to current time when created
  }
});

// =============================================
// MIDDLEWARE - Runs before saving to database
// This automatically hashes the password before saving
// =============================================
UserSchema.pre('save', async function(next) {
  // Only hash the password if it was modified (or is new)
  // This prevents re-hashing on every save
  if (!this.isModified('password')) {
    return next(); // Skip hashing and continue
  }

  // Generate a "salt" - random data added to password before hashing
  // Number 10 means 10 rounds of processing (more = slower but safer)
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt and replace plain text with hash
  this.password = await bcrypt.hash(this.password, salt);

  next(); // Continue to save the document
});

// =============================================
// INSTANCE METHOD - Available on each User object
// This lets us compare a plain password with the stored hash
// =============================================
UserSchema.methods.matchPassword = async function(enteredPassword) {
  // bcrypt.compare() checks if entered password matches the stored hash
  // Returns true if they match, false if they don't
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the "User" model from the schema and export it
// mongoose.model('User', UserSchema) creates a 'users' collection in MongoDB
module.exports = mongoose.model('User', UserSchema);
