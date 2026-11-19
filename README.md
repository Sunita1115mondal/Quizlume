# Quizzy – Interactive Quiz Platform

Quizzy is a full-stack web-based quiz application built with the MERN stack. It provides an interactive platform where students can attempt quizzes, teachers can create and manage assessments, and administrators can manage users and monitor platform activity.

The application includes JWT-based authentication, role-based access control, quiz management, automated result evaluation, and responsive dashboards.

## Features

### Student
- Register and log in securely.
- Browse available quizzes.
- Attempt multiple-choice questions.
- Submit answers and view results.
- Track quiz performance.

### Teacher
- Create quizzes with multiple questions and answer options.
- Select the correct answer for each question.
- Manage created quizzes.
- View student attempts and scores.
- Monitor quiz statistics and average performance.

### Administrator
- View platform statistics.
- View and search registered users.
- Update user roles.
- View and search quizzes.
- Delete users and quizzes.

### General
- JWT-based authentication.
- Password hashing using bcrypt.
- Role-based access control for students, teachers, and administrators.
- Responsive user interface.
- MongoDB database integration.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router |
| API Communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcryptjs |
| Development | VS Code, npm, Git |

## Project Structure

```text
Quizzy/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── ResultPage.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── TeacherPanel.jsx
│   │   │   └── AdminDashboard.jsx
│   │   └── services/
│   │       ├── api.js
│   │       └── auth.js
│   └── package.json
│
├── .gitignore
├── README.md
├── DEPLOYMENT.md
└── QUICK_DEPLOY.md
```

## Prerequisites

Make sure you have:

- Node.js 18 or later
- npm
- MongoDB Atlas account or a MongoDB instance
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/RMR0304/Interactive-Quiz-App.git
cd Interactive-Quiz-App
```

### 2. Backend setup

Open a terminal:

```bash
cd backend
npm install
```

Create your backend environment file by copying `.env.example` to `.env`.

Configure the MongoDB connection string, JWT secret, and other required settings using the variable names provided in `.env.example`.

Start the backend:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` using `frontend/.env.example` and configure the API URL for your local backend.

Start the frontend:

```bash
npm run dev
```

Open the application:

```text
http://localhost:5173
```

## Database Seeding

To add sample development data, run:

```bash
cd backend
npm run seed
```

The current seed script creates:

- A sample teacher account, if it does not already exist.
- A General Knowledge Quiz containing 10 questions, if it does not already exist.

Sample teacher credentials:

```text
Email: teacher@example.com
Password: password123
```

These credentials are for local development only. Do not use them in production.

## Administrator Account Setup

Administrator access is provisioned through a local backend utility rather than public signup.

1. Register an account through the application.
2. Configure `ADMIN_EMAIL` in `backend/.env` with the registered account's email.
3. Run:

```bash
cd backend
node ./src/utils/makeAdmin.js
```

The utility updates the selected existing user's role to `admin`.

Keep administrator provisioning restricted to trusted operators. Never expose it as a public registration endpoint.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/quizzes` | Retrieve available quizzes |
| GET | `/api/quizzes/:id` | Retrieve a quiz |
| POST | `/api/quizzes` | Create a quiz |
| POST | `/api/results/submit/:quizId` | Submit quiz answers |
| GET | `/api/results/me` | Retrieve personal results |
| GET | `/teacher/quizzes` | Retrieve teacher quizzes |
| GET | `/teacher/stats` | Retrieve teacher statistics |
| GET | `/teacher/quiz/:quizId/attempts` | View quiz attempts |
| GET | `/admin/users` | Manage users |
| GET | `/admin/quizzes` | Manage quizzes |
| GET | `/admin/stats` | View platform statistics |

Protected API requests use JWT authentication:

```text
Authorization: Bearer <token>
```

## Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

The generated production files are available in:

```text
frontend/dist/
```

Start the backend using its production script:

```bash
cd backend
npm run start
```

## Running Tests

Run the backend test suite, if configured:

```bash
cd backend
npm test
```

## Deployment

For deployment instructions, refer to:

- [Deployment Guide](./DEPLOYMENT.md)
- [Quick Deployment Guide](./QUICK_DEPLOY.md)

Possible deployment services include Render or Railway for the backend, Vercel or Netlify for the frontend, and MongoDB Atlas for the database.

Before deploying, configure production environment variables, database access, and allowed CORS origins.

## Security Notes

- Passwords are hashed using bcryptjs.
- Authentication uses JWT tokens.
- Protected operations require authentication and appropriate roles.
- Environment files containing secrets must never be committed to GitHub.
- Use strong JWT secrets and production-specific database credentials.

## Acknowledgement

This project is based on the original [Interactive Quiz App](https://github.com/RMR0304/Interactive-Quiz-App) repository, with additional customization and interface improvements.

Please review the original repository's license and preserve any required attribution and notices before redistributing the project.
