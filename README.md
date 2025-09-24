#Garbage Collection Management System

#Overview
A full-stack web application for managing garbage collection, recycling, and waste pickup requests. Supports multiple user roles and secure authentication via manual login, Google OAuth, and OpenID Connect.

#Features
User registration and login (manual, Google OAuth, OpenID Connect)
Password hashing and contact number encryption
CSRF protection for state-changing requests
Role-based access control (admin, collector, resident, recorder)
Waste pickup scheduling and management
Data analytics and dashboards
Email notifications

#Technologies Used
Frontend: React, Ant Design, React Router
Backend: Node.js, Express, MongoDB, Mongoose
Authentication: Passport.js (Google OAuth, OpenID Connect), JWT, CSRF

#Getting Started
Prerequisites
    Node.js and npm
    MongoDB

#Setup
Clone the repository:
git clone <repo-url>
cd Garbage_App

Install dependencies:
cd backend
npm install
cd ../frontend
npm install

Configure environment variables in .env.example and create .env file

Start the backend:
cd backend
npm run dev

Start the frontend:
cd frontend
npm start

#Authentication
Manual login/register uses CSRF protection and JWT for API requests.
Google OAuth and OpenID Connect login issue JWT tokens for secure access.
JWT is sent via httpOnly cookie or Authorization header.

#Security
Passwords are hashed using bcrypt.
Contact numbers are encrypted using AES-256-CBC.
CSRF tokens are required for POST/PUT/DELETE requests.

#Folder Structure
Garbage_App/
  backend/
    config/
    controllers/
    middlewares/
    models/
    routes/
    utils/
    validators/
    .env
    server.js
  frontend/
    src/
      components/
      contexts/
      pages/
      services/
      ...
    public/
    package.json

    License
MIT

