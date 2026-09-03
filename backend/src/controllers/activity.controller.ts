import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../services/activity.service.js';
import { sendSuccess, sendCollection } from '../utils/api-response.js';

export class ActivityController {
  public static getAllActivities(_req: Request, res: Response, next: NextFunction): void {
    try {
      const activities = ActivityService.getAllActivities();
      sendCollection(res, activities);
    } catch (error) {
      next(error);
    }
  }

  public static createActivity(req: Request, res: Response, next: NextFunction): void {
    try {
      const newActivity = ActivityService.createActivity(req.body);
      sendSuccess(res, newActivity, 201);
    } catch (error) {
      next(error);
    }
  }
}
