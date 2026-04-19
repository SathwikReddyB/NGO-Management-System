# NGO Management Web Page - Full Stack Integration

This project integrates a responsive React frontend (using Vite) with a robust Node.js/Express backend, backed by a persistent MySQL database.

## ✨ Features

- **NGO Management**: 
  - Secure registration and login for NGO administrators.
  - Interactive dashboard with real-time analytics and statistics.
  - Create and manage volunteer time slots.
  - Track and manage volunteer enrollments.
- **Volunteer Portal**:
  - Personal registration and secure login for candidates.
  - Browse and discover different NGOs.
  - Detailed NGO profiles with enrollment and booking options.
  - Integrated booking system for volunteer slots.
  - Personalized volunteer dashboard to manage bookings.
- **Data Visualization**: 
  - Interactive charts using Recharts for visualizing NGO and volunteer data.
- **Modern UI/UX**: 
  - Responsive, mobile-first design built with Tailwind CSS 4.
  - Smooth animations with Motion (Framer Motion).
  - Accessible components using Radix UI primitives.
- **Secure Backend**: 
  - JWT-based authentication for secure session management.
  - Password hashing using bcrypt to protect user data.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Material UI (MUI), Vaul (Drawers), Sonner (Toasts)
- **Icons**: Lucide React
- **Animations**: Framer Motion, tw-animate-css
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Routing**: React Router 7

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (using `mysql2` driver)
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcrypt
- **Environment**: Dotenv
- **API Testing**: Postman / REST Client

### Database
- **Engine**: MySQL


## Prerequisites
- **Node.js**: Ensure Node.js and `npm` are installed (v16+ recommended).
- **MySQL**: Ensure a local or remote MySQL server is running.

## Project Structure
- `/` - The React frontend powered by Vite, Tailwind CSS, and standard UI libraries.
- `/backend` - The Node.js and Express API, handling routing, database connections, and JWT authentication.

---

## 🚀 1. Database Setup

1. Start your local MySQL service.
2. Log into MySQL and create the database and tables using the provided schema:
   ```bash
   mysql -u root -p < backend/init.sql
   ```
   *(This script creates the `ngo_management` database and the necessary tables for NGOs, Candidates, Enrollments, Time Slots, and Bookings.)*

## ⚙️ 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install external dependencies:
   ```bash
   npm install
   ```
3. Configure your Environment Variables:
   Open `backend/.env` and update the database credentials to match your local MySQL configuration:
   ```env
   PORT=5002
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=abc123
   DB_NAME=ngo_management
   JWT_SECRET=supersecretjwtkey_12345
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The Express API will run on `http://localhost:5002`.*

   > **Note on `EADDRINUSE` errors:** If you encounter a `listen EADDRINUSE: address already in use` error when running `npm run dev`, it means you already have a terminal running the server in the background! Please close your other open terminal instances or kill the node process before starting it again.


## 💻 3. Frontend Setup
1. Open a separate terminal in the root directory of the project.
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The React app will typically run on `http://localhost:5173`. Open this URL in your browser.*

---

## Testing the Flow
1. **NGO Usage**: Register a new NGO. Go to the NGO Dashboard to create volunteer time slots.
2. **Volunteer Usage**: Register a new Candidate. View NGOs, donate via the NGO Detail page, and book available Time Slots.
3. Check the MySQL tables (`ngos`, `candidates`, `bookings`, `enrollments`) to see your persistent data!

---

## 🌐 Free Deployment Guide

Follow these steps to deploy your application for free.

### 1. Database Setup (Railway)
1.  Sign up at [Railway.app](https://railway.app/).
2.  Create a new project and add a **MySQL** database.
3.  Once the database is created, you can find your connection details in the **Variables** tab (look for `MYSQLHOST`, `MYSQLUSER`, etc.).
4.  Use the **Data** tab in Railway to run the `backend/init.sql` script and set up your tables.

### 2. Backend Deployment (Render)
1.  Push your code to a **GitHub repository**.
2.  Sign up at [Render.com](https://render.com/).
3.  Create a new **Web Service** and connect your GitHub repo.
4.  **Settings**:
    - **Root Directory**: `backend`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
5.  **Environment Variables**:
    - Copy all the `MYSQL*` variables from Railway into Render's Environment Variables.
    - `DB_SSL`: `true` (if required)
    - `JWT_SECRET`: (Your choice of a long secret string)
    - `FRONTEND_URL`: `https://your-app.vercel.app` (Add this *after* deploying the frontend)

### 3. Frontend Deployment (Vercel)
1.  Sign up at [Vercel.com](https://vercel.com/).
2.  Import your GitHub repository.
3.  Vercel will detect the Vite project. Use the default build settings.
4.  **Environment Variables**:
    - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`
5.  Deploy!

> [!TIP]
> After deploying the frontend, remember to go back to **Render** and update the `FRONTEND_URL` environment variable with your actual Vercel URL to enable CORS.