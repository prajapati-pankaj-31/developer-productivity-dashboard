import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service.js';
import { sendSuccess } from '../utils/api-response.js';

export class AIController {
  public static async generateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AIService.generateTask(req.body);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async generateRoadmap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AIService.generateProjectRoadmap(req.body);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async generateStandup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AIService.generateStandupSummary(req.body);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async summarizeTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AIService.summarizeTask(req.body);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }
}
