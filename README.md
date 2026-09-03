# Developer Productivity Dashboard & REST API

> Full-Stack Engineering Platform for developer productivity tracking, sprint management, project telemetry, and focus companion workflows.
> Developed as part of the **Innovation Hacks Full Stack Development Internship**.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              Task 1: Next.js 16 Frontend                │
│   (Futuristic Glass UI, Sprint Boards, Focus Timer)     │
└───────────────────────────▲─────────────────────────────┘
                            │ REST API (CORS & JSON)
┌───────────────────────────▼─────────────────────────────┐
│       Task 2: Express + TypeScript REST API Layer       │
│  (Controllers ➔ Services ➔ Validators ➔ Middlewares)   │
└───────────────────────────▲─────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
   [Current] Task 2 Store        [Next] Task 3 Persistence
      (In-Memory Store)        (PostgreSQL / MongoDB / Prisma)
```

---

## 📌 Internship Milestones

### 🌟 Task 1: Developer Productivity Dashboard (Frontend)
- **KPI Metrics & Velocity Charts:** Focus score, sprint velocity, PR reviews, and daily focus cadence.
- **Sprint Task Board:** Inline status transitions, subtask progress, priority badges, and branch tags.
- **Engineering Projects Hub:** Multi-project health tracking, progress bars, and modal roadmaps.
- **Focus Companion & Preferences:** Pomodoro work timer, developer profile modal, and workspace settings.
- **Dynamic Futuristic Ambience:** Full-screen SVG constellation network, flowing particles, and mouse spotlight.

### ⚡ Task 2: Users, Projects & Tasks REST API (Backend)
- **Node.js + Express + TypeScript:** Modular layered architecture (Controllers, Services, Validators, Middlewares).
- **Zod Schema Validation:** Strict request body, query, and parameter validation across all write operations.
- **Relational Integrity:** Validates project and assignee references; guards against deleting users or projects with active tasks.
- **Status Management:** Dedicated `PATCH /api/v1/tasks/:id/status` endpoint with strict enum validation.
- **Centralized Error Handling:** Consistent JSON error structure and HTTP status codes (`200`, `201`, `400`, `404`, `409`, `500`).
- **Comprehensive Testing:** 35 automated integration tests with Vitest & Supertest, Postman Collection v2.1, and VS Code `api.http`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons |
| **Backend** | Node.js v20+, Express.js 4.21, TypeScript 5.7, Zod 3.24, Helmet, CORS |
| **Testing** | Vitest, Supertest (35 passing integration tests) |
| **Tooling** | Postman Collection v2.1, REST Client (`api.http`), `tsx` |

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
│   └── postman_collection.json  # Task 2 Postman Collection v2.1
│
├── backend/                     # Task 2 Backend REST API
│   ├── src/
│   │   ├── controllers/         # HTTP Controllers
│   │   ├── routes/              # Express API Routes
│   │   ├── services/            # Core Business Logic & Validations
│   │   ├── validators/          # Zod Validation Schemas
│   │   ├── middleware/          # Error, Validation & 404 Middlewares
│   │   ├── data/                # In-memory Store & Seed Data
│   │   ├── types/               # Backend Type Definitions
│   │   ├── utils/               # API Response & Custom Error Classes
│   │   ├── app.ts               # Express App Setup
│   │   └── server.ts            # Server Entrypoint
│   ├── tests/                   # Vitest Automated Test Suites
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

### 1. Run the Frontend (Task 1)
```bash
# Install frontend dependencies
npm install

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the Developer Productivity Dashboard.

---

### 2. Run the Backend REST API (Task 2)
```bash
# Navigate to backend folder
cd backend

# Install backend dependencies
npm install

# Start development API server with hot-reload
npm run dev
```
The REST API will run at [http://localhost:5000](http://localhost:5000).

- **Health Check:** `http://localhost:5000/health`
- **API Base:** `http://localhost:5000/api/v1`
- **Users:** `http://localhost:5000/api/v1/users`
- **Projects:** `http://localhost:5000/api/v1/projects`
- **Tasks:** `http://localhost:5000/api/v1/tasks`

---

## 🧪 Testing & Verification

### Run Backend Automated Tests
```bash
cd backend
npm test
```
```
 ✓ tests/health.test.ts (3 tests)
 ✓ tests/projects.test.ts (10 tests)
 ✓ tests/users.test.ts (9 tests)
 ✓ tests/tasks.test.ts (13 tests)

 Test Files  4 passed (4)
      Tests  35 passed (35)
```

### Run Frontend Linter & Production Build
```bash
# Root directory
npm run lint
npm run build
```

---

## 📑 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server Health Status |
| `GET` | `/api/v1/users` | List all users |
| `GET` | `/api/v1/users/:id` | Get user by ID |
| `POST` | `/api/v1/users` | Create user |
| `PATCH` | `/api/v1/users/:id` | Update user |
| `DELETE` | `/api/v1/users/:id` | Delete user |
| `GET` | `/api/v1/projects` | List projects (query: `status`, `search`) |
| `GET` | `/api/v1/projects/:id` | Get project by ID |
| `POST` | `/api/v1/projects` | Create project |
| `PATCH` | `/api/v1/projects/:id` | Update project |
| `DELETE` | `/api/v1/projects/:id` | Delete project |
| `GET` | `/api/v1/tasks` | List tasks (query: `status`, `priority`, `projectId`, `search`) |
| `GET` | `/api/v1/tasks/:id` | Get task by ID |
| `POST` | `/api/v1/tasks` | Create task (relational validation) |
| `PATCH` | `/api/v1/tasks/:id` | Update task |
| `DELETE` | `/api/v1/tasks/:id` | Delete task |
| `PATCH` | `/api/v1/tasks/:id/status` | Dedicated task status update |

For complete payload examples and schema documentation, see [`backend/README.md`](file:///d:/int/developer-productivity-dashboard/backend/README.md).

---

## 🔮 Roadmap: Task 3 & Task 4

- **Task 3 (Database Integration):** Connect PostgreSQL / MongoDB via Prisma ORM to replace the in-memory repository with persistent storage.
- **Task 4 (Authentication & AI Workflows):** JWT / OAuth authentication and AI-powered sprint task breakdown & workload recommendations.
