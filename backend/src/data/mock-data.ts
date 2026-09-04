import {
  User,
  Project,
  Task,
  ProductivityMetric,
  DailyProductivity,
  ActivityItem,
} from '../types/index.js';

export const INITIAL_USERS: User[] = [
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
    status: 'away',
    statusMessage: 'In team planning meeting',
    weeklyFocusGoalHours: 28,
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-dpd',
    name: 'Developer Productivity Dashboard Platform',
    key: 'DPD',
    description: 'Modern developer productivity hub tracking weekly focus hours, sprint velocity, task boards, and telemetry.',
    status: 'on_track',
    progress: 82,
    totalTasks: 24,
    completedTasks: 19,
    deadline: '2026-03-31',
    repository: 'https://github.com/prajapati-pankaj-31/developer-productivity-dashboard',
    techStack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Zod'],
    lead: INITIAL_USERS[0],
    members: [INITIAL_USERS[0], INITIAL_USERS[1], INITIAL_USERS[2]],
    color: '#6366f1',
  },
  {
    id: 'proj-saq',
    name: 'Smart Appointment / Queue Management System',
    key: 'SAQ',
    description: 'Real-time multi-counter appointment scheduling, digital queue tokens, and live wait-time forecasting engine.',
    status: 'on_track',
    progress: 90,
    totalTasks: 32,
    completedTasks: 28,
    deadline: '2026-04-15',
    repository: 'https://github.com/prajapati-pankaj-31/smart-appointment-queue',
    techStack: ['React', 'TypeScript', 'FastAPI', 'Redis', 'WebSockets', 'PostgreSQL'],
    lead: INITIAL_USERS[0],
    members: [INITIAL_USERS[0], INITIAL_USERS[3], INITIAL_USERS[4]],
    color: '#06b6d4',
  },
  {
    id: 'proj-qfs',
    name: 'QR-Based File Sharing System',
    key: 'QFS',
    description: 'Secure, peer-to-peer ephemeral file transfer pipeline with end-to-end encryption and dynamic QR verification.',
    status: 'on_track',
    progress: 95,
    totalTasks: 18,
    completedTasks: 17,
    deadline: '2026-03-20',
    repository: 'https://github.com/prajapati-pankaj-31/qr-file-sharing',
    techStack: ['WebRTC', 'Next.js', 'Node.js', 'Crypto', 'Tailwind CSS'],
    lead: INITIAL_USERS[0],
    members: [INITIAL_USERS[0], INITIAL_USERS[2]],
    color: '#10b981',
  },
  {
    id: 'proj-tfd',
    name: 'Tomoto – Food Delivery System',
    key: 'TFD',
    description: 'Hyperlocal culinary delivery aggregator with real-time GPS rider telemetry, menu management, and checkout.',
    status: 'at_risk',
    progress: 68,
    totalTasks: 44,
    completedTasks: 30,
    deadline: '2026-05-01',
    repository: 'https://github.com/prajapati-pankaj-31/tomoto-food-delivery',
    techStack: ['React Native', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Socket.io'],
    lead: INITIAL_USERS[0],
    members: [INITIAL_USERS[0], INITIAL_USERS[1], INITIAL_USERS[4]],
    color: '#f43f5e',
  },
  {
    id: 'proj-k8s',
    name: 'Cloud Native Kubernetes Platform',
    key: 'K8S',
    description: 'Multi-cluster orchestration mesh with zero-trust networking, automated canary rollouts, and GitOps pipelines.',
    status: 'on_track',
    progress: 74,
    totalTasks: 28,
    completedTasks: 21,
    deadline: '2026-04-30',
    repository: 'https://github.com/prajapati-pankaj-31/k8s-platform-infra',
    techStack: ['Kubernetes', 'Helm', 'Terraform', 'ArgoCD', 'Istio', 'Prometheus'],
    lead: INITIAL_USERS[3],
    members: [INITIAL_USERS[3], INITIAL_USERS[0], INITIAL_USERS[4]],
    color: '#8b5cf6',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Implement dynamic queue token allocation algorithm',
    description: 'Build thread-safe round-robin counter balancing logic with estimated wait time prediction.',
    projectId: 'proj-saq',
    projectName: 'Smart Appointment / Queue Management System',
    priority: 'urgent',
    status: 'in_progress',
    assignee: INITIAL_USERS[0],
    dueDate: '2026-03-08',
    estimatedHours: 8,
    loggedHours: 5.5,
    subtasks: [
      { id: 'sub-1', title: 'Write token state transition machine', completed: true },
      { id: 'sub-2', title: 'Implement Redis distributed lock for counter claims', completed: true },
      { id: 'sub-3', title: 'Add WebSocket broadcast for token screen updates', completed: false },
    ],
    tags: ['Backend', 'Algorithm', 'Real-time'],
    branchName: 'feature/saq-token-engine',
    prNumber: 42,
    createdAt: '2026-02-28',
  },
  {
    id: 'task-2',
    title: 'Architect WebRTC signaling channel with QR payload verification',
    description: 'Establish direct browser-to-browser data channel exchange verified via encrypted one-time QR tokens.',
    projectId: 'proj-qfs',
    projectName: 'QR-Based File Sharing System',
    priority: 'high',
    status: 'in_review',
    assignee: INITIAL_USERS[0],
    dueDate: '2026-03-10',
    estimatedHours: 6,
    loggedHours: 6.0,
    subtasks: [
      { id: 'sub-4', title: 'Generate ephemeral AES-GCM session keys', completed: true },
      { id: 'sub-5', title: 'Implement chunked binary stream sender', completed: true },
      { id: 'sub-6', title: 'Add transfer progress bar & checksum verification', completed: true },
    ],
    tags: ['Security', 'P2P', 'WebRTC'],
    branchName: 'feature/qfs-webrtc-signaling',
    prNumber: 19,
    createdAt: '2026-03-01',
  },
  {
    id: 'task-3',
    title: 'Build Users, Projects & Tasks REST API with Zod validation',
    description: 'Implement Express TypeScript backend architecture with centralized error handling and filtering.',
    projectId: 'proj-dpd',
    projectName: 'Developer Productivity Dashboard Platform',
    priority: 'urgent',
    status: 'in_progress',
    assignee: INITIAL_USERS[0],
    dueDate: '2026-03-06',
    estimatedHours: 10,
    loggedHours: 4.5,
    subtasks: [
      { id: 'sub-7', title: 'Define data models & Zod schemas', completed: true },
      { id: 'sub-8', title: 'Build controllers, routes & middleware', completed: true },
      { id: 'sub-9', title: 'Add Postman collection & automated test suite', completed: false },
    ],
    tags: ['Backend', 'Express', 'TypeScript', 'REST API'],
    branchName: 'feature/dpd-task2-rest-api',
    prNumber: 14,
    createdAt: '2026-03-02',
  },
  {
    id: 'task-4',
    title: 'Optimize rider geospatial proximity query index in Redis',
    description: 'Reduce geospatial dispatch latency for nearby delivery partners under peak load conditions.',
    projectId: 'proj-tfd',
    projectName: 'Tomoto – Food Delivery System',
    priority: 'high',
    status: 'backlog',
    assignee: INITIAL_USERS[4],
    dueDate: '2026-03-15',
    estimatedHours: 6,
    loggedHours: 0,
    subtasks: [
      { id: 'sub-10', title: 'Benchmark GEOSEARCH vs GEORADIUS', completed: false },
      { id: 'sub-11', title: 'Implement dynamic delivery radius expansion', completed: false },
    ],
    tags: ['Database', 'Geospatial', 'Performance'],
    branchName: 'feature/tfd-geo-indexer',
    createdAt: '2026-03-01',
  },
  {
    id: 'task-5',
    title: 'Implement Canary rollout metrics analysis via Prometheus rules',
    description: 'Configure automated Prometheus queries evaluating error rate thresholds before promoting traffic.',
    projectId: 'proj-k8s',
    projectName: 'Cloud Native Kubernetes Platform',
    priority: 'medium',
    status: 'completed',
    assignee: INITIAL_USERS[3],
    dueDate: '2026-03-02',
    estimatedHours: 8,
    loggedHours: 7.5,
    subtasks: [
      { id: 'sub-12', title: 'Define PrometheusRule CRD manifests', completed: true },
      { id: 'sub-13', title: 'Simulate synthetic traffic error spikes in staging', completed: true },
      { id: 'sub-14', title: 'Validate automatic rollback hook triggering', completed: true },
    ],
    tags: ['DevOps', 'Kubernetes', 'Prometheus'],
    branchName: 'feature/k8s-canary-prom-rules',
    prNumber: 88,
    createdAt: '2026-02-25',
  },
];

