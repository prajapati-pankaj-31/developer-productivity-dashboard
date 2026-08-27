export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'completed';

export type ProjectStatus = 'on_track' | 'at_risk' | 'delayed' | 'completed';

export type TabType = 'overview' | 'projects' | 'tasks' | 'activity';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  initials: string;
  status: 'flow' | 'available' | 'in_review' | 'away';
  statusMessage?: string;
  weeklyFocusGoalHours: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: User;
  dueDate: string;
  estimatedHours: number;
  loggedHours: number;
  subtasks: Subtask[];
  tags: string[];
  branchName?: string;
  prNumber?: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  deadline: string;
  repository: string;
  techStack: string[];
  lead: User;
  members: User[];
  color: string;
}

export interface ProductivityMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
  description: string;
  iconName: string;
}

export interface DailyProductivity {
  day: string;
  shortDay: string;
  focusHours: number;
  commitCount: number;
  pullRequestsCount: number;
  tasksCompleted: number;
  isToday?: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'commit' | 'pr_merged' | 'pr_review' | 'task_completed' | 'deployment' | 'comment';
  title: string;
  description: string;
  timestamp: string;
  user: User;
  projectKey: string;
  badgeText?: string;
}

export interface TaskFilterState {
  searchQuery: string;
  projectId: string;
  priority: string;
  status: string;
  assigneeId?: string;
}
