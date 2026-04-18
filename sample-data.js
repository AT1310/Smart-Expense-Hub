// =============================================
// sample-data.js
// Run this script to seed your MongoDB database
// with sample expenses for testing.
//
// HOW TO USE:
//   1. Make sure your server/.env file is set up
//   2. Run: cd server && node ../sample-data.js
// =============================================

require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// We need to inline simple versions of the models here
const UserSchema = new mongoose.Schema({
  name: String, email: String, password: String
});
const ExpenseSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  title: String, amount: Number, category: String,
  date: Date, description: String
});

const User = mongoose.model('User', UserSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Expense.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    });
    console.log('👤 Created test user: test@example.com / password123');

    // Sample expenses
    const expenses = [
      { user: user._id, title: 'Grocery shopping', amount: 1850, category: 'Food', date: new Date('2025-01-05'), description: 'Weekly groceries from BigBazaar' },
      { user: user._id, title: 'Uber to office', amount: 320, category: 'Transport', date: new Date('2025-01-06'), description: '' },
      { user: user._id, title: 'Netflix subscription', amount: 649, category: 'Entertainment', date: new Date('2025-01-07'), description: 'Monthly plan' },
      { user: user._id, title: 'Electricity bill', amount: 2100, category: 'Bills', date: new Date('2025-01-10'), description: 'January bill' },
      { user: user._id, title: 'New shoes', amount: 3500, category: 'Shopping', date: new Date('2025-01-14'), description: 'Running shoes from Decathlon' },
      { user: user._id, title: 'Doctor visit', amount: 800, category: 'Healthcare', date: new Date('2025-01-18'), description: 'General checkup' },
      { user: user._id, title: 'Online course', amount: 1999, category: 'Education', date: new Date('2025-01-20'), description: 'React course on Udemy' },
      { user: user._id, title: 'Rent payment', amount: 18000, category: 'Housing', date: new Date('2025-02-01'), description: 'February rent' },
      { user: user._id, title: 'Restaurant dinner', amount: 2400, category: 'Food', date: new Date('2025-02-08'), description: 'Birthday dinner' },
      { user: user._id, title: 'Metro card recharge', amount: 500, category: 'Transport', date: new Date('2025-02-10'), description: '' },
      { user: user._id, title: 'Amazon order', amount: 1299, category: 'Shopping', date: new Date('2025-02-15'), description: 'Earphones' },
      { user: user._id, title: 'Internet bill', amount: 999, category: 'Bills', date: new Date('2025-02-20'), description: 'Broadband monthly' },
      { user: user._id, title: 'Movie tickets', amount: 600, category: 'Entertainment', date: new Date('2025-03-02'), description: '2 tickets' },
      { user: user._id, title: 'Lunch at office', amount: 250, category: 'Food', date: new Date('2025-03-05'), description: '' },
      { user: user._id, title: 'Petrol', amount: 1200, category: 'Transport', date: new Date('2025-03-12'), description: 'Full tank' },
    ];

    await Expense.insertMany(expenses);
    console.log(`✅ Created ${expenses.length} sample expenses`);
    console.log('\n🎉 Seeding complete! Login with: test@example.com / password123');

    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedData();
