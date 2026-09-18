import { prisma } from '../db/prisma.js';
import { ActivityItem, User } from '../types/index.js';
import { UserService } from './user.service.js';

export interface CreateActivityInput {
  type: ActivityItem['type'];
  title: string;
  description: string;
  userId: string;
  projectKey: string;
  badgeText?: string;
}

const formatActivity = (act: any): ActivityItem => ({
  id: act.id,
  type: act.type as ActivityItem['type'],
  title: act.title,
  description: act.description,
  timestamp: act.timestamp,
  user: act.user as User,
  projectKey: act.projectKey,
  badgeText: act.badgeText || undefined,
});

export class ActivityService {
  public static async getAllActivities(): Promise<ActivityItem[]> {
    const activities = await prisma.activity.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return activities.map(formatActivity);
  }

  public static async createActivity(data: CreateActivityInput): Promise<ActivityItem> {
    await UserService.getUserById(data.userId);

    const created = await prisma.activity.create({
      data: {
        id: `act-${Date.now()}`,
        type: data.type,
        title: data.title,
        description: data.description,
        timestamp: 'Just now',
        userId: data.userId,
        projectKey: data.projectKey,
        badgeText: data.badgeText,
      },
      include: { user: true },
    });

    return formatActivity(created);
  }
}
