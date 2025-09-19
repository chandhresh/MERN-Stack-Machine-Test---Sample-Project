# Detailed Setup (Local)

## Prerequisites
- Node.js (v16+ recommended)
- MongoDB running locally or a cloud connection string
- Optional: nodemon for backend dev

## Backend
1. Open terminal and go to /backend
2. Copy `.env.example` to `.env` and update `MONGO_URI` and `JWT_SECRET`.
3. Install dependencies:
   ```
   cd backend
   npm install
   ```
4. Start server:
   ```
   npm run dev
   ```
   Server will run on PORT (default 5000)

## Frontend
1. Open another terminal and go to /frontend
2. Create `.env` file at frontend root with:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
3. Install and run:
   ```
   cd frontend
   npm install
   npm start
   ```
4. Open http://localhost:3000

## Quick demo flow
1. Register admin:
   POST http://localhost:5000/api/auth/register
   body: { "name":"Admin", "email":"admin@example.com", "password":"password" }
2. Login using the Login page or POST /api/auth/login
3. Add 5 agents via Dashboard -> Add Agent
4. Prepare CSV with headers: FirstName,Phone,Notes
   Example:
   FirstName,Phone,Notes
   Alice,919900112233,Test1
5. Upload CSV using Upload form. Assignments will appear on dashboard.

## Additional improvements (suggested)
- Add pagination, search for assignments, CSV preview, proper xlsx support, password reset, better roles & permissions.

