import {
  Task,
  Project,
  User,
  ProductivityMetric,
  DailyProductivity,
  ActivityItem,
  TaskStatus,
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
} from '@/types';
import {
  CURRENT_USER,
  MOCK_PROJECTS,
  MOCK_TASKS,
  PRODUCTIVITY_METRICS,
  WEEKLY_PRODUCTIVITY_DATA,
  RECENT_ACTIVITIES,
} from './mock-data';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const HEALTH_URL =
  process.env.NEXT_PUBLIC_HEALTH_URL || 'http://localhost:5000/health';
const TOKEN_KEY = 'dev_dashboard_auth_token';

function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 4000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const token = getStoredToken();
  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...authHeaders,
        ...(options.headers || {}),
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export class ApiClient {
  public static setToken(token: string | null): void {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  public static getToken(): string | null {
    return getStoredToken();
  }

  // --- AUTH ---
  public static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Login failed. Please check your credentials.');
    }

    ApiClient.setToken(json.data.token);
    return json.data;
  }

  public static async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || 'Signup failed. Please check your details.');
    }

    ApiClient.setToken(json.data.token);
    return json.data;
  }

  public static async getMe(): Promise<User | null> {
    const token = ApiClient.getToken();
    if (!token) return null;

    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/me`);
      if (!res.ok) {
        ApiClient.setToken(null);
        return null;
      }
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  }

  public static logout(): void {
    ApiClient.setToken(null);
  }

  public static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetchWithTimeout(HEALTH_URL, { method: 'GET' }, 2000);
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- USERS ---
  public static async getUsers(): Promise<User[]> {

    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('⚠️ [API] Users endpoint unreachable, using fallback cache:', err);
      return [CURRENT_USER];
    }
  }

  public static async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update user');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('⚠️ [API] updateUser failed, updating locally:', err);
      return { ...CURRENT_USER, ...data } as User;
    }
  }

  // --- PROJECTS ---
  public static async getProjects(): Promise<Project[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/projects`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('⚠️ [API] Projects endpoint unreachable, using fallback cache:', err);
      return MOCK_PROJECTS;
    }
  }

  public static async createProject(data: any): Promise<Project> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/projects`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to create project');
    }
    const json = await res.json();
    return json.data;
  }

  public static async updateProject(id: string, data: Partial<Project> & { leadId?: string }): Promise<Project> {
    const body: Record<string, any> = {};
    if (data.name !== undefined) body.name = data.name;
    if (data.key !== undefined) body.key = data.key;
    if (data.description !== undefined) body.description = data.description;
    if (data.status !== undefined) body.status = data.status;
    if (data.deadline !== undefined) body.deadline = data.deadline;
    if (data.repository !== undefined) body.repository = data.repository;
    if (data.techStack !== undefined) body.techStack = data.techStack;
    if (data.progress !== undefined) body.progress = data.progress;
    if (data.color !== undefined) body.color = data.color;
    if (data.leadId) body.leadId = data.leadId;
    else if (data.lead?.id) body.leadId = data.lead.id;

    const res = await fetchWithTimeout(`${API_BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to update project in database');
    }
    const json = await res.json();
    return json.data;
  }

  public static async deleteProject(id: string): Promise<void> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to delete project from database');
    }
  }

  // --- TASKS ---
  public static async getTasks(): Promise<Task[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('⚠️ [API] Tasks endpoint unreachable, using fallback cache:', err);
      return MOCK_TASKS;
    }
  }

  public static async createTask(data: {
    title: string;
    description: string;
    projectId: string;
    priority: string;
    status: string;
    assigneeId: string;
    dueDate: string;
    estimatedHours: number;
    tags?: string[];
    branchName?: string;
    prNumber?: number;
    subtasks?: Array<{ title: string; completed: boolean }>;
  }): Promise<Task> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to create task in database');
    }
    const json = await res.json();
    return json.data;
  }

  public static async updateTask(id: string, data: Partial<Task> & { assigneeId?: string }): Promise<Task> {
    const body: Record<string, any> = {};
    if (data.title !== undefined) body.title = data.title;
    if (data.description !== undefined) body.description = data.description;
    if (data.projectId !== undefined) body.projectId = data.projectId;
    if (data.priority !== undefined) body.priority = data.priority;
    if (data.status !== undefined) body.status = data.status;
    if (data.dueDate !== undefined) body.dueDate = data.dueDate;
    if (data.estimatedHours !== undefined) body.estimatedHours = data.estimatedHours;
    if (data.loggedHours !== undefined) body.loggedHours = data.loggedHours;
    if (data.tags !== undefined) body.tags = data.tags;
    if (data.branchName !== undefined) body.branchName = data.branchName;
    if (data.prNumber !== undefined) body.prNumber = data.prNumber;
    if (data.assigneeId) body.assigneeId = data.assigneeId;
    else if (data.assignee?.id) body.assigneeId = data.assignee.id;
    if (data.subtasks) {
      body.subtasks = data.subtasks.map((st) => ({
        id: st.id,
        title: st.title,
        completed: st.completed,
      }));
    }

    const res = await fetchWithTimeout(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to update task in database');
    }
    const json = await res.json();
    return json.data;
  }

  public static async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to update task status in database');
    }
    const json = await res.json();
    return json.data;
  }

  public static async toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}/toggle`,
      { method: 'PATCH' }
    );
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to toggle subtask in database');
    }
    const json = await res.json();
    return json.data;
  }

  public static async deleteTask(id: string): Promise<void> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to delete task from database');
    }
  }

  // --- ANALYTICS & METRICS ---
  public static async getAnalyticsOverview(): Promise<{
    metrics: ProductivityMetric[];
    weeklyProductivity: DailyProductivity[];
    summary: {
      totalTasks: number;
      completedTasks: number;
      inProgressTasks: number;
      totalProjects: number;
      activeProjects: number;
      totalDevelopers: number;
    };
  }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/analytics/overview`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('⚠️ [API] Analytics endpoint unreachable, using fallback cache:', err);
      return {
        metrics: PRODUCTIVITY_METRICS,
        weeklyProductivity: WEEKLY_PRODUCTIVITY_DATA,
        summary: {
          totalTasks: MOCK_TASKS.length,
          completedTasks: MOCK_TASKS.filter((t) => t.status === 'completed').length,
          inProgressTasks: MOCK_TASKS.filter((t) => t.status === 'in_progress').length,
          totalProjects: MOCK_PROJECTS.length,
          activeProjects: MOCK_PROJECTS.filter((p) => p.status === 'on_track').length,
          totalDevelopers: 5,
        },
      };
    }
  }

  // --- ACTIVITIES ---
  public static async getActivities(): Promise<ActivityItem[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/activities`);
      if (!res.ok) throw new Error('Failed to fetch activities');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('⚠️ [API] Activities endpoint unreachable, using fallback cache:', err);
      return RECENT_ACTIVITIES;
    }
  }

  public static async createActivity(data: {
    type: string;
    title: string;
    description: string;
    userId: string;
    projectKey: string;
    badgeText?: string;
  }): Promise<ActivityItem> {
    const res = await fetchWithTimeout(`${API_BASE_URL}/activities`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to record activity');
    }
    const json = await res.json();
    return json.data;
  }

  // --- AI CAPABILITIES (TASK 4) ---
  public static async generateAITask(
    prompt: string,
    projectKey?: string,
    priority?: 'urgent' | 'high' | 'medium' | 'low'
  ): Promise<{
    title: string;
    description: string;
    suggestedPriority: 'urgent' | 'high' | 'medium' | 'low';
    estimatedHours: number;
    tags: string[];
    subtasks: Array<{ title: string; completed: boolean }>;
  }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/ai/generate-task`, {
        method: 'POST',
        body: JSON.stringify({ prompt, projectKey, priority }),
      });
      if (!res.ok) throw new Error('AI generation service error');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('⚠️ [API] AI endpoint unreachable, using client fallback:', err);
      return {
        title: prompt.charAt(0).toUpperCase() + prompt.slice(1),
        description: `### 🎯 Objective\nImplement **${prompt}** with high code quality and test coverage.\n\n### 📋 Acceptance Criteria\n- Complete logic implementation\n- Unit & integration tests\n- Zero performance regressions`,
        suggestedPriority: priority || 'medium',
        estimatedHours: 4,
        tags: ['Engineering', 'Feature'],
        subtasks: [
          { title: `Requirements and architecture review for ${prompt.slice(0, 24)}`, completed: false },
          { title: `Core implementation with error boundaries`, completed: false },
          { title: `Automated test coverage & peer code review`, completed: false },
        ],
      };
    }
  }

  public static async generateAIRoadmap(projectName: string, concept: string, techStack?: string[]): Promise<{
    projectName: string;
    description: string;
    suggestedTechStack: string[];
    milestones: Array<{ phase: string; title: string; duration: string; deliverables: string[] }>;
    riskAssessment: string;
  }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/ai/generate-roadmap`, {
        method: 'POST',
        body: JSON.stringify({ projectName, concept, techStack }),
      });
      if (!res.ok) throw new Error('AI Roadmap service error');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('⚠️ [API] AI roadmap unreachable, using client fallback:', err);
      return {
        projectName,
        description: `Production roadmap for ${projectName}: ${concept}`,
        suggestedTechStack: techStack || ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
        milestones: [
          {
            phase: 'Phase 1 - Inception',
            title: 'Foundational Setup & Auth',
            duration: 'Sprint 1',
            deliverables: ['Database modeling', 'JWT Authentication', 'UI Shell'],
          },
          {
            phase: 'Phase 2 - Core Sprint',
            title: 'Feature Implementation',
            duration: 'Sprint 2',
            deliverables: ['REST Endpoints', 'Kanban Board', 'Team Sync'],
          },
        ],
        riskAssessment: 'Low risk. Follow standard engineering reviews.',
      };
    }
  }

  public static async generateAIStandup(data: {
    userName?: string;
    focusHours?: number;
    tasks?: any[];
  }): Promise<{
    greeting: string;
    yesterday: string[];
    today: string[];
    blockers: string[];
    productivityScore: number;
    smartSuggestions: string[];
    formattedSlackText: string;
  }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/ai/standup-summary`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('AI Standup service error');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('⚠️ [API] AI standup unreachable, using client fallback:', err);
      const name = data.userName || 'Developer';
      const hours = data.focusHours || 6.5;
      return {
        greeting: `Good day, ${name}! Here is your AI Standup summary:`,
        yesterday: ['Completed sprint backlog items and reviewed pull requests'],
        today: ['Active engineering sprint work and automated testing'],
        blockers: ['No active blockers. Velocity on track.'],
        productivityScore: 92,
        smartSuggestions: [
          `Logged ${hours}h of deep focus. Maintain uninterrupted timeblocks.`,
          'Review upcoming sprint deliverables before tomorrow.',
        ],
        formattedSlackText: `*🚀 Daily Standup - ${name}*\n\n*✅ Yesterday:* Completed sprint backlog items\n*🎯 Today:* Active feature engineering\n*🛑 Blockers:* None\n*⚡ Focus:* ${hours}h`,
      };
    }
  }

  public static async chatWithAI(data: {
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    context?: {
      userName?: string;
      userRole?: string;
      activeTasksCount?: number;
      projectsCount?: number;
      recentTasks?: string[];
    };
  }): Promise<{
    reply: string;
    suggestedActions?: string[];
  }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        body: JSON.stringify(data),
      }, 10000);
      if (!res.ok) throw new Error('AI Chat service error');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('⚠️ [API] AI chat unreachable, using client fallback:', err);
      const lastMsg = data.messages[data.messages.length - 1]?.content.toLowerCase() || '';
      let reply = `Hello ${data.context?.userName || 'Developer'}! I'm your DevHub AI Engineering Copilot. How can I help you tackle sprint tasks, optimize code, or architect features today?`;

      if (lastMsg.includes('optimize') || lastMsg.includes('speed') || lastMsg.includes('performance')) {
        reply = `Here are 3 quick developer productivity and performance tips:\n1. **Query Optimization**: Add compound B-Tree indexes on frequent filter keys (\`status\`, \`userId\`).\n2. **State Caching**: Leverage React 19 / Next.js server components with optimistic UI updates.\n3. **Connection Pooling**: Restrict Prisma pool size to prevent database exhaustion under concurrency.`;
      } else if (lastMsg.includes('task') || lastMsg.includes('sprint') || lastMsg.includes('plan')) {
        reply = `You have **${data.context?.activeTasksCount ?? 3} active sprint tasks**. Recommend prioritizing urgent bugs first, then focusing in 90-minute deep work blocks.`;
      } else if (lastMsg.includes('docker') || lastMsg.includes('deploy')) {
        reply = `**Deployment Guide**:\n- Ensure production environment variables (\`DATABASE_URL\`, \`JWT_SECRET\`, \`GROQ_API_KEY\`) are properly set.\n- Use multi-stage Docker build to keep images under 150MB.\n- Enable PM2 or container healthchecks.`;
      }

      return {
        reply,
        suggestedActions: [
          'Break active tasks into subtasks',
          'Optimize PostgreSQL queries',
          'Generate daily standup report',
        ],
      };
    }
  }
}

