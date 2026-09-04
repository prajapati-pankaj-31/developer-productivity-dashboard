# Users, Projects & Tasks REST API

> Production-grade RESTful backend built with **Node.js**, **Express**, and **TypeScript** for the **Developer Productivity Dashboard**.

---

## 📖 Table of Contents
- [1. Overview](#1-overview)
- [2. Tech Stack](#2-tech-stack)
- [3. Project Architecture & Folder Structure](#3-project-architecture--folder-structure)
- [4. Environment Setup & Configuration](#4-environment-setup--configuration)
- [5. Getting Started & Running the Server](#5-getting-started--running-the-server)
- [6. API Endpoints Overview](#6-api-endpoints-overview)
- [7. Detailed API Reference & Examples](#7-detailed-api-reference--examples)
  - [Health Check](#health-check)
  - [Users API (`/api/v1/users`)](#users-api-apiv1users)
  - [Projects API (`/api/v1/projects`)](#projects-api-apiv1projects)
  - [Tasks API (`/api/v1/tasks`)](#tasks-api-apiv1tasks)
  - [Task Status Management (`PATCH /api/v1/tasks/:id/status`)](#task-status-management-patch-apiv1tasksidstatus)
- [8. Validation & Relational Integrity](#8-validation--relational-integrity)
- [9. Standard Response & Centralized Error Handling](#9-standard-response--centralized-error-handling)
- [10. Automated Testing](#10-automated-testing)
- [11. API Testing Collections](#11-api-testing-collections)
- [12. Roadmap & Database Transition](#12-roadmap--database-transition)

---

## 1. Overview
This backend provides clean, modular, and type-safe REST APIs powering the Developer Productivity Dashboard frontend, including Users, Engineering Projects, Sprint Tasks, and real-time Status transitions.

The service uses an in-memory repository designed to decouple business logic from the storage layer, allowing persistent databases (PostgreSQL/MongoDB via Prisma/Mongoose) to be connected seamlessly.

---

## 2. Tech Stack
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js (v4.21+)
- **Language:** TypeScript (v5.7+, Strict Mode)
- **Validation Engine:** Zod (v3.24+)
- **Security:** Helmet, CORS, Body Limits
- **Testing:** Vitest & Supertest (35 passing automated test suites)
- **Dev Execution:** `tsx` (TypeScript Execute & Hot Watcher)

---

## 3. Project Architecture & Folder Structure

```
backend/
├── src/
│   ├── controllers/            # HTTP Request/Response Orchestration
│   │   ├── user.controller.ts
│   │   ├── project.controller.ts
│   │   └── task.controller.ts
│   │
│   ├── routes/                 # Express Router Endpoints & Middlewares
│   │   ├── index.ts            # Root API v1 Router
│   │   ├── user.routes.ts
│   │   ├── project.routes.ts
│   │   └── task.routes.ts
│   │
│   ├── services/               # Core Business Logic & Relational Validation
│   │   ├── user.service.ts
│   │   ├── project.service.ts
│   │   └── task.service.ts
│   │
│   ├── validators/             # Zod Input Validation Schemas
│   │   ├── user.validator.ts
│   │   ├── project.validator.ts
│   │   └── task.validator.ts
│   │
│   ├── middleware/             # Reusable Express Middlewares
│   │   ├── error.middleware.ts      # Centralized Error Interceptor
│   │   ├── validation.middleware.ts # Zod Schema Validator
│   │   └── notFound.middleware.ts   # 404 Route Handler
│   │
│   ├── data/                   # Initial Seed Data & In-Memory Store
│   │   └── mock-data.ts
│   │
│   ├── types/                  # TypeScript Data Contracts & Interfaces
│   │   └── index.ts
│   │
│   ├── utils/                  # Response Helpers & Custom Error Classes
│   │   ├── api-response.ts
│   │   └── errors.ts
│   │
│   ├── app.ts                  # Express App Instance Configuration
│   └── server.ts               # HTTP Server Entrypoint & Graceful Shutdown
│
├── tests/                      # Automated Integration Test Suites
│   ├── health.test.ts
│   ├── users.test.ts
│   ├── projects.test.ts
│   └── tasks.test.ts
│
├── api.http                    # VS Code / IDE REST Client File
├── .env.example                # Sample Environment Variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. Environment Setup & Configuration

Create your `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Default variables:
```env
PORT=5000
NODE_ENV=development
API_PREFIX=/api/v1
FRONTEND_URL=http://localhost:3000
```

---

## 5. Getting Started & Running the Server

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run Development Server (with hot reload)
```bash
npm run dev
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build Production Bundle
```bash
npm run build
npm start
```

---

## 6. API Endpoints Overview

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | API Health & Uptime Status | `200 OK` |
| `GET` | `/` | API Root Overview & Resource Map | `200 OK` |
| **Users** | | | |
| `GET` | `/api/v1/users` | List all users | `200 OK` |
| `GET` | `/api/v1/users/:id` | Get user by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/v1/users` | Create a new user | `201 Created` / `400 Bad Request` |
| `PATCH` | `/api/v1/users/:id` | Update user profile | `200 OK` / `400 Bad Request` |
| `DELETE` | `/api/v1/users/:id` | Delete user (guards active tasks) | `200 OK` / `400 Bad Request` |
| **Projects** | | | |
| `GET` | `/api/v1/projects` | List projects (supports `status`, `search`) | `200 OK` |
| `GET` | `/api/v1/projects/:id` | Get project by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/v1/projects` | Create a new project | `201 Created` / `400 / 409` |
| `PATCH` | `/api/v1/projects/:id` | Update project | `200 OK` / `400 Bad Request` |
| `DELETE` | `/api/v1/projects/:id` | Delete project (guards associated tasks) | `200 OK` / `400 Bad Request` |
| **Tasks** | | | |
| `GET` | `/api/v1/tasks` | List tasks (supports `status`, `priority`, `projectId`, `search`) | `200 OK` |
| `GET` | `/api/v1/tasks/:id` | Get task by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/v1/tasks` | Create task (validates `projectId` & `assigneeId`) | `201 Created` / `400 / 404` |
| `PATCH` | `/api/v1/tasks/:id` | Update task | `200 OK` / `400 Bad Request` |
| `PATCH` | `/api/v1/tasks/:id/status`| Dedicated task status transition | `200 OK` / `400 Bad Request` |
| `PATCH` | `/api/v1/tasks/:id/subtasks/:subtaskId/toggle`| Toggle subtask completion status | `200 OK` / `404 Not Found` |
| **Analytics & Telemetry** | | | |
| `GET` | `/api/v1/analytics/metrics` | 4 Core Productivity KPI metrics | `200 OK` |
| `GET` | `/api/v1/analytics/weekly` | 7-Day focus and commit velocity stream | `200 OK` |
| `GET` | `/api/v1/analytics/overview` | Aggregated dashboard telemetry summary | `200 OK` |
| `GET` | `/api/v1/activities` | Live engineering activity feed stream | `200 OK` |
| `POST` | `/api/v1/activities` | Log new engineering activity event | `201 Created` / `400 Bad Request` |

---

## 7. Detailed API Reference & Examples

### Health Check
```http
GET /health
```
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2026-09-02T14:35:00.000Z",
  "uptimeSeconds": 142
}
```

---

### Users API (`/api/v1/users`)

#### 1. Create User (`POST /api/v1/users`)
**Request Body:**
```json
{
  "name": "Ananya Sharma",
  "role": "ML & Data Engineer",
  "email": "ananya.s@devhub.io",
  "status": "flow",
  "statusMessage": "Quantizing LLM pipelines",
  "weeklyFocusGoalHours": 35
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "usr-1741014839201",
    "name": "Ananya Sharma",
    "email": "ananya.s@devhub.io",
    "role": "ML & Data Engineer",
    "avatarUrl": "/pankaj.jpg",
    "initials": "AS",
    "status": "flow",
    "statusMessage": "Quantizing LLM pipelines",
    "weeklyFocusGoalHours": 35
  }
}
```

---

### Projects API (`/api/v1/projects`)

#### 1. Filter Projects by Query (`GET /api/v1/projects?status=on_track&search=appointment`)
**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "proj-saq",
      "name": "Smart Appointment / Queue Management System",
      "key": "SAQ",
      "description": "Real-time multi-counter appointment scheduling, digital queue tokens, and wait-time engine.",
      "status": "on_track",
      "progress": 90,
      "totalTasks": 32,
      "completedTasks": 28,
      "deadline": "2026-04-15",
      "repository": "https://github.com/prajapati-pankaj-31/smart-appointment-queue",
      "techStack": ["React", "TypeScript", "FastAPI", "Redis", "WebSockets"],
      "lead": {
        "id": "usr-1",
        "name": "Pankaj Prajapati",
        "role": "AI & Full Stack Developer"
      },
      "color": "#06b6d4"
    }
  ],
  "count": 1
}
```

---

### Tasks API (`/api/v1/tasks`)

#### 1. Create Task with Relations (`POST /api/v1/tasks`)
**Request Body:**
```json
{
  "title": "Stream real-time developer metrics via WebSockets",
  "description": "Build WebSocket server gateway forwarding live git commits and task telemetry.",
  "projectId": "proj-dpd",
  "assigneeId": "usr-1",
  "priority": "high",
  "status": "in_progress",
  "dueDate": "2026-03-12",
  "estimatedHours": 6,
  "tags": ["WebSockets", "Telemetry", "Backend"],
  "subtasks": [
    { "title": "Setup WebSocket gateway", "completed": true },
    { "title": "Connect dashboard listener", "completed": false }
  ]
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "task-1741014900123",
    "title": "Stream real-time developer metrics via WebSockets",
    "description": "Build WebSocket server gateway forwarding live git commits and task telemetry.",
    "projectId": "proj-dpd",
    "projectName": "Developer Productivity Dashboard Platform",
    "priority": "high",
    "status": "in_progress",
    "assignee": {
      "id": "usr-1",
      "name": "Pankaj Prajapati",
      "email": "pankaj.prajapati@devhub.io",
      "role": "AI & Full Stack Developer",
      "initials": "PP",
      "status": "flow"
    },
    "dueDate": "2026-03-12",
    "estimatedHours": 6,
    "loggedHours": 0,
    "subtasks": [
      { "id": "sub-task-1741014900123-1", "title": "Setup WebSocket gateway", "completed": true },
      { "id": "sub-task-1741014900123-2", "title": "Connect dashboard listener", "completed": false }
    ],
    "tags": ["WebSockets", "Telemetry", "Backend"],
    "createdAt": "2026-03-02"
  }
}
```

---

### Task Status Management (`PATCH /api/v1/tasks/:id/status`)

**Request Body:**
```json
{
  "status": "completed"
}
```
*Allowed enum values:* `backlog`, `in_progress`, `in_review`, `completed`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "task-1",
    "title": "Implement dynamic queue token allocation algorithm",
    "status": "completed"
  }
}
```

**Invalid Status Error (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": [
      {
        "path": "status",
        "message": "Invalid task status. Allowed values: 'backlog', 'in_progress', 'in_review', 'completed'"
      }
    ]
  }
}
```

---

## 8. Validation & Relational Integrity
1. **Schema Validation:** Handled via Zod schemas attached on route entry.
2. **Relational Reference Verification:**
   - Tasks cannot reference a non-existent `projectId` (returns `404 Not Found`).
   - Tasks cannot reference a non-existent `assigneeId` (returns `404 Not Found`).
   - Users assigned to active tasks cannot be deleted without reassigning tasks first (returns `400 Bad Request`).
   - Projects with associated tasks cannot be deleted without removing tasks first (returns `400 Bad Request`).
3. **Unique Constraints:** Project keys (`key`) and User emails (`email`) are validated against duplicate conflicts (`409 Conflict`).

---

## 9. Standard Response & Centralized Error Handling

All responses adhere to a consistent contract:

### Success Format:
```json
{
  "success": true,
  "data": { ... }
}
```

### Collection Format:
```json
{
  "success": true,
  "data": [ ... ],
  "count": 5
}
```

### Error Format:
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Task with id 'task-999' not found."
  }
}
```

---

## 10. Automated Testing

The backend includes full integration test coverage using **Vitest** and **Supertest**:

```bash
npm test
```

### Test Coverage Summary:
- ✅ **`health.test.ts`**: Verifies `/health`, root `/`, and 404 handler responses.
- ✅ **`users.test.ts`**: Verifies user listing, retrieval, creation, partial patch, deletion, and active-task protection.
- ✅ **`projects.test.ts`**: Verifies project listing, status/search filtering, key conflict rejection, and lead relational lookup.
- ✅ **`tasks.test.ts`**: Verifies task retrieval, multi-parameter filtering (`status`, `priority`, `projectId`, `search`), relational validation (`projectId`/`assigneeId`), dedicated `/status` transition, and invalid enum rejection.

---

## 11. API Testing Collections

1. **Postman Collection v2.1:** Located at [`docs/postman_collection.json`](file:///d:/int/developer-productivity-dashboard/docs/postman_collection.json).
   - Includes full folder structure, pre-configured URLs, sample bodies, and automated JavaScript assertion scripts.
2. **REST Client File:** Located at [`backend/api.http`](file:///d:/int/developer-productivity-dashboard/backend/api.http) for instant execution in VS Code.

---

## 12. Roadmap & Database Transition

```
┌─────────────────────────────────────────────────────────┐
│               Next.js Frontend (Client)                 │
└───────────────────────────▲─────────────────────────────┘
                            │ REST API Calls (CORS enabled)
┌───────────────────────────▼─────────────────────────────┐
│       Express + TypeScript REST API Layer               │
│  (Controllers ➔ Services ➔ Validators ➔ Middlewares)   │
└───────────────────────────▲─────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
        In-Memory Store          Persistent Storage
      (Fast Mock Data)     (PostgreSQL / MongoDB / Prisma)
```

The `InMemoryStore` in `src/data/mock-data.ts` can be seamlessly replaced with database repositories without requiring any changes to Controllers, Routes, or Validators.
