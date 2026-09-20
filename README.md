# Developer Productivity Dashboard & AI Engineering Platform

> Full-Stack, AI-powered engineering platform for developer productivity tracking, sprint management, project telemetry, persistent database layer, and AI sprint assistant workflows.
> Built for the **Innovation Hacks Full Stack Development Internship (Tasks 1 - 4)**.

---

## 🏗️ Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js 16 Frontend (UI)                        │
│   (Futuristic Glass UI, Sprint Boards, Focus Timer, AI Copilot Modal)  │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ HTTP REST + JWT Session Auth
┌───────────────────────────────────▼────────────────────────────────────┐
│                  Express.js + TypeScript REST API                      │
│      (Controllers ➔ Services ➔ Validators ➔ Error Middlewares)        │
├───────────────────────────────────┬────────────────────────────────────┤
│     AI Intelligence Engine        │          Data Layer                │
│  (Groq LPU / Llama 3.3 70B / GenAI) (Prisma ORM on Supabase PostgreSQL)│
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 🌟 Full-Stack Features & Capabilities

### 1. 🎨 Modern Frontend Dashboard (Task 1)
- **KPI Metrics & Velocity Charts:** Focus score, sprint velocity, PR reviews, and daily focus cadence.
- **Sprint Task Board:** Inline status transitions, subtask progress, priority badges, and branch tags.
- **Engineering Projects Hub:** Multi-project health tracking, progress bars, and modal roadmaps.
- **Focus Companion & Preferences:** Pomodoro work timer, developer profile modal, and workspace settings.
- **Dynamic Futuristic Ambience:** Full-screen SVG constellation network, flowing particles, and mouse spotlight.

### 2. ⚡ Layered REST API & Controllers (Task 2)
- **Node.js + Express + TypeScript:** Modular layered architecture (Controllers, Services, Validators, Middlewares).
- **Zod Schema Validation:** Strict request body, query, and parameter validation across all write operations.
- **Relational Integrity:** Validates project and assignee references; guards against deleting users or projects with active tasks.
- **Status Management:** Dedicated `PATCH /api/v1/tasks/:id/status` endpoint with strict enum validation.
- **Centralized Error Handling:** Consistent JSON error structure and HTTP status codes (`200`, `201`, `400`, `401`, `404`, `409`, `500`).

### 3. 🗄️ Database & Authentication Layer (Task 3)
- **Prisma & Supabase PostgreSQL:** Persistent relational schema with foreign key cascades (`User`, `Project`, `ProjectMember`, `Task`, `Subtask`, `Activity`).
- **User Authentication:** Sign up with bcrypt password salting, sign in with JWT token issuance, and protected user endpoints.
- **Dynamic Team Directory:** Smart self-assignment priority (`⭐ You`) with real-time PostgreSQL database directory sync.
- **Automated Seeding & Studio:** `npm run db:seed` script and visual Prisma Studio.

### 4. 🤖 AI-Powered Capabilities (Task 4)
- **✨ AI Smart Task & Subtask Generator:** 1-click feature prompt breakdown into acceptance criteria, subtasks, estimated hours, priority, and tags using **Groq (`llama-3.3-70b-versatile`)**.
- **🤖 AI Sprint Copilot & Daily Standup Assistant:** Automated synthesis of completed PRs, active tickets, and deep work hours into an executive Daily Standup Report (*"Yesterday, Today, Blockers"*) with 1-click Slack / Teams export.
- **⚡ AI Project Roadmap Synthesizer:** Multi-phase milestone and tech stack generation for new engineering initiatives.
- **Hybrid AI Fallback Architecture:** Supports Groq Cloud API, Google Gemini API, and smart offline heuristic engine for 100% uptime.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (Turbopack, App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons |
| **Backend** | Node.js v20+, Express.js 4.21, TypeScript 5.7, Zod 3.24, Helmet, CORS, jsonwebtoken, bcryptjs |
| **AI Engine** | Groq Cloud SDK (`groq-sdk`, `llama-3.3-70b-versatile`), Google Gemini SDK (`@google/genai`) |
| **Database & ORM** | Prisma ORM 6, PostgreSQL (Supabase Pooler), SQLite fallback |
| **Testing** | Vitest, Supertest (Automated Integration Test Suites) |
| **Tooling** | Prisma Studio, Postman Collection v2.1, REST Client (`api.http`), `tsx` |

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js v20+
- npm v10+

### 1. Clone the Repository
```bash
git clone https://github.com/prajapati-pankaj-31/developer-productivity-dashboard.git
cd developer-productivity-dashboard
```

### 2. Configure Backend Environment
```bash
cd backend
cp .env.example .env
npm install
```

Configure `.env` with your credentials:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5"
DIRECT_URL="postgresql://postgres:password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="super-secret-developer-jwt-key-2026"
JWT_EXPIRES_IN="7d"

# Groq Cloud API Key (Free from https://console.groq.com/keys)
GROQ_API_KEY="gsk_your_groq_api_key_here"
```

### 3. Run Database Migrations & Seed
```bash
npm run db:push
npm run db:seed
```

### 4. Start Backend Server
```bash
npm run dev
# Running at http://localhost:5000
```

### 5. Start Frontend Dashboard
```bash
# Open a new terminal in the root directory
npm install
npm run dev
# Running at http://localhost:3000
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server & Database Health Check |
| `POST` | `/api/v1/auth/signup` | Register new engineer account & return JWT |
| `POST` | `/api/v1/auth/login` | Authenticate with email/password & return JWT |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/v1/users` | List all team directory developers |
| `GET` | `/api/v1/projects` | List projects (with search & status filter) |
| `POST` | `/api/v1/projects` | Create new engineering project |
| `PATCH` | `/api/v1/projects/:id` | Update project roadmap, status, or lead |
| `DELETE` | `/api/v1/projects/:id` | Delete project & cascade tasks |
| `GET` | `/api/v1/tasks` | List sprint tasks (filtered by project/priority/status) |
| `POST` | `/api/v1/tasks` | Create new sprint task with subtasks |
| `PATCH` | `/api/v1/tasks/:id` | Edit task details & subtasks |
| `PATCH` | `/api/v1/tasks/:id/status` | Update task status (backlog/in_progress/completed) |
| `DELETE` | `/api/v1/tasks/:id` | Remove task from sprint |
| `POST` | `/api/v1/ai/generate-task` | **AI:** Generate task & subtasks from prompt (Groq LPU) |
| `POST` | `/api/v1/ai/generate-roadmap` | **AI:** Synthesize project roadmap & tech stack |
| `POST` | `/api/v1/ai/standup-summary` | **AI:** Generate Daily Standup report with Slack copy |
| `GET` | `/api/v1/analytics/overview` | Aggregated sprint KPIs & weekly productivity |
| `GET` | `/api/v1/activities` | Live engineering activity telemetry stream |

---

## 🧪 Running Automated Tests

```bash
cd backend
npm test
```

---

## 📝 License
This project is licensed under the MIT License - built for the Innovation Hacks Internship Program.