export const INITIAL_METRICS: ProductivityMetric[] = [
  {
    id: 'met-1',
    label: 'Focus Score',
    value: '91%',
    changePercent: 6.4,
    trend: 'up',
    description: 'Deep uninterrupted focus time vs total logged',
    iconName: 'Zap',
  },
  {
    id: 'met-2',
    label: 'Sprint Velocity',
    value: '38 pts',
    unit: '/ 42 pts',
    changePercent: 12.5,
    trend: 'up',
    description: 'Story points delivered in current sprint cycle',
    iconName: 'Flame',
  },
  {
    id: 'met-3',
    label: 'Active Code Reviews',
    value: '4 PRs',
    unit: '2 pending',
    changePercent: -15.0,
    trend: 'down',
    description: 'Average turnaround review time: 1.8 hrs',
    iconName: 'GitPullRequest',
  },
  {
    id: 'met-4',
    label: 'Focus Hours Logged',
    value: '31.5h',
    unit: '/ 35h goal',
    changePercent: 4.8,
    trend: 'up',
    description: '90% of weekly deep work target reached',
    iconName: 'Clock',
  },
];

export const INITIAL_WEEKLY_DATA: DailyProductivity[] = [
  { day: 'Monday', shortDay: 'Mon', focusHours: 6.8, commitCount: 9, pullRequestsCount: 2, tasksCompleted: 4 },
  { day: 'Tuesday', shortDay: 'Tue', focusHours: 7.4, commitCount: 14, pullRequestsCount: 4, tasksCompleted: 6 },
  { day: 'Wednesday', shortDay: 'Wed', focusHours: 5.9, commitCount: 8, pullRequestsCount: 3, tasksCompleted: 3 },
  { day: 'Thursday', shortDay: 'Thu', focusHours: 7.8, commitCount: 16, pullRequestsCount: 5, tasksCompleted: 7, isToday: true },
  { day: 'Friday', shortDay: 'Fri', focusHours: 3.6, commitCount: 4, pullRequestsCount: 1, tasksCompleted: 2 },
  { day: 'Saturday', shortDay: 'Sat', focusHours: 0, commitCount: 0, pullRequestsCount: 0, tasksCompleted: 0 },
  { day: 'Sunday', shortDay: 'Sun', focusHours: 0, commitCount: 0, pullRequestsCount: 0, tasksCompleted: 0 },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'commit',
    title: 'Pushed 3 commits to fix/slot-overlap-validation',
    description: 'Added slot collision verification and dynamic consultation buffer handling.',
    timestamp: '2026-08-29T14:30:00Z',
    user: INITIAL_USERS[0],
    projectKey: 'SAQ',
    badgeText: '3 commits',
  },
  {
    id: 'act-2',
    type: 'task_completed',
    title: 'Completed task #207: Responsive developer dashboard UI',
    description: 'Verified focus timer, weekly productivity chart, and task filtering.',
    timestamp: '2026-08-29T11:15:00Z',
    user: INITIAL_USERS[0],
    projectKey: 'DPD',
    badgeText: 'Completed',
  },
  {
    id: 'act-3',
    type: 'pr_merged',
    title: 'Merged PR #42: Dynamic QR code generator workflow',
    description: 'Validated SVG QR rendering and instant mobile file handoff tokens.',
    timestamp: '2026-08-28T22:00:00Z',
    user: INITIAL_USERS[0],
    projectKey: 'QFS',
    badgeText: 'Merged',
  },
  {
    id: 'act-4',
    type: 'pr_review',
    title: 'Reviewed and approved PR #118',
    description: 'Tailwind CSS v4 design token migration looks crisp and passes visual contrast checks.',
    timestamp: '2026-08-28T18:15:00Z',
    user: INITIAL_USERS[1],
    projectKey: 'DSK',
    badgeText: 'Approved',
  },
  {
    id: 'act-5',
    type: 'commit',
    title: 'Pushed 2 commits to feat/menu-browsing-filters',
    description: 'Added dietary preference filter tags and cart total recalculation.',
    timestamp: '2026-08-27T16:45:00Z',
    user: INITIAL_USERS[0],
    projectKey: 'TFD',
    badgeText: '2 commits',
  },
  {
    id: 'act-6',
    type: 'deployment',
    title: 'Deployed staging build v2.4.1',
    description: 'Autoscaler pod monitor successfully provisioned in us-east-1 cluster.',
    timestamp: '2026-08-26T20:30:00Z',
    user: INITIAL_USERS[3],
    projectKey: 'K8S',
    badgeText: 'Staging OK',
  },
];

