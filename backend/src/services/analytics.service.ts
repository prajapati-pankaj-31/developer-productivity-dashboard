import { prisma } from '../db/prisma.js';
import { ProductivityMetric, DailyProductivity } from '../types/index.js';

const STATIC_METRICS: ProductivityMetric[] = [
  {
    id: 'm-1',
    label: 'Focus Score',
    value: '87%',
    unit: '%',
    changePercent: 4.2,
    trend: 'up',
    description: 'Based on uninterrupted deep work blocks',
    iconName: 'Zap',
  },
  {
    id: 'm-2',
    label: 'Sprint Velocity',
    value: '42 pts',
    unit: 'pts',
    changePercent: 12.5,
    trend: 'up',
    description: 'Story points completed this sprint cycle',
    iconName: 'TrendingUp',
  },
  {
    id: 'm-3',
    label: 'PR Review Time',
    value: '2.4 hrs',
    unit: 'hrs',
    changePercent: -18.3,
    trend: 'up',
    description: 'Average time to first meaningful review',
    iconName: 'GitPullRequest',
  },
  {
    id: 'm-4',
    label: 'Active Focus Time',
    value: '34.5 hrs',
    unit: 'hrs',
    changePercent: 2.8,
    trend: 'up',
    description: 'Total tracked pomodoro / flow time',
    iconName: 'Clock',
  },
];

export class AnalyticsService {
  public static async getMetrics(): Promise<ProductivityMetric[]> {
    return STATIC_METRICS;
  }

  public static async getWeeklyProductivity(): Promise<DailyProductivity[]> {
    const records = await prisma.dailyProductivity.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return records.map((r) => ({
      day: r.day,
      shortDay: r.shortDay,
      focusHours: r.focusHours,
      commitCount: r.commitCount,
      pullRequestsCount: r.pullRequestsCount,
      tasksCompleted: r.tasksCompleted,
      isToday: r.isToday,
    }));
  }

  public static async getOverviewSummary() {
    const [tasks, projects, users, weeklyProductivity] = await Promise.all([
      prisma.task.findMany({ select: { status: true } }),
      prisma.project.findMany({ select: { status: true } }),
      prisma.user.findMany({ select: { id: true } }),
      this.getWeeklyProductivity(),
    ]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === 'on_track').length;

    return {
      metrics: STATIC_METRICS,
      weeklyProductivity,
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
