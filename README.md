# Developer Productivity Dashboard

A modern, responsive frontend dashboard designed for engineering teams to monitor developer productivity, track sprint tasks, manage project roadmaps, and maintain deep focus sessions.

---

## 📌 Features

- **Dashboard Overview & Metrics**: Real-time KPI summary cards tracking Focus Score, Sprint Velocity, Active Pull Requests, and Logged Focus Hours with trend indicators.
- **Weekly Productivity Velocity Chart**: Interactive pure CSS/Tailwind bar chart visualizing daily focus time and Git commit cadence with day-by-day tooltips.
- **Deep Work / Pomodoro Companion Timer**: Interactive 25-minute focus sprints and 5-minute break cycles with session streak tracking.
- **Project Hub**: Comprehensive project cards displaying health status badges (*On Track*, *At Risk*, *Delayed*, *Completed*), progress bars, repository details, contributor avatar stacks, and interactive project detail modals.
- **Sprint Task Board**:
  - Task cards with priority badges (Urgent, High, Medium, Low).
  - Inline status selector dropdown (*Backlog*, *In Progress*, *In Review*, *Completed*).
  - Interactive subtask checklists with live progress calculation.
  - Due date warnings, logged vs. estimated hours, branch references, and PR badges.
- **Search & Multi-Parameter Filter UI**: Instant filtering across tasks and projects by search query, project key, priority, and status, with clear/reset actions.
- **Interactive Modals**: Dialogs for creating new tasks and viewing detailed project roadmaps.
- **Engineering Activity Feed**: Chronological telemetry stream of Git commits, PR reviews, staging deployments, and task completions.
- **State Handling**: Accessible skeleton loaders for simulated loading states and user-friendly zero-result empty states.
- **Responsive Layout**: Fluid experience optimized for desktop, tablet, and mobile with a slide-out drawer navigation.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
developer-productivity-dashboard/
├── app/
│   ├── favicon.ico
│   ├── globals.css              # Custom styles, theme tokens, and scrollbars
│   ├── layout.tsx               # Root layout and metadata configuration
│   └── page.tsx                 # Main dashboard container and state coordinator
├── components/
│   ├── dashboard/
│   │   ├── ActivityFeed.tsx     # Live engineering activity stream
│   │   ├── FocusTimerCard.tsx   # Pomodoro focus session timer
│   │   ├── NewTaskModal.tsx     # New sprint task modal dialog
│   │   ├── OverviewMetrics.tsx  # KPI productivity metrics cards
│   │   ├── ProductivityChart.tsx# Weekly velocity visualization chart
│   │   ├── ProjectCard.tsx      # Project roadmap card
│   │   ├── ProjectDetailModal.tsx # Project overview modal dialog
│   │   ├── ProjectList.tsx      # Project grid with skeleton and empty states
│   │   ├── TaskCard.tsx         # Task card with status dropdown & subtasks
│   │   ├── TaskFilterBar.tsx    # Search and multi-parameter filter controls
│   │   └── TaskList.tsx         # Filterable task grid with status tabs
│   ├── layout/
│   │   ├── Header.tsx           # Global search, notifications, and actions
│   │   ├── MobileNav.tsx        # Mobile slide-out drawer navigation
│   │   ├── Sidebar.tsx          # Desktop sidebar navigation and sprint stats
│   │   └── UserProfileMenu.tsx  # Profile dropdown with status switcher
│   └── ui/
│       ├── Avatar.tsx           # User avatar and avatar group components
│       ├── Badge.tsx            # Multi-variant status and priority chips
│       ├── Button.tsx           # Reusable button component
│       ├── EmptyState.tsx       # Zero-result fallback display
│       ├── Modal.tsx            # Accessible modal dialog primitive
│       ├── ProgressBar.tsx      # Multi-variant progress indicator
│       └── SkeletonLoader.tsx   # Placeholder skeleton loading components
├── lib/
│   ├── mock-data.ts             # Developer productivity datasets
│   └── utils.ts                 # Formatting utilities and style helpers
├── types/
│   └── index.ts                 # TypeScript type definitions
├── public/                      # Static assets
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

---

## ⚙️ Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.18.0 or higher recommended)
- [npm](https://www.npmjs.com/) (or yarn / pnpm / bun)

### Steps

1. **Clone the repository**:
   ```bash
   git clone <REPOSITORY_URL>
   cd developer-productivity-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## 🚀 How to Run Locally

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Run Linter
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

---

## 📸 Screenshots

<!-- Add your screenshots here by replacing the placeholders below -->

### Dashboard Overview
![Dashboard Overview Placeholder](public/screenshots/overview.png)
*(Replace with screenshot: Overview tab displaying KPI metrics, weekly chart, and active projects)*

### Task Board & Filter UI
![Task Board Placeholder](public/screenshots/tasks.png)
*(Replace with screenshot: Task board with search filters and status tabs)*

### Mobile Responsive View
![Mobile Responsive Placeholder](public/screenshots/mobile.png)
*(Replace with screenshot: Mobile navigation drawer and responsive layout)*

---

## 🎥 Demo Video

<!-- Add your demo video link or embed below -->

[![Demo Video](https://img.shields.io/badge/Demo-Watch%20Video-blue?style=for-the-badge&logo=youtube)](https://example.com/demo-video-link)
*(Replace link above with your demonstration recording URL)*

---

## 🔐 Environment Variables

No environment variables are required for this frontend demonstration phase as all data is currently loaded via local typed mock data.

For future backend/database integration, create a `.env.local` file based on:
```env
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
# DATABASE_URL=postgresql://user:password@localhost:5432/productivity_db
# NEXTAUTH_SECRET=your_auth_secret
```

---

## 🔮 Future Scope

- **Backend & Database Integration**: Connect to a Node.js/Go backend with PostgreSQL / Prisma ORM for persistent task and project management.
- **Git Provider Integrations**: Webhooks for GitHub / GitLab to automatically update PR statuses, track commit telemetry, and calculate lead time to deploy.
- **Authentication & RBAC**: User authentication via NextAuth / Clerk with role-based permissions (Developer, Tech Lead, Engineering Manager).
- **AI-Powered Workload & Focus Insights**: Automated daily sprint summaries, blocker detection, and focus recommendations.
- **Real-Time Collaboration**: WebSocket integration for live status updates and real-time team pairing boards.
