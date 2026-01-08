# MERN Stack Project Manager

A comprehensive Project Management Application built with the MERN stack (MongoDB, Express.js, React, Node.js) and TypeScript. This application allows users to manage teams, create and assign tasks, track progress with a Kanban board, and collaborate effectively.

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Architecture & Design](#-architecture--design)
- [Known Issues & Trade-offs](#-known-issues--trade-offs)
- [Future Improvements](#-future-improvements)

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Language**: TypeScript
- **Authentication**: JWT & Cookie Parser
- **Security**: Helmet, Rate Limiting, CORS, Bcrypt
- **Logging**: Morgan, Winston
- **Validation**: Express Validator
- **Documentation**: Swagger UI

### Frontend
- **Framework**: React.js (Vite)
- **State Management**: React Query (TanStack Query), Context API
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **UI Components**: React Icons, React Toastify
- **Drag & Drop**: Hello Pangea DnD (Kanban)

## 🚀 Project Overview

This project simulates a real-world task management environment where:
- **Users** can register, log in, and be authenticated via JWT.
- **Leads** can create Teams and assign members.
- **Tasks** can be created, updated, deleted, and moved across statuses (Todo, In Progress, Review, Done).
- **Kanban Board** provides a visual representation of task progress.

## ✨ Features
- **Authentication**: Secure Login/Register with HttpOnly Cookies.
- **Role-Based Access**: Distinctions between Admins, Leads, and Members.
- **Team Management**: Create teams and add members.
- **Task Management**: Full CRUD operations for tasks with priority and due dates.
- **Interactive UI**: Drag-and-drop Kanban board for task status updates.
- **Responsive Design**: Built with TailwindCSS for mobile and desktop.

## 📦 Prerequisites

Ensure you have the following installed:
- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **MongoDB**: Local URI or MongoDB Atlas connection string

## 💻 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create .env file (see Environment Variables section)
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the Application:**
   - Frontend: `http://localhost:5173` (Vite default)
   - Backend API: `http://localhost:5000`

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-project
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
```

*(Optional)* Create a `.env` file in `frontend/` if you need custom API URLs:
```env
VITE_API_URL=http://localhost:5000/api
```

## 📖 API Documentation

The backend includes Swagger documentation. After starting the server, visit:
**`http://localhost:5000/api-docs`**

### Core Endpoints

**Auth**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

**Teams**
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create a new team
- `GET /api/teams/:id` - Get team details

**Tasks**
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a task
- `PUT /api/tasks/:id` - Update task (status, content)
- `DELETE /api/tasks/:id` - Delete task

## 🗄 Database Schema

### User
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: member, lead, admin)

### Team
- `name` (String)
- `description` (String)
- `members` (Array of Reference to User)
- `createdBy` (Reference to User)

### Task
- `title` (String)
- `description` (String)
- `status` (Enum: todo, in_progress, review, done)
- `priority` (Enum: low, medium, high)
- `assignedTo` (Reference to User)
- `teamId` (Reference to Team)
- `dueDate` (Date)

## 🏗 Architecture & Design

**Backend Architecture**
We utilize a layered architecture to ensure separation of concerns:
- **Routes**: Define endpoints and apply middleware.
- **Controllers**: Handle HTTP requests and responses.
- **Models**: Define data structure and database interactions.
- **Middleware**: Handle cross-cutting concerns (Auth, Error Handling, Logging).

**Frontend Architecture**
- **Component-Based**: Reusable UI components.
- **Hooks**: Custom hooks for logic reuse.
- **Services/API**: Centralized API calls using Axios.
- **Context/Providers**: Global state management for Auth.

## ⚠️ Known Issues & Trade-offs
- **SSR**: No Server-Side Rendering (SPA only), which might impact initial load SEO (though less relevant for dashboard apps).
- **Socket.io**: Real-time updates are not yet implemented; users must refresh or rely on optimistic UI updates.
- **Database**: Currently using MongoDB; transactions are not heavily used, assuming eventual consistency is acceptable for this scale.

## 🚀 Future Improvements
- **Real-time Collaboration**: Integrate Socket.io for live task updates.
- **Notifications**: Email or in-app notifications for task assignments.
- **File Attachments**: Allow users to attach files to tasks (S3 integration).
- **Advanced Analytics**: Dashboard charts showing team velocity and burn-down charts.
- **CI/CD**: Automate testing and deployment pipelines.

---

*Verified by QA Automation Suites: Health, Auth, and Error Handling.*
