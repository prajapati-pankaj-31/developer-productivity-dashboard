import { db } from '../data/mock-data.js';
import { ProductivityMetric, DailyProductivity } from '../types/index.js';

export class AnalyticsService {
  public static getMetrics(): ProductivityMetric[] {
    return db.getMetrics();
  }

  public static getWeeklyProductivity(): DailyProductivity[] {
    return db.getWeeklyData();
  }

  public static getOverviewSummary() {
    const tasks = db.getTasks();
    const projects = db.getProjects();
    const users = db.getUsers();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === 'on_track').length;

    return {
      metrics: db.getMetrics(),
      weeklyProductivity: db.getWeeklyData(),
      summary: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        totalProjects,
        activeProjects,
        totalDevelopers: users.length,
      },
    };
  }
}
