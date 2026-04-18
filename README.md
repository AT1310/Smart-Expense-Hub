# 💰 Smart Expense Tracker

A full-stack MERN web application to track your personal expenses with authentication, CRUD operations, dashboard analytics, and category/date filters.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

- 🔐 **Authentication** — JWT-based signup/login with bcrypt password hashing
- 💸 **Expense CRUD** — Add, view, edit, and delete expenses
- 📊 **Dashboard** — Visual stats: total spent, category breakdown (bar chart), monthly summary
- 🔍 **Filters** — Filter expenses by category and date range
- 📱 **Responsive** — Works on desktop and mobile

---

## 🗂️ Project Structure

```
smart-expense-tracker/
├── server/                   # Node.js + Express backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── models/
│   │   ├── User.js           # User schema (with bcrypt hashing)
│   │   └── Expense.js        # Expense schema
│   ├── routes/
│   │   ├── auth.js           # POST /register, POST /login, GET /me
│   │   └── expenses.js       # GET, POST, PUT, DELETE /expenses
│   ├── .env.example          # Environment variable template
│   ├── index.js              # Server entry point
│   └── package.json
│
├── client/                   # React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.js         # Top navigation bar
│       │   ├── ExpenseCard.js    # Single expense row
│       │   ├── StatsCard.js      # Summary stat tile
│       │   ├── FilterBar.js      # Category + date filters
│       │   ├── CategoryChart.js  # CSS bar chart by category
│       │   └── MonthlyChart.js   # Monthly spending bars
│       ├── context/
│       │   └── AuthContext.js    # Global auth state (React Context)
│       ├── pages/
│       │   ├── LoginPage.js
│       │   ├── SignupPage.js
│       │   ├── DashboardPage.js
│       │   └── AddEditExpensePage.js
│       ├── styles/
│       │   └── global.css        # Global design system CSS
│       ├── utils/
│       │   └── api.js            # Axios instance + API functions
│       └── App.js                # Routes + protected route logic
│
├── sample-data.js            # Database seed script
├── API_DOCS.md               # Full API documentation
├── .gitignore
└── package.json              # Root scripts (run both client+server)
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v16+ installed ([download](https://nodejs.org))
- A free MongoDB Atlas account ([sign up](https://cloud.mongodb.com))

### Step 1 — Clone the repository
```bash
git clone https://github.com/yourusername/smart-expense-tracker.git
cd smart-expense-tracker
```

### Step 2 — Set up MongoDB Atlas
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free account
2. Create a new **Cluster** (free M0 tier is fine)
3. Go to **Database Access** → Add a database user with a username and password
4. Go to **Network Access** → Add IP Address → Allow access from anywhere (`0.0.0.0/0`)
5. Go to **Database** → Connect → **Connect your application**
6. Copy the connection string — it looks like:
   `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

### Step 3 — Configure environment variables

**Backend:**
```bash
cd server
cp .env.example .env
```
Edit `server/.env`:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/expensetracker
JWT_SECRET=make_this_a_long_random_string_at_least_32_chars
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Frontend:**
```bash
cd client
cp .env.example .env
```
Edit `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4 — Install dependencies
From the **project root**:
```bash
npm install          # installs concurrently
cd server && npm install
cd ../client && npm install
```

### Step 5 — (Optional) Seed sample data
```bash
# From project root
node sample-data.js
# This creates: test@example.com / password123 with 15 sample expenses
```

### Step 6 — Run the app
```bash
# From project root — starts both server and client
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

---

## ☁️ Deployment

### Backend → Render (free)
1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo
4. Set these values:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add **Environment Variables** (same as your `server/.env`):
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — your secret key
   - `CLIENT_URL` — your Vercel frontend URL (add after deploying frontend)
6. Click **Deploy** — note your backend URL, e.g. `https://expense-tracker-api.onrender.com`

### Frontend → Vercel (free)
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set:
   - **Root Directory:** `client`
   - **Framework Preset:** Create React App
4. Add **Environment Variable:**
   - `REACT_APP_API_URL` = `https://your-render-backend.onrender.com/api`
5. Click **Deploy**
6. Copy the Vercel URL (e.g. `https://expense-tracker.vercel.app`)
7. Go back to **Render** → update `CLIENT_URL` to your Vercel URL → redeploy

---

## 🧪 Test Credentials (after seeding)
```
Email:    test@example.com
Password: password123
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Styling | Pure CSS (no UI library) |
| Deploy | Render (backend), Vercel (frontend) |

---

## 📄 License
MIT — feel free to use this project for learning or as a starter template.
