// =============================================
// config/db.js - MongoDB Connection Setup
// Connects to MongoDB Atlas if URI is set, otherwise falls back
// to an in-memory MongoDB server for local development.
// =============================================

const mongoose = require('mongoose');

const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  // Check if we should use the in-memory server
  // (when no real Atlas URI is configured)
  const isLocalUri = !uri || uri.includes('127.0.0.1') || uri.includes('localhost');

  if (isLocalUri) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log('🧪 Using in-memory MongoDB (no Atlas URI configured)');
    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
