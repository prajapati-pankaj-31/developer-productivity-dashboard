import { db } from '../data/mock-data.js';
import { ActivityItem } from '../types/index.js';
import { UserService } from './user.service.js';

export interface CreateActivityInput {
  type: ActivityItem['type'];
  title: string;
  description: string;
  userId: string;
  projectKey: string;
  badgeText?: string;
}

export class ActivityService {
  public static getAllActivities(): ActivityItem[] {
    return db.getActivities();
  }

  public static createActivity(data: CreateActivityInput): ActivityItem {
    const user = UserService.getUserById(data.userId);
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: data.type,
      title: data.title,
      description: data.description,
      timestamp: new Date().toISOString(),
      user,
      projectKey: data.projectKey,
      badgeText: data.badgeText,
    };
    return db.addActivity(newActivity);
  }
}
