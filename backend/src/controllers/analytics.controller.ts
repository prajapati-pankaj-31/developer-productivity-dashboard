import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { sendSuccess, sendCollection } from '../utils/api-response.js';

export class AnalyticsController {
  public static getMetrics(_req: Request, res: Response, next: NextFunction): void {
    try {
      const metrics = AnalyticsService.getMetrics();
      sendCollection(res, metrics);
    } catch (error) {
      next(error);
    }
  }

  public static getWeeklyProductivity(_req: Request, res: Response, next: NextFunction): void {
    try {
      const weekly = AnalyticsService.getWeeklyProductivity();
      sendCollection(res, weekly);
    } catch (error) {
      next(error);
    }
  }

  public static getOverviewSummary(_req: Request, res: Response, next: NextFunction): void {
    try {
      const summary = AnalyticsService.getOverviewSummary();
      sendSuccess(res, summary);
    } catch (error) {
      next(error);
    }
  }
}
