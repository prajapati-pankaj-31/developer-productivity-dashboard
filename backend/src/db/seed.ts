import { prisma } from './prisma.js';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/password.js';

const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Pankaj Prajapati',
    email: 'pankaj.prajapati@devhub.io',
    role: 'AI & Full Stack Developer',
    avatarUrl: '/pankaj.jpg',
    initials: 'PP',
    status: 'flow',
    statusMessage: 'Deep work on Developer Productivity Dashboard & REST API',
    weeklyFocusGoalHours: 35,
  },
  {
    id: 'usr-2',
    name: 'Elena Rostova',
    email: 'elena.r@devhub.io',
    role: 'Tech Lead / Architect',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    initials: 'ER',
    status: 'in_review',
    statusMessage: 'Reviewing sprint PRs',
    weeklyFocusGoalHours: 30,
  },
  {
    id: 'usr-3',
    name: 'Marcus Chen',
    email: 'marcus.c@devhub.io',
    role: 'Frontend Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initials: 'MC',
    status: 'available',
    statusMessage: 'Refactoring design system tokens',
    weeklyFocusGoalHours: 32,
  },
  {
    id: 'usr-4',
    name: 'Sarah Jenkins',
    email: 'sarah.j@devhub.io',
    role: 'DevOps Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    initials: 'SJ',
    status: 'flow',
    statusMessage: 'Kubernetes autoscaling rollout',
    weeklyFocusGoalHours: 35,
  },
  {
    id: 'usr-5',
    name: 'David Kim',
    email: 'david.k@devhub.io',
    role: 'Backend Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initials: 'DK',
    status: 'available',
    statusMessage: 'API Gateway refactoring',
    weeklyFocusGoalHours: 30,
  },
];

