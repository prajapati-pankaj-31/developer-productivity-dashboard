# Developer Productivity Dashboard & REST API

> Full-Stack Engineering Platform for developer productivity tracking, sprint management, project telemetry, and focus companion workflows.

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
              ┌─────────────┴─────────────┐
              ▼                           ▼
       In-Memory Store           Persistent Storage
     (Fast Local State)    (PostgreSQL / MongoDB / Prisma)
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
- **Comprehensive Testing:** 35+ automated integration tests with Vitest & Supertest, Postman Collection v2.1, and VS Code `api.http`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons |
| **Backend** | Node.js v20+, Express.js 4.21, TypeScript 5.7, Zod 3.24, Helmet, CORS |
| **Testing** | Vitest, Supertest (automated integration tests) |
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
│   └── postman_collection.json  # Postman Collection v2.1
│
├── backend/                     # Backend REST API
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

### 1. Run the Frontend
```bash
# Install frontend dependencies
npm install

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the Developer Productivity Dashboard.

---

### 2. Run the Backend REST API
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
 ✓ tests/health.test.ts
 ✓ tests/projects.test.ts
 ✓ tests/users.test.ts
 ✓ tests/tasks.test.ts
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

## 🔮 Future Roadmap

- **Database Integration:** Connect PostgreSQL / MongoDB via Prisma ORM for persistent database storage.
- **Authentication & AI Workflows:** JWT / OAuth authentication and AI-powered sprint task breakdown & workload recommendations.

