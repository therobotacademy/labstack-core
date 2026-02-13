# Scientific Experiment Manager

A full-stack web application for managing scientific experiments, built with React, Node.js, and SQLite.

## Features

- **Authentication**: Secure JWT-based login for Admins and Researchers.
- **Role-Based Access Control**:
  - **Admins**: Manage users (create researchers, delete users), view system statistics.
  - **Researchers**: Create, read, update, and delete (CRUD) their own experiments.
- **Modern UI**: specialized "Scientific Dashboard" aesthetic using Tailwind CSS and Shadcn/ui.
- **Data Persistence**: SQLite database with Prisma ORM.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Shadcn/ui, React Router.
- **Backend**: Node.js, Express, Prisma, SQLite, JSON Web Token (JWT).

## Project Structure

- `client/`: React frontend application.
- `server/`: Node.js backend API.

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Backend Setup

```bash
cd server
npm install
# Initialize Database
npx prisma migrate dev --name init
# Seed Database (Creates default Admin)
node prisma/seed.js
# Start Server
node server.js
```
Server runs on `http://localhost:3001`.

### 2. Frontend Setup

```bash
cd client
npm install
# Start Development Server
npm run dev
```
Client runs on `http://localhost:5173`.

## Default Credentials

- **Admin User**:
  - Email: `admin@example.com`
  - Password: `admin123`

- **Researcher**:
  - You must login as Admin first to create a Researcher account.

## key API Endpoints

- `POST /api/auth/login`: User login.
- `GET /api/users`: List users (Admin only).
- `GET /api/experiments`: List researcher's experiments.
- `POST /api/experiments`: Create new experiment.