const INITIAL_PROJECTS = [
  {
    id: 'proj-dpd',
    name: 'Developer Productivity Dashboard Platform',
    key: 'DPD',
    description: 'Modern developer productivity hub tracking weekly focus hours, sprint velocity, task boards, and telemetry.',
    status: 'on_track',
    progress: 82,
    deadline: '2026-03-30',
    repository: 'github.com/devhub/productivity-dashboard',
    techStack: JSON.stringify(['Next.js', 'React 19', 'Express.js', 'TypeScript', 'Prisma', 'Tailwind CSS']),
    leadId: 'usr-1',
    color: 'indigo',
    memberIds: ['usr-1', 'usr-2', 'usr-3', 'usr-4'],
  },
  {
    id: 'proj-ai-agent',
    name: 'Autonomous Code Review Assistant',
    key: 'ACR',
    description: 'LLM-powered code review pipeline analyzing AST diffs, cognitive complexity, security risks, and PR summaries.',
    status: 'on_track',
    progress: 68,
    deadline: '2026-04-15',
    repository: 'github.com/devhub/code-review-agent',
    techStack: JSON.stringify(['Python', 'LangChain', 'FastAPI', 'PostgreSQL', 'Docker']),
    leadId: 'usr-2',
    color: 'emerald',
    memberIds: ['usr-2', 'usr-1', 'usr-5'],
  },
  {
    id: 'proj-cloud-infra',
    name: 'Zero-Trust Telemetry Infrastructure',
    key: 'ZTT',
    description: 'Distributed tracing, telemetry pipelines, and observability dashboards with OpenTelemetry & Prometheus.',
    status: 'at_risk',
    progress: 45,
    deadline: '2026-03-22',
    repository: 'github.com/devhub/telemetry-infra',
    techStack: JSON.stringify(['Go', 'Kubernetes', 'Prometheus', 'Grafana', 'Terraform']),
    leadId: 'usr-4',
    color: 'rose',
    memberIds: ['usr-4', 'usr-5'],
  },
  {
    id: 'proj-design-sys',
    name: 'Futuristic Glass UI Component Library',
    key: 'GLS',
    description: 'Accessible, dark-first UI component system with glassmorphism, micro-interactions, and high contrast modes.',
    status: 'completed',
    progress: 100,
    deadline: '2026-02-28',
    repository: 'github.com/devhub/glass-ui',
    techStack: JSON.stringify(['React', 'Tailwind CSS', 'Storybook', 'Framer Motion']),
    leadId: 'usr-3',
    color: 'cyan',
    memberIds: ['usr-3', 'usr-1'],
  },
];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Design interactive Sprint Kanban board with drag physics',
    description: 'Create responsive, smooth drag-and-drop task workflow columns with real-time status updates.',
    projectId: 'proj-dpd',
    priority: 'high',
    status: 'in_progress',
    assigneeId: 'usr-1',
    dueDate: '2026-03-05',
    estimatedHours: 8,
    loggedHours: 5.5,
    tags: JSON.stringify(['Frontend', 'UI/UX', 'Sprint 24']),
    branchName: 'feat/sprint-kanban-board',
    prNumber: 42,
    subtasks: [
      { id: 'sub-1', title: 'Layout columns & badge styling', completed: true },
      { id: 'sub-2', title: 'Implement status transition dispatch', completed: true },
      { id: 'sub-3', title: 'Keyboard navigation and accessibility', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: 'Build Users, Projects & Tasks REST API with Zod validation',
    description: 'Implement Express TypeScript backend architecture with centralized error handling and filtering.',
    projectId: 'proj-dpd',
    priority: 'urgent',
    status: 'in_progress',
    assigneeId: 'usr-1',
    dueDate: '2026-03-06',
    estimatedHours: 10,
    loggedHours: 8,
    tags: JSON.stringify(['Backend', 'API', 'TypeScript']),
    branchName: 'feat/rest-api-layer',
    prNumber: 43,
    subtasks: [
      { id: 'sub-4', title: 'User CRUD endpoints', completed: true },
      { id: 'sub-5', title: 'Project filtering & relation queries', completed: true },
      { id: 'sub-6', title: 'Zod validation middlewares', completed: true },
      { id: 'sub-7', title: 'Comprehensive automated test suites', completed: true },
    ],
  },
  {
    id: 'task-3',
    title: 'Configure automated AST complexity analyzer agent',
    description: 'Hook LangChain workflow with GitHub webhooks to calculate cyclomatic complexity on incoming pull requests.',
    projectId: 'proj-ai-agent',
    priority: 'high',
    status: 'in_progress',
    assigneeId: 'usr-2',
    dueDate: '2026-03-10',
    estimatedHours: 14,
    loggedHours: 9,
    tags: JSON.stringify(['AI', 'LangChain', 'Python']),
    branchName: 'agent/ast-complexity-pipeline',
    prNumber: 18,
    subtasks: [
      { id: 'sub-8', title: 'AST tree parser module', completed: true },
      { id: 'sub-9', title: 'Prompt engineering for suggestions', completed: true },
      { id: 'sub-10', title: 'GitHub PR comment automation', completed: false },
    ],
  },
  {
    id: 'task-4',
    title: 'Setup Distributed OpenTelemetry collector on Kubernetes',
    description: 'Deploy collector daemonsets and configure Jaeger tracing for all microservice HTTP calls.',
    projectId: 'proj-cloud-infra',
    priority: 'urgent',
    status: 'backlog',
    assigneeId: 'usr-4',
    dueDate: '2026-03-12',
    estimatedHours: 12,
    loggedHours: 2,
    tags: JSON.stringify(['DevOps', 'K8s', 'Observability']),
    subtasks: [
      { id: 'sub-11', title: 'Helm chart configuration', completed: true },
      { id: 'sub-12', title: 'Collector DaemonSet rollout', completed: false },
      { id: 'sub-13', title: 'Jaeger backend integration', completed: false },
    ],
  },
  {
    id: 'task-5',
    title: 'Publish Glass UI button and badge design primitives',
    description: 'Create production-ready Figma tokens and TypeScript Tailwind plugin for dark glassmorphism effects.',
    projectId: 'proj-design-sys',
    priority: 'low',
    status: 'completed',
    assigneeId: 'usr-3',
    dueDate: '2026-02-25',
    estimatedHours: 6,
    loggedHours: 6,
    tags: JSON.stringify(['Design System', 'UI', 'Components']),
    branchName: 'release/v1-glass-primitives',
    prNumber: 9,
    subtasks: [
      { id: 'sub-14', title: 'Token specification & contrast checks', completed: true },
      { id: 'sub-15', title: 'Storybook documentation tests', completed: true },
    ],
  },
  {
    id: 'task-6',
    title: 'Refactor focus companion timer with ambient soundscape',
    description: 'Add Web Audio API white noise generator and Pomodoro interval presets with local storage sync.',
    projectId: 'proj-dpd',
    priority: 'medium',
    status: 'completed',
    assigneeId: 'usr-1',
    dueDate: '2026-03-01',
    estimatedHours: 5,
    loggedHours: 4.5,
    tags: JSON.stringify(['Frontend', 'Audio', 'UX']),
    branchName: 'feat/focus-ambient-audio',
    prNumber: 41,
    subtasks: [
      { id: 'sub-16', title: 'Audio synthesis oscillator setup', completed: true },
      { id: 'sub-17', title: 'Session logging & focus score increment', completed: true },
    ],
  },
];

