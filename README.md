# ⚡ DevHub — Developer Productivity Dashboard

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com/)
[![Groq LPU](https://img.shields.io/badge/Groq_AI-Llama_3.3_70B-F55036?style=for-the-badge&logo=fastapi&logoColor=white)](https://groq.com/)
[![Tests](https://img.shields.io/badge/Tests-41%20Passing-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>An enterprise-grade, AI-accelerated developer productivity cockpit and sprint intelligence system.</strong><br>
  Built as an end-to-end evolutionary submission for the <strong>Innovation Hacks Full Stack Developer Internship</strong>.
</p>

[✨ Live Features](#-key-features--capabilities) • [🏛️ Architecture](#-system-architecture) • [📈 Evolution Milestones](#-evolutionary-milestones--task-evaluation) • [📡 API Reference](#-rest-api-specifications) • [🚀 Quick Start](#-getting-started--local-development) • [🧪 Testing](#-automated-testing--quality-assurance)

</div>

---

## 📖 Executive Summary

**DevHub** bridges modern engineering telemetry, sprint project management, and cutting-edge Large Language Model acceleration into a unified developer workspace. It empowers engineering teams to eliminate cognitive overhead, automate tedious sprint ceremonies (like daily standups and ticket decomposition), track deep-work velocity, and manage multi-tier projects in real time.

Built using a scalable, decoupled full-stack architecture (**Next.js 16 App Router** on the frontend, **Express + TypeScript + Zod** on the backend, **Prisma ORM on Supabase PostgreSQL** for persistence, and **Groq LPU Cloud** for sub-second AI inference).

---

## 📈 Evolutionary Milestones & Task Evaluation

DevHub was systematically architected through 4 core evolutionary engineering phases:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DEVHUB EVOLUTIONARY TIMELINE                                    │
├─────────────────┬──────────────────┬─────────────────────────────┬──────────────────────────────┤
│  Task 1 (UI/UX) │  Task 2 (API)    │  Task 3 (Data & Auth)       │  Task 4 (AI Intelligence)    │
├─────────────────┼──────────────────┼─────────────────────────────┼──────────────────────────────┤
│ • Glassmorphism │ • Layered REST   │ • Supabase PostgreSQL       │ • Groq LPU Llama 3.3 70B     │
│ • Telemetry KPIs│ • Zod Validation │ • Prisma ORM & Connection   │ • AI Standup Generator       │
│ • Sprint Board  │ • Relational DB  │ • JWT Auth + Password Hash  │ • AI Sprint Task Breakdown   │
│ • Pomodoro Timer│ • 41 Test Suites │ • Dynamic Team Directory    │ • Architectural Roadmaps     │
│ • Cosmic FX     │ • Error Handler  │ • Auto Seeding & Studio     │ • 3-Tier Fallback Engine     │
└─────────────────┴──────────────────┴─────────────────────────────┴──────────────────────────────┘
```

### 🔹 Task 1: Interactive Frontend Architecture & Telemetry Cockpit
- **Next.js 16 + React 19 + Turbopack:** Blazing fast client-side rendering with granular layout composition.
- **Luminous Dark/Light Glassmorphic Design:** Custom HSL dark-indigo slate theme (`#0c1026`), subtle glowing borders, and particle constellation network backdrop.
- **Sprint Management Kanban Board:** Real-time search, multi-filter dropdowns (status, priority, project, assignee), instant inline status updating, and collapsible subtask checklists.
- **Deep Work Pomodoro Companion:** Customizable work/break intervals, visual radial countdown progress, audio chimes, and automatic focus session logging.
- **Responsive Layout & Keyboard Accelerators:** Global `⌘K` command search, keyboard shortcuts modal (`?`), collapsible sidebar, and mobile drawer navigation.

### 🔹 Task 2: Backend RESTful API & Domain Architecture
- **Layered Architecture:** Strict separation of concerns following **Controllers ➔ Services ➔ Validators ➔ Database Models**.
- **Zod Schema Engine:** Runtime type validation across all request params, queries, and mutation payloads with structured error reporting.
- **Relational Integrity Guards:** Prevents orphaned tasks; blocks deletion of users or projects with active assignments (`400 Bad Request`).
- **Standardized Response Protocol:** Unified API envelope (`{ success, data, count, error }`) with standardized HTTP status codes (`200`, `201`, `400`, `401`, `404`, `409`, `500`).
- **Comprehensive Integration Suite:** 41 automated test cases written with **Vitest & Supertest** covering all resource edge cases.

### 🔹 Task 3: Relational Persistence, ORM & Authentication
- **PostgreSQL Persistence with Prisma ORM:** Scalable cloud relational database hosted on **Supabase** with connection pooling and direct migration channels.
- **Secure Authentication System:** User signup and login with **bcryptjs** password salting/hashing and **JWT** bearer token session issuance.
- **Dynamic Team Directory & Self-Assignment:** Real-time database sync for engineering leads, team assignees, and intelligent self-assignment priority (`⭐ You`).
- **Database Tooling:** One-click seeding (`npm run db:seed`), automated schema push (`npm run db:push`), and visual database management via **Prisma Studio**.

### 🔹 Task 4: AI Intelligence Layer & Groq LLM Acceleration
- **Groq Cloud LPU Acceleration (`llama-3.3-70b-versatile`):** Ultra-fast sub-second LLM inference for real-time developer workflows.
- **Full-Page AI Workspace & Dedicated Assistant:** Dedicated interactive tabs for Chatbot Q&A, Daily Standup Synthesizer, Sprint Task Generator, and Architecture Planner.
- **Automated Daily Standup Generator:** One-click executive digest summarizing completed PRs, active tickets, and focus hours into *"Yesterday, Today, Blockers"* format with Slack/Teams export.
- **Smart Sprint Task Decomposition:** Generates structured titles, acceptance criteria, subtasks, estimated hours, and tags from natural language prompts.
- **Resilient 3-Tier Fallback Engine:** Graceful cascade from **Groq Cloud LPU** ➔ **Google Gemini API** ➔ **Deterministic Offline Heuristic Generator** for 100% uptime guarantee.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph Client ["Frontend Layer (Next.js 16 + React 19)"]
        UI[Glassmorphic UI & Telemetry Cockpit]
        Timer[Pomodoro Focus Companion]
        SprintBoard[Sprint Task & Kanban Board]
        AIWorkspace[AI Engineering Assistant View]
        APIClient[Axios/Fetch HTTP Client + JWT Token]
    end

    subgraph Backend ["Backend API Layer (Express.js + TypeScript)"]
        Router[Express API v1 Router]
        AuthMW[JWT Auth Middleware]
        ZodVal[Zod Validation Middleware]
        Controllers[Resource Controllers]
        Services[Business Logic Services]
        ErrorHandler[Centralized Error Handler]
    end

    subgraph Persistence ["Persistence Layer (Prisma ORM 6)"]
        Prisma[Prisma Client Pooler]
        Supabase[(Supabase PostgreSQL)]
    end

    subgraph AI ["AI Intelligence Layer"]
        Groq[Groq LPU Cloud - Llama 3.3 70B]
        Gemini[Google Gemini 2.5 Flash]
        Heuristic[Smart Offline Heuristic Engine]
    end

    UI --> APIClient
    Timer --> APIClient
    SprintBoard --> APIClient
    AIWorkspace --> APIClient

    APIClient -->|HTTP REST + Bearer JWT| Router
    Router --> AuthMW
    AuthMW --> ZodVal
    ZodVal --> Controllers
    Controllers --> Services
    Services --> ErrorHandler

    Services -->|ORM Queries| Prisma
    Prisma -->|Pooled Connection| Supabase

    Services -->|Inference Request| Groq
    Groq -.->|Fallback| Gemini
    Gemini -.->|Fallback| Heuristic
```

---

## 🗄️ Relational Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ TASK : "assigned_to"
    USER ||--o{ PROJECT : "leads"
    USER ||--o{ PROJECT_MEMBER : "member_of"
    USER ||--o{ ACTIVITY : "performs"
    
    PROJECT ||--o{ TASK : "contains"
    PROJECT ||--o{ PROJECT_MEMBER : "has_members"
    
    TASK ||--o{ SUBTASK : "composed_of"
    TASK ||--o{ ACTIVITY : "generates"

    USER {
        string id PK
        string email UK
        string password
        string name
        string role
        string status
        int weeklyFocusGoalHours
        datetime createdAt
    }

    PROJECT {
        string id PK
        string name
        string key UK
        string description
        string status
        int progress
        datetime deadline
        string repository
        string techStack
        string color
        string leadId FK
    }

    TASK {
        string id PK
        string title
        string description
        string status
        string priority
        int estimatedHours
        int loggedHours
        datetime dueDate
        string tags
        string projectId FK
        string assigneeId FK
    }

    SUBTASK {
        string id PK
        string title
        boolean completed
        string taskId FK
    }

    ACTIVITY {
        string id PK
        string user
        string action
        string target
        string type
        datetime timestamp
    }
```

---

## 🛠️ Technology Stack Matrix

| Category | Primary Technology | Version | Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** | `16.3.3` | Turbopack compilation, React Server Components, optimal performance |
| **UI Library** | **React** | `19.0.0` | Modern hook architecture, concurrent rendering |
| **Styling** | **Tailwind CSS** | `v4.0.0` | Design-token styling, responsive utilities, customized glassmorphism |
| **Icons & Visuals** | **Lucide React** | `^1.16.0` | Comprehensive, consistent SVG developer icon set |
| **Backend Framework** | **Express.js** | `4.21.2` | High-throughput, battle-tested RESTful HTTP web server |
| **Language** | **TypeScript** | `5.7.3` | End-to-end type safety, strict compile checks across frontend & backend |
| **Data Validation** | **Zod** | `3.24.2` | Schema-driven runtime validation for API contracts |
| **Database & ORM** | **Prisma ORM** | `6.4.1` | Type-safe query building, migrations, and schema introspections |
| **Cloud Database** | **PostgreSQL (Supabase)** | `15.x` | Enterprise cloud PostgreSQL with PgBouncer connection pooling |
| **AI Inference** | **Groq Cloud SDK** | `0.15.0` | Sub-second LPU accelerated inference running `llama-3.3-70b-versatile` |
| **Fallback AI** | **Google GenAI SDK** | `0.1.2` | Secondary LLM fallback provider for resilient uptime |
| **Testing** | **Vitest + Supertest** | `3.0.7` | Fast integration test runner for controllers and HTTP endpoints |
| **Security** | **Helmet + bcryptjs + JWT** | `latest` | Secure HTTP headers, salted password storage, JWT token authorization |

---

## 📡 REST API Specifications

The backend serves all endpoints under `/api/v1` with consistent JSON envelopes.

### Authentication & Users
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/signup` | Register a new engineer profile & return JWT | No |
| `POST` | `/api/v1/auth/login` | Authenticate credentials & return JWT | No |
| `GET` | `/api/v1/auth/me` | Fetch authenticated engineer profile | **Yes (Bearer)** |
| `GET` | `/api/v1/users` | List team directory members | No |
| `GET` | `/api/v1/users/:id` | Fetch specific user details | No |
| `POST` | `/api/v1/users` | Create user profile in directory | No |
| `PATCH` | `/api/v1/users/:id` | Update user status, role, or weekly goals | No |
| `DELETE` | `/api/v1/users/:id` | Remove user (guards against active tasks) | No |

### Projects
| Method | Route | Description | Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/projects` | List engineering projects | `status`, `search`, `page`, `limit` |
| `GET` | `/api/v1/projects/:id` | Fetch project details & task roadmap | — |
| `POST` | `/api/v1/projects` | Create new engineering project | — |
| `PATCH` | `/api/v1/projects/:id` | Update project health, roadmap, or lead | — |
| `DELETE` | `/api/v1/projects/:id` | Delete project (guards active tasks) | — |

### Sprint Tasks
| Method | Route | Description | Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tasks` | Query sprint tasks with multi-filtering | `status`, `priority`, `projectId`, `search` |
| `GET` | `/api/v1/tasks/:id` | Fetch task details and subtasks | — |
| `POST` | `/api/v1/tasks` | Create task with nested subtasks | — |
| `PATCH` | `/api/v1/tasks/:id` | Update task fields and subtasks | — |
| `PATCH` | `/api/v1/tasks/:id/status` | Dedicated task status transition | — |
| `PATCH` | `/api/v1/tasks/:id/subtasks/:subtaskId/toggle` | Toggle individual subtask completion | — |
| `DELETE` | `/api/v1/tasks/:id` | Remove task from sprint backlog | — |

### AI Intelligence Layer
| Method | Route | Description | Model Engine |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/ai/generate-task` | Decompose natural prompt into task & subtasks | Groq Llama 3.3 70B |
| `POST` | `/api/v1/ai/generate-roadmap` | Synthesize project milestones & tech stack | Groq Llama 3.3 70B |
| `POST` | `/api/v1/ai/standup-summary` | Generate Daily Standup report with Slack copy | Groq Llama 3.3 70B |

### Analytics & Engineering Telemetry
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/analytics/metrics` | 4 Core Productivity KPIs (Focus Score, Velocity, PRs) |
| `GET` | `/api/v1/analytics/weekly` | 7-day velocity chart aggregation |
| `GET` | `/api/v1/analytics/overview` | Aggregated sprint telemetry payload |
| `GET` | `/api/v1/activities` | Live engineering activity telemetry stream |
| `POST` | `/api/v1/activities` | Record custom telemetry event |

---

## 🚀 Getting Started & Local Development

Follow these steps to run both the frontend and backend locally in under 2 minutes.

### 📋 Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Git**

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/prajapati-pankaj-31/developer-productivity-dashboard.git
cd developer-productivity-dashboard
```

---

### 2️⃣ Configure & Start Backend

```bash
cd backend

# Install dependencies
npm install

# Create local environment config
cp .env.example .env
```

Configure `.env`:
```env
PORT=5000
NODE_ENV=development
API_PREFIX=/api/v1
FRONTEND_URL=http://localhost:3000

# Cloud PostgreSQL (Supabase / Neon) or SQLite fallback
DATABASE_URL="postgresql://postgres:password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5"
DIRECT_URL="postgresql://postgres:password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# JWT Authentication
JWT_SECRET="devhub-super-secret-jwt-key-2026"
JWT_EXPIRES_IN="7d"

# Groq LPU Cloud Acceleration
GROQ_API_KEY="gsk_your_groq_api_key_here"
```

Initialize and seed the database:
```bash
# Push schema to database
npm run db:push

# Seed database with sample users, projects, tasks, and telemetry
npm run db:seed

# Start backend dev server with hot reload
npm run dev
# 🚀 Backend running at http://localhost:5000
```

---

### 3️⃣ Configure & Start Frontend

Open a second terminal at the root directory:
```bash
# From repository root
npm install

# Start Next.js 16 development server
npm run dev
# 🚀 Frontend running at http://localhost:3000
```

---

## 🧪 Automated Testing & Quality Assurance

Run the automated integration test suite:

```bash
cd backend
npm test
```

---

## ⚖️ Engineering Decisions & Trade-Offs

| Decision | Chosen Architecture | Alternative Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **LLM Inference** | **Groq LPU (`llama-3.3-70b`)** | OpenAI GPT-4o / Local Ollama | Groq LPU delivers ~300 tokens/sec for real-time user UX with zero cold-start delay and generous free tier limits. |
| **ORM & DB** | **Prisma ORM + Supabase PostgreSQL** | TypeORM / Raw SQL | Prisma generates end-to-end TypeScript types and schema migrations, while Supabase provides enterprise PgBouncer connection pooling. |
| **Validation** | **Zod Schema Engine** | Joi / express-validator | Zod seamlessly infers TypeScript types directly from runtime schemas, eliminating duplicate interface definitions. |
| **State & Fetching** | **Hybrid Client Fetch + Local Storage** | Redux Toolkit | Lightweight footprint; instant UI reactivity with offline fallback capability. |

---

## 👨‍💻 Author & Project Context

- **Developer:** [Pankaj Prajapati](https://github.com/prajapati-pankaj-31)
- **Role:** Full Stack & AI Developer
- **Internship:** Innovation Hacks Full Stack Development Program
- **Submission:** Tasks 1, 2, 3, and 4 Comprehensive Full Stack Platform

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
