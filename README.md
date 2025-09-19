MERN Stack Machine Test - Sample Project

This repository contains a sample MERN (MongoDB, Express, React, Node) project implementing:
- Admin user login (JWT)
- Agent creation & management
- CSV upload and distribution of list items evenly across 5 agents
- Display assignments per agent

What is included
- backend/ : Express server, models, routes
- frontend/: React app skeleton
- .env.example for backend

**How it works **
1. Register an admin via POST /api/auth/register (email/password).
2. Login at /api/auth/login to get JWT.
3. Create agents using POST /api/agents (admin).
4. Upload a CSV at POST /api/upload (field 'file') with columns: FirstName,Phone,Notes.
5. Server parses CSV, saves items, distributes evenly among the first 5 agents and saves assignments.
6. View assignments at GET /api/upload/assignments.

Notes
- CSV validation ensures columns exist. Only CSV parsing implemented; xlsx/axls acceptance is by extension only (you can extend with 'xlsx' libraries).
- For demo, use tools like Postman to call register/login endpoints. Frontend assumes API at http://localhost:5000.
if the port is occupied change the port no and try





Features
-	User Registration and Login with bcrypt password hashing
-	JWT Authentication with 8-hour session expiration
-	Admin role support and role-based access
-	REST API built with Express.js and MongoDB
-	React frontend with protected routes
-	Token persistence using localStorage
-	Database integration to store agents, assignments, and related details


Tech Stack
-	Frontend: React, Axios
-	Backend: Node.js, Express.js, JWT, bcryptjs
-	Database: MongoDB with Mongoose


Database Structure
The MongoDB database is used not only for authentication but also for storing application-related data. Collections include: - Users – Stores admin and user details (name, email, password hash, role). - Agents – Stores agent information and metadata. - Assignments – Stores assignments allocated to agents, along with their statuses. This ensures that all authentication data, agents, and assignment details are securely stored and managed in the backend.


Getting Started
1.	Clone the Repository:
git clone https://github.com/your-username/mern-auth-app.git cd mern-auth-app

2.	Backend Setup: cd backend
npm install
Create a .env file inside backend with: MONGO_URI=mongodb://127.0.0.1:27017/mern-auth JWT_SECRET=your_jwt_secret
PORT=5000
Run the backend: npm start

3.	Frontend Setup: cd ../frontend npm install
npm start


API Endpoints
Register: POST /api/auth/register
 
{
"name": "Admin",
"email": "admin@example.com", "password": "admin123", "role": "admin"
}
Login: POST /api/auth/login
{
"email": "admin@example.com", "password": "admin123"
}
Response:
{
"token": "jwt_token_here", "user": {
"email": "admin@example.com", "name": "Admin",
"role": "admin"
}
}

Usage
-	Register an admin using the /register endpoint (via Postman or frontend). - Login with the same credentials in the frontend. - Agents and assignments can be created and managed in the dashboard. - All user, agent, and assignment details are securely stored in MongoDB.


Author
Developed by Chandhresh
Part of Fullstack Internship Assignment

See DETAILED_SETUP.md for step-by-step setup.