// In-Memory Database Stores (supports live runtime CRUD mutations)
export class InMemoryStore {
  private users: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));
  private projects: Project[] = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
  private tasks: Task[] = JSON.parse(JSON.stringify(INITIAL_TASKS));
  private metrics: ProductivityMetric[] = JSON.parse(JSON.stringify(INITIAL_METRICS));
  private weeklyData: DailyProductivity[] = JSON.parse(JSON.stringify(INITIAL_WEEKLY_DATA));
  private activities: ActivityItem[] = JSON.parse(JSON.stringify(INITIAL_ACTIVITIES));

  public reset(): void {
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.projects = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
    this.tasks = JSON.parse(JSON.stringify(INITIAL_TASKS));
    this.metrics = JSON.parse(JSON.stringify(INITIAL_METRICS));
    this.weeklyData = JSON.parse(JSON.stringify(INITIAL_WEEKLY_DATA));
    this.activities = JSON.parse(JSON.stringify(INITIAL_ACTIVITIES));
  }

  // Users
  public getUsers(): User[] {
    return [...this.users];
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public addUser(user: User): User {
    this.users.push(user);
    return user;
  }

  public updateUser(id: string, updated: Partial<User>): User | undefined {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...updated };
    return this.users[index];
  }

  public deleteUser(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  // Projects
  public getProjects(): Project[] {
    return [...this.projects];
  }

  public getProjectById(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  public addProject(project: Project): Project {
    this.projects.push(project);
    return project;
  }

  public updateProject(id: string, updated: Partial<Project>): Project | undefined {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    this.projects[index] = { ...this.projects[index], ...updated };
    return this.projects[index];
  }

  public deleteProject(id: string): boolean {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.projects.splice(index, 1);
    return true;
  }

  // Tasks
  public getTasks(): Task[] {
    return [...this.tasks];
  }

  public getTaskById(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  public addTask(task: Task): Task {
    this.tasks.push(task);
    return task;
  }

  public updateTask(id: string, updated: Partial<Task>): Task | undefined {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    this.tasks[index] = { ...this.tasks[index], ...updated };
    return this.tasks[index];
  }

  public deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  // Metrics & Analytics
  public getMetrics(): ProductivityMetric[] {
    return [...this.metrics];
  }

  public getWeeklyData(): DailyProductivity[] {
    return [...this.weeklyData];
  }

  // Activity Log
  public getActivities(): ActivityItem[] {
    return [...this.activities];
  }

  public addActivity(activity: ActivityItem): ActivityItem {
    this.activities.unshift(activity);
    return activity;
  }
}

export const db = new InMemoryStore();
