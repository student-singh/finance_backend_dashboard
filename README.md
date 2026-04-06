# 💰 Finance Dashboard Backend

A secure, role-based REST API backend for a finance dashboard system. Built with **Node.js**, **Express**, and **MongoDB**, this backend supports financial record management, user access control, and dashboard-level analytics — all enforced through JWT authentication and role-based middleware.

---

## 📌 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Roles and Permissions](#roles-and-permissions)
- [API Endpoints](#api-endpoints)
  - [Auth Routes](#auth-routes)
  - [User Routes](#user-routes)
  - [Transaction Routes](#transaction-routes)
  - [Dashboard Routes](#dashboard-routes)
- [Data Models](#data-models)
- [Features Implemented](#features-implemented)
- [Assumptions Made](#assumptions-made)
- [Error Handling](#error-handling)
- [Tradeoffs Considered](#tradeoffs-considered)

---

## 📖 Project Overview

This backend powers a **Finance Dashboard** where users interact with financial records based on their assigned role. The system is designed around three core concerns:

1. **Who you are** — Authenticated via JWT tokens
2. **What role you have** — Viewer, Analyst, or Admin
3. **What you are allowed to do** — Enforced at the route level via middleware

The API supports full CRUD operations on financial transactions, user management for admins, and aggregated dashboard insights for analysts and admins.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (v18+) |
| Framework | Express.js |
| Database | MongoDB (via MongoDB Atlas) |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs |
| Environment Config | dotenv |
| CORS | cors |
| Dev Server | nodemon |

---

## 📁 Project Structure

```
finance-dashboard-backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   ├── User.js                # User schema with role and status
│   │   └── Transaction.js         # Financial transaction schema
│   ├── middleware/
│   │   ├── auth.js                # JWT verification middleware
│   │   └── roleCheck.js           # Role-based access control middleware
│   ├── controllers/
│   │   ├── auth.controller.js     # Register, login, get current user
│   │   ├── user.controller.js     # Admin user management
│   │   ├── transaction.controller.js  # CRUD + filtering + pagination
│   │   └── dashboard.controller.js    # Aggregated analytics
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── transaction.routes.js
│   │   └── dashboard.routes.js
│   └── app.js                     # Entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (or local MongoDB instance)
- Postman (for API testing)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/finance-dashboard-backend.git
cd finance-dashboard-backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env
```
Edit the `.env` file and fill in your values (see [Environment Variables](#environment-variables)).

**4. Start the development server**
```bash
npm run dev
```

**5. Verify the server is running**
```
GET http://localhost:5000/
Response: { "message": "Finance Dashboard API running" }
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/finance_dashboard
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

| Variable | Description |
|----------|-------------|
| `PORT` | Port number the server runs on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `JWT_EXPIRE` | Token expiry duration (e.g. 7d, 24h) |

---

## 👥 Roles and Permissions

The system supports three roles with clearly defined access levels:

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| Register / Login | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| View transactions | ✅ | ✅ | ✅ |
| Filter transactions | ✅ | ✅ | ✅ |
| Create transactions | ❌ | ❌ | ✅ |
| Update transactions | ❌ | ❌ | ✅ |
| Delete transactions | ❌ | ❌ | ✅ |
| View dashboard summary | ❌ | ✅ | ✅ |
| View category analytics | ❌ | ✅ | ✅ |
| View monthly trends | ❌ | ✅ | ✅ |
| View recent activity | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## 📡 API Endpoints

All protected routes require the following header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Routes

#### Register a new user
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "admin"
}
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

#### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
**Response:** Same as register — returns token and user info.

---

#### Get current logged-in user
```
GET /api/auth/me
Authorization: Bearer <token>
```

---

### User Routes

> All user routes require Admin role.

#### Get all users
```
GET /api/users
Authorization: Bearer <admin_token>
```

#### Get single user
```
GET /api/users/:id
Authorization: Bearer <admin_token>
```

#### Update user (role, name, status)
```
PUT /api/users/:id
Authorization: Bearer <admin_token>
```
**Body:**
```json
{
  "name": "Updated Name",
  "role": "analyst",
  "isActive": false
}
```

#### Delete user
```
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

---

### Transaction Routes

#### Create a transaction
```
POST /api/transactions
Authorization: Bearer <admin_token>
```
**Body:**
```json
{
  "amount": 50000,
  "type": "income",
  "category": "Salary",
  "date": "2024-01-15",
  "notes": "Monthly salary for January"
}
```

#### Get all transactions (with filters and pagination)
```
GET /api/transactions
Authorization: Bearer <token>
```
**Query Parameters:**

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `type` | string | `income` | Filter by income or expense |
| `category` | string | `Food` | Filter by category |
| `startDate` | date | `2024-01-01` | Filter from this date |
| `endDate` | date | `2024-01-31` | Filter until this date |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page |

**Example:**
```
GET /api/transactions?type=expense&category=Food&page=1&limit=5
```

**Response:**
```json
{
  "success": true,
  "total": 25,
  "page": 1,
  "pages": 5,
  "data": [...]
}
```

#### Get single transaction
```
GET /api/transactions/:id
Authorization: Bearer <token>
```

#### Update transaction
```
PUT /api/transactions/:id
Authorization: Bearer <admin_token>
```
**Body (any fields to update):**
```json
{
  "amount": 55000,
  "notes": "Updated salary amount"
}
```

#### Delete transaction (soft delete)
```
DELETE /api/transactions/:id
Authorization: Bearer <admin_token>
```
> Note: This performs a **soft delete** — the record is not removed from the database but marked as deleted with `isDeleted: true`. It will no longer appear in any queries.

---

### Dashboard Routes

> All dashboard routes require Analyst or Admin role.

#### Get financial summary
```
GET /api/dashboard/summary
Authorization: Bearer <analyst_or_admin_token>
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 150000,
    "totalExpense": 45000,
    "netBalance": 105000
  }
}
```

#### Get category-wise breakdown
```
GET /api/dashboard/category-wise
Authorization: Bearer <analyst_or_admin_token>
```
**Response:**
```json
{
  "success": true,
  "data": [
    { "_id": { "category": "Salary", "type": "income" }, "total": 150000 },
    { "_id": { "category": "Rent", "type": "expense" }, "total": 20000 },
    { "_id": { "category": "Food", "type": "expense" }, "total": 8000 }
  ]
}
```

#### Get monthly trends
```
GET /api/dashboard/monthly-trends
Authorization: Bearer <analyst_or_admin_token>
```
**Response:**
```json
{
  "success": true,
  "data": [
    { "_id": { "year": 2024, "month": 1, "type": "income" }, "total": 50000 },
    { "_id": { "year": 2024, "month": 1, "type": "expense" }, "total": 15000 }
  ]
}
```

#### Get recent transactions
```
GET /api/dashboard/recent
Authorization: Bearer <analyst_or_admin_token>
```
Returns the 5 most recent transactions.

---

## 🗃 Data Models

### User Model

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name of the user |
| `email` | String | Unique email address |
| `password` | String | Hashed using bcrypt (not returned in responses) |
| `role` | String | One of: `viewer`, `analyst`, `admin` |
| `isActive` | Boolean | Account status — inactive users cannot log in |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-generated timestamp |

### Transaction Model

| Field | Type | Description |
|-------|------|-------------|
| `amount` | Number | Transaction amount (must be positive) |
| `type` | String | Either `income` or `expense` |
| `category` | String | Category label (e.g. Salary, Food, Rent) |
| `date` | Date | Date of the transaction |
| `notes` | String | Optional description |
| `createdBy` | ObjectId | Reference to the User who created it |
| `isDeleted` | Boolean | Soft delete flag |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-generated timestamp |

---

## ✅ Features Implemented

### Core Features
- JWT-based authentication (register, login, token verification)
- Password hashing with bcrypt
- Role-based access control via middleware (Viewer / Analyst / Admin)
- Full CRUD for financial transactions
- Filtering by type, category, and date range
- Pagination for transaction listing
- Soft delete for transactions
- User management (Admin only)
- Activate / deactivate user accounts

### Dashboard Analytics (MongoDB Aggregations)
- Total income, total expense, net balance
- Category-wise financial breakdown
- Monthly income and expense trends
- Recent activity feed (last 5 transactions)

### Reliability
- Consistent error responses with appropriate HTTP status codes
- Mongoose schema-level validation
- Token expiry and invalid token handling
- Inactive user login prevention

---

## 💡 Assumptions Made

1. **Role assignment at registration** — Any role can be assigned during registration. In a production system, only admins would be able to assign the admin role. This was simplified for assessment purposes.

2. **Soft delete only** — Transactions are never permanently deleted. The `isDeleted` flag approach preserves data integrity and allows for audit trails.

3. **Single currency** — All amounts are treated as a single unnamed currency. No currency conversion is implemented.

4. **No email verification** — Users are activated immediately after registration without email verification.

5. **Categories are free-form strings** — There is no predefined list of categories. Any string is accepted, which gives flexibility but requires consistent input from the client.

6. **Admin manages all transactions** — Any admin can update or delete any transaction, not just their own. This suits a centralized finance dashboard model.

---

## ⚠️ Error Handling

The API returns consistent error responses across all endpoints:

```json
{
  "success": false,
  "message": "Descriptive error message here"
}
```

| Status Code | Meaning |
|-------------|---------|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request / validation error |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient role permissions |
| `404` | Resource not found |
| `500` | Internal server error |

---

## ⚖️ Tradeoffs Considered

| Decision | Tradeoff |
|----------|----------|
| MongoDB over SQL | Flexible schema suits evolving financial categories, but loses strict relational integrity |
| Soft delete | Preserves data history but requires `isDeleted: false` filter on every query |
| JWT stateless auth | Simple and scalable but tokens cannot be invalidated before expiry |
| Free-form categories | Flexible but risks inconsistency (e.g. "food" vs "Food") |
| Single `createdBy` field | Simple attribution but does not track who last updated a record |

---

## 📬 Testing the API

Import the following base setup in Postman:

- **Base URL:** `http://localhost:5000`
- **Header for protected routes:**
  ```
  Key: Authorization
  Value: Bearer <your_token>
  ```

**Recommended test order:**
1. Register Admin → Login → Copy token
2. Create transactions (as Admin)
3. Get transactions (as any role)
4. Test dashboard routes (as Analyst or Admin)
5. Test access denial (as Viewer on admin routes)

---

## 👤 Author

Built as a backend engineering assessment project demonstrating API design, data modeling, access control, and aggregation logic using the MERN stack (backend only).
