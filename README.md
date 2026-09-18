# Developer Productivity Dashboard & REST API

> Full-Stack Engineering Platform for developer productivity tracking, sprint management, project telemetry, persistent database layer, and focus companion workflows.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│               Next.js 16 Frontend (UI)                  │
│   (Futuristic Glass UI, Sprint Boards, Focus Timer)     │
└───────────────────────────▲─────────────────────────────┘
                            │ REST API (CORS & JSON)
┌───────────────────────────▼─────────────────────────────┐
│       Express + TypeScript REST API Layer               │
│  (Controllers ➔ Services ➔ Validators ➔ Middlewares)   │
└───────────────────────────▲─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│       Prisma ORM Persistent Data Layer                  │
│  (Users ➔ Projects ➔ Tasks ➔ Subtasks ➔ Activities)     │
│       [SQLite (Local Dev) / PostgreSQL (Cloud/Prod)]    │
└─────────────────────────────────────────────────────────┘
```

---

## 📌 Core Features & Modules

### 🌟 Frontend: Developer Productivity Dashboard
- **KPI Metrics & Velocity Charts:** Focus score, sprint velocity, PR reviews, and daily focus cadence.
- **Sprint Task Board:** Inline status transitions, subtask progress, priority badges, and branch tags.
- **Engineering Projects Hub:** Multi-project health tracking, progress bars, and modal roadmaps.
- **Focus Companion & Preferences:** Pomodoro work timer, developer profile modal, and workspace settings.
- **Dynamic Futuristic Ambience:** Full-screen SVG constellation network, flowing particles, and mouse spotlight.

### ⚡ Backend: Users, Projects & Tasks REST API
- **Node.js + Express + TypeScript:** Modular layered architecture (Controllers, Services, Validators, Middlewares).
- **Zod Schema Validation:** Strict request body, query, and parameter validation across all write operations.
- **Relational Integrity:** Validates project and assignee references; guards against deleting users or projects with active tasks.
- **Status Management:** Dedicated `PATCH /api/v1/tasks/:id/status` endpoint with strict enum validation.
- **Centralized Error Handling:** Consistent JSON error structure and HTTP status codes (`200`, `201`, `400`, `404`, `409`, `500`).

### 🗄️ Database: Persistent Data Layer (Prisma ORM)
- **Prisma Schema & Relational Models:** `User`, `Project`, `ProjectMember`, `Task`, `Subtask`, `Activity`, and `DailyProductivity`.
- **Foreign Key Constraints & Cascades:** Relational links between tasks, users, and projects with cascade rules.
- **Automated Seeding:** `npm run db:seed` script populating mock engineering projects, sprint tasks, and metrics.
- **Visual Database Studio:** `npm run db:studio` for visual data browsing and editing.
- **Zero-Config Local Dev & Cloud PostgreSQL:** Works immediately with SQLite and seamlessly switches to PostgreSQL / Supabase / Neon via `DATABASE_URL`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons |
| **Backend** | Node.js v20+, Express.js 4.21, TypeScript 5.7, Zod 3.24, Helmet, CORS |
| **Database & ORM** | Prisma ORM 6, SQLite / PostgreSQL, Declarative Migrations |
| **Testing** | Vitest, Supertest (41 passing automated integration tests) |
| **Tooling** | Prisma Studio, Postman Collection v2.1, REST Client (`api.http`), `tsx` |

---

## 📂 Repository Structure

```
developer-productivity-dashboard/
│
├── app/                         # Next.js App Router pages and layouts
├── components/                  # React dashboard and UI components
├── lib/                         # Frontend mock data and utility helpers
├── types/                       # Shared TypeScript type definitions
├── docs/
│   └── postman_collection.json  # Postman Collection v2.1
│
├── backend/                     # Backend REST API & Database
│   ├── prisma/
│   │   ├── schema.prisma        # Prisma Database Schema & Models
│   │   └── seed.ts              # Seed Entrypoint
│   ├── src/
│   │   ├── controllers/         # HTTP Controllers (async/await)
│   │   ├── routes/              # Express API Routes
│   │   ├── services/            # Database Query Services (Prisma)
│   │   ├── validators/          # Zod Validation Schemas
│   │   ├── middleware/          # Error, Validation & 404 Middlewares
│   │   ├── db/                  # Prisma Client Singleton & Seed Logic
│   │   ├── types/               # Backend Type Definitions
│   │   ├── utils/               # API Response & Custom Error Classes
│   │   ├── app.ts               # Express App Setup
│   │   └── server.ts            # Server Entrypoint with DB Lifecycle
│   ├── tests/                   # Vitest Automated Test Suites (41 tests)
│   ├── api.http                 # REST Client Test File
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md                # Detailed Backend API Documentation
│
├── package.json                 # Frontend Package
├── README.md                    # Root Documentation
└── tsconfig.json
```

---

## 🚀 Quick Start Guide

### 1. Run the Backend REST API with Database
```bash
# Navigate to backend folder
cd backend