const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'commit',
    title: 'pushed 3 commits to feat/sprint-kanban-board',
    description: 'Added drag sensors, column indicators, and subtask completion badges.',
    timestamp: '12 minutes ago',
    userId: 'usr-1',
    projectKey: 'DPD',
    badgeText: 'feat',
  },
  {
    id: 'act-2',
    type: 'pr_merged',
    title: 'merged PR #41: feat/focus-ambient-audio',
    description: 'Added Web Audio API white noise synthesizer & Pomodoro timer intervals.',
    timestamp: '1 hour ago',
    userId: 'usr-1',
    projectKey: 'DPD',
    badgeText: 'PR #41',
  },
  {
    id: 'act-3',
    type: 'pr_review',
    title: 'approved PR #18: agent/ast-complexity-pipeline',
    description: 'Elena approved AST complexity metric calculations with minor doc notes.',
    timestamp: '2 hours ago',
    userId: 'usr-2',
    projectKey: 'ACR',
    badgeText: 'Review',
  },
  {
    id: 'act-4',
    type: 'deployment',
    title: 'deployed v1.2.4 to staging (us-east-1)',
    description: 'Kubernetes ingress controller updated with TLS 1.3 certificate rotation.',
    timestamp: '3 hours ago',
    userId: 'usr-4',
    projectKey: 'ZTT',
    badgeText: 'Deploy',
  },
  {
    id: 'act-5',
    type: 'task_completed',
    title: 'completed task "Publish Glass UI primitives"',
    description: 'Released npm package @devhub/glass-primitives v1.0.0.',
    timestamp: '5 hours ago',
    userId: 'usr-3',
    projectKey: 'GLS',
    badgeText: 'Done',
  },
];

const INITIAL_DAILY_PRODUCTIVITY = [
  { day: 'Monday', shortDay: 'Mon', focusHours: 6.2, commitCount: 7, pullRequestsCount: 2, tasksCompleted: 3 },
  { day: 'Tuesday', shortDay: 'Tue', focusHours: 7.5, commitCount: 11, pullRequestsCount: 3, tasksCompleted: 5 },
  { day: 'Wednesday', shortDay: 'Wed', focusHours: 5.8, commitCount: 6, pullRequestsCount: 1, tasksCompleted: 2 },
  { day: 'Thursday', shortDay: 'Thu', focusHours: 8.1, commitCount: 14, pullRequestsCount: 4, tasksCompleted: 6 },
  { day: 'Friday', shortDay: 'Fri', focusHours: 6.9, commitCount: 9, pullRequestsCount: 2, tasksCompleted: 4, isToday: true },
  { day: 'Saturday', shortDay: 'Sat', focusHours: 3.2, commitCount: 3, pullRequestsCount: 0, tasksCompleted: 1 },
  { day: 'Sunday', shortDay: 'Sun', focusHours: 1.5, commitCount: 1, pullRequestsCount: 0, tasksCompleted: 0 },
];

export async function seed(client: PrismaClient = prisma): Promise<void> {
  // Clean existing tables in reverse dependency order
  await client.activity.deleteMany({});
  await client.subtask.deleteMany({});
  await client.task.deleteMany({});
  await client.projectMember.deleteMany({});
  await client.project.deleteMany({});
  await client.user.deleteMany({});
  await client.dailyProductivity.deleteMany({});

  // 1. Seed Users
  const defaultPasswordHash = await hashPassword('DevPass123!');
  for (const user of INITIAL_USERS) {
    await client.user.create({
      data: {
        ...user,
        passwordHash: defaultPasswordHash,
      },
    });
  }

  // 2. Seed Projects & Project Members
  for (const proj of INITIAL_PROJECTS) {
    const { memberIds, ...projectData } = proj;
    await client.project.create({
      data: {
        ...projectData,
        members: {
          create: memberIds.map((memberId) => ({
            userId: memberId,
            role: memberId === proj.leadId ? 'lead' : 'developer',
          })),
        },
      },
    });
  }

  // 3. Seed Tasks & Subtasks
  for (const task of INITIAL_TASKS) {
    const { subtasks, ...taskData } = task;
    await client.task.create({
      data: {
        ...taskData,
        subtasks: {
          create: subtasks.map((sub) => ({
            id: sub.id,
            title: sub.title,
            completed: sub.completed,
          })),
        },
      },
    });
  }

  // 4. Seed Activities
  for (const act of INITIAL_ACTIVITIES) {
    await client.activity.create({ data: act });
  }

  // 5. Seed Daily Productivity metrics
  for (const daily of INITIAL_DAILY_PRODUCTIVITY) {
    await client.dailyProductivity.create({ data: daily });
  }
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].includes('seed')) {
  seed()
    .then(() => {
      console.log('✅ [Database Seed] Seeding completed successfully!');
    })
    .catch((e) => {
      console.error('❌ [Database Seed] Failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
