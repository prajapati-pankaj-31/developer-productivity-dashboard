import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../services/activity.service.js';
import { sendSuccess, sendCollection } from '../utils/api-response.js';

export class ActivityController {
  public static async getAllActivities(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activities = await ActivityService.getAllActivities();
      sendCollection(res, activities);
    } catch (error) {
      next(error);
    }
  }

  public static async createActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newActivity = await ActivityService.createActivity(req.body);
      sendSuccess(res, newActivity, 201);
    } catch (error) {
      next(error);
    }
  }
}