# Install backend dependencies
npm install

# Initialize database schema
npm run db:push

# Seed database with initial engineering data
npm run db:seed

# Start development API server with hot-reload
npm run dev
```
The REST API will run at [http://localhost:5000](http://localhost:5000).

- **Health Check:** `http://localhost:5000/health`
- **API Base:** `http://localhost:5000/api/v1`
- **Users:** `http://localhost:5000/api/v1/users`
- **Projects:** `http://localhost:5000/api/v1/projects`
- **Tasks:** `http://localhost:5000/api/v1/tasks`
- **Prisma Studio (Visual GUI):** `npm run db:studio` (opens at `http://localhost:5555`)

---

### 2. Run the Frontend Dashboard
```bash
# Root directory
npm install

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the Developer Productivity Dashboard.

---

## 🧪 Testing & Verification

### Run Backend Automated Integration Tests
```bash
cd backend
npm test
```
```
 ✓ tests/tasks.test.ts (13 tests)
 ✓ tests/projects.test.ts (10 tests)
 ✓ tests/users.test.ts (9 tests)
 ✓ tests/analytics.test.ts (6 tests)
 ✓ tests/health.test.ts (3 tests)

 Test Files  5 passed (5)
      Tests  41 passed (41)
```

### Run Frontend Linter & Production Build
```bash
npm run lint
npm run build
```

---

## 📑 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server Health & DB Status |
| `GET` | `/api/v1/users` | List all users |
| `GET` | `/api/v1/users/:id` | Get user by ID |
| `POST` | `/api/v1/users` | Create user |
| `PATCH` | `/api/v1/users/:id` | Update user |
| `DELETE` | `/api/v1/users/:id` | Delete user (with active task safety) |
| `GET` | `/api/v1/projects` | List projects (query: `status`, `search`) |
| `GET` | `/api/v1/projects/:id` | Get project by ID (with lead & members) |
| `POST` | `/api/v1/projects` | Create project (relational lead validation) |
| `PATCH` | `/api/v1/projects/:id` | Update project |
| `DELETE` | `/api/v1/projects/:id` | Delete project |
| `GET` | `/api/v1/tasks` | List tasks (query: `status`, `priority`, `projectId`, `search`) |
| `GET` | `/api/v1/tasks/:id` | Get task by ID |
| `POST` | `/api/v1/tasks` | Create task (relational project/assignee validation) |
| `PATCH` | `/api/v1/tasks/:id` | Update task & subtasks |
| `DELETE` | `/api/v1/tasks/:id` | Delete task |
| `PATCH` | `/api/v1/tasks/:id/status` | Dedicated task status transition |
| `PATCH` | `/api/v1/tasks/:id/subtasks/:subtaskId/toggle` | Toggle subtask completion |
| `GET` | `/api/v1/analytics/metrics` | 4 Core developer productivity KPI metrics |
| `GET` | `/api/v1/analytics/weekly` | 7-day velocity and focus cadence |
| `GET` | `/api/v1/analytics/overview` | Aggregated dashboard summary |
| `GET` | `/api/v1/activities` | Real-time engineering activity stream |
| `POST` | `/api/v1/activities` | Record engineering event |

For complete payload examples and schema documentation, see [`backend/README.md`](file:///d:/int/developer-productivity-dashboard/backend/README.md).

---

## 🔮 Future Roadmap (Task 4)

- **Authentication & User Sessions:** JWT / OAuth 2.0 authentication, password hashing with Argon2/Bcrypt, and protected API routes.
- **AI-Powered Developer Capabilities:** LLM-assisted task breakdown, sprint estimation suggestions, and automated code review summaries.
