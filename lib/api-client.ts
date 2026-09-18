import { Task, Project, User, ProductivityMetric, DailyProductivity, ActivityItem, TaskStatus } from '@/types';
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

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 4000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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
}
