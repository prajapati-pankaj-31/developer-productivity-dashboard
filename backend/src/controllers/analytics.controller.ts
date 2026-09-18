import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { sendSuccess, sendCollection } from '../utils/api-response.js';

export class AnalyticsController {
  public static async getMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await AnalyticsService.getMetrics();
      sendCollection(res, metrics);
    } catch (error) {
      next(error);
    }
  }

  public static async getWeeklyProductivity(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const weekly = await AnalyticsService.getWeeklyProductivity();
      sendCollection(res, weekly);
    } catch (error) {
      next(error);
    }
  }

  public static async getOverviewSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await AnalyticsService.getOverviewSummary();
      sendSuccess(res, summary);
    } catch (error) {
      next(error);
    }
  }
}
