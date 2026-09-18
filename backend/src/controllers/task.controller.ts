import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service.js';
import { sendSuccess, sendCollection } from '../utils/api-response.js';

export class TaskController {
  public static async getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await TaskService.getAllTasks(req.query);
      sendCollection(res, tasks);
    } catch (error) {
      next(error);
    }
  }

  public static async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const task = await TaskService.getTaskById(id);
      sendSuccess(res, task);
    } catch (error) {
      next(error);
    }
  }

  public static async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newTask = await TaskService.createTask(req.body);
      sendSuccess(res, newTask, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updatedTask = await TaskService.updateTask(id, req.body);
      sendSuccess(res, updatedTask, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async updateTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const updatedTask = await TaskService.updateTaskStatus(id, status);
      sendSuccess(res, updatedTask, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async toggleSubtask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const subtaskId = req.params.subtaskId as string;
      const updatedTask = await TaskService.toggleSubtask(id, subtaskId);
      sendSuccess(res, updatedTask, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await TaskService.deleteTask(id);
      sendSuccess(res, { message: `Task with id '${id}' has been successfully deleted.` }, 200);
    } catch (error) {
      next(error);
    }
  }
}
