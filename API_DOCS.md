# Smart Expense Tracker — API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require an `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Routes `/api/auth`

### POST `/api/auth/register`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Success Response (201):**
```json
{
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "abc123", "name": "John Doe", "email": "john@example.com" }
}
```

**Error Responses:**
- `400` — Missing fields / email already exists / password too short
- `500` — Server error

---

### POST `/api/auth/login`
Log in with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "abc123", "name": "John Doe", "email": "john@example.com" }
}
```

**Error Responses:**
- `400` — Missing fields
- `401` — Invalid email or password
- `500` — Server error

---

### GET `/api/auth/me` 🔒
Get the currently logged-in user's profile.

**Success Response (200):**
```json
{
  "user": { "id": "abc123", "name": "John Doe", "email": "john@example.com" }
}
```

---

## Expense Routes `/api/expenses` 🔒
All expense routes require authentication.

### GET `/api/expenses`
Get all expenses for the logged-in user.

**Query Parameters (all optional):**
| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `category` | string | `Food` | Filter by category |
| `startDate` | date string | `2025-01-01` | From this date |
| `endDate` | date string | `2025-12-31` | Up to this date |

**Example:** `GET /api/expenses?category=Food&startDate=2025-01-01`

**Success Response (200):**
```json
{
  "count": 2,
  "totalCount": 15,
  "expenses": [
    {
      "_id": "64abc...",
      "user": "64xyz...",
      "title": "Lunch",
      "amount": 350,
      "category": "Food",
      "date": "2025-01-15T00:00:00.000Z",
      "description": "Office canteen",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### GET `/api/expenses/stats`
Get aggregated statistics for the logged-in user.

**Success Response (200):**
```json
{
  "totalExpenses": 45230,
  "categoryStats": [
    { "_id": "Food", "totalAmount": 8500, "count": 12 },
    { "_id": "Housing", "totalAmount": 18000, "count": 1 }
  ],
  "monthlyStats": [
    { "_id": 1, "totalAmount": 12000, "count": 8 },
    { "_id": 2, "totalAmount": 9500, "count": 6 }
  ]
}
```
> Note: `_id` in `monthlyStats` is the month number (1 = January, 12 = December)

---

### GET `/api/expenses/:id`
Get a single expense by its ID.

**Success Response (200):**
```json
{
  "expense": { "_id": "64abc...", "title": "Lunch", "amount": 350, ... }
}
```

**Error Responses:**
- `404` — Expense not found
- `403` — Not your expense

---

### POST `/api/expenses`
Create a new expense.

**Request Body:**
```json
{
  "title": "Grocery shopping",
  "amount": 1850,
  "category": "Food",
  "date": "2025-01-20",
  "description": "Weekly groceries"
}
```
> `description` is optional. `category` must be one of: Food, Transport, Shopping, Entertainment, Healthcare, Housing, Education, Bills, Other

**Success Response (201):**
```json
{
  "message": "Expense added successfully",
  "expense": { "_id": "64abc...", "title": "Grocery shopping", ... }
}
```

---

### PUT `/api/expenses/:id`
Update an existing expense (only fields provided will be updated).

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "amount": 2000,
  "category": "Food",
  "date": "2025-01-21",
  "description": "Updated notes"
}
```

**Success Response (200):**
```json
{
  "message": "Expense updated successfully",
  "expense": { "_id": "64abc...", "title": "Updated title", ... }
}
```

---

### DELETE `/api/expenses/:id`
Delete an expense permanently.

**Success Response (200):**
```json
{
  "message": "Expense deleted successfully"
}
```

---

## Valid Categories
`Food` `Transport` `Shopping` `Entertainment` `Healthcare` `Housing` `Education` `Bills` `Other`

## HTTP Status Codes Used
| Code | Meaning |
|------|---------|
| `200` | OK — Request succeeded |
| `201` | Created — Resource created successfully |
| `400` | Bad Request — Invalid or missing input |
| `401` | Unauthorized — Missing or invalid token |
| `403` | Forbidden — You don't have permission |
| `404` | Not Found — Resource doesn't exist |
| `500` | Server Error — Something went wrong on the server |
