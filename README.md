
# Garbage Collection Management System

## 📌 Overview
A full-stack web application for managing garbage collection, recycling, and waste pickup requests.  
Supports multiple user roles and secure authentication via **manual login, Google OAuth, and OpenID Connect**.

---

## 🚀 Features
- User registration and login (manual, Google OAuth, OpenID Connect)  
- Password hashing and contact number encryption  
- CSRF protection for state-changing requests  
- Role-based access control (admin, collector, resident, recorder)  
- Waste pickup scheduling and management  
- Data analytics and dashboards  
- Email notifications  

---

## 🛠️ Technologies Used
- **Frontend:** React, Ant Design, React Router  
- **Backend:** Node.js, Express, MongoDB, Mongoose  
- **Authentication:** Passport.js (Google OAuth, OpenID Connect), JWT, CSRF  

---

## ⚙️ Getting Started

### Prerequisites
- Node.js and npm  
- MongoDB  

### Setup
Clone the repository:
```bash
git clone <repo-url>
cd Garbage_App
````

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Configure environment variables:
Copy `.env.example` → create `.env` and update values.

### Run the project

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm start
```

---

## 🔑 Authentication

* **Manual login/register:** Uses CSRF protection and JWT for API requests.
* **Google OAuth & OpenID Connect:** Issue JWT tokens for secure access.
* JWT is sent via **httpOnly cookie** or **Authorization header**.

---

## 🔒 Security

* Passwords hashed with **bcrypt**
* Contact numbers encrypted with **AES-256-CBC**
* CSRF tokens required for **POST/PUT/DELETE** requests
* **OAUth /OpenID** setup
* **Encriptions**
* **Brute-false** limitations
* **noSQL injection** limitations
* XSS protections
* **JWT Tokens**

---

## 📂 Folder Structure

```
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
```

---

## 📜 License

[MIT](./LICENSE)

```

✨ This way your README will look professional with emojis, proper headings, and code blocks.  

Do you also want me to add a **nice project banner + badges (build, license, tech stack)** at the top to make it more attractive?
```
