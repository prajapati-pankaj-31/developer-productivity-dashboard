import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service.js';
import { sendSuccess, sendCollection } from '../utils/api-response.js';

export class TaskController {
  public static getAllTasks(req: Request, res: Response, next: NextFunction): void {
    try {
      const tasks = TaskService.getAllTasks(req.query);
      sendCollection(res, tasks);
    } catch (error) {
      next(error);
    }
  }

  public static getTaskById(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const task = TaskService.getTaskById(id);
      sendSuccess(res, task);
    } catch (error) {
      next(error);
    }
  }

  public static createTask(req: Request, res: Response, next: NextFunction): void {
    try {
      const newTask = TaskService.createTask(req.body);
      sendSuccess(res, newTask, 201);
    } catch (error) {
      next(error);
    }
  }

  public static updateTask(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const updatedTask = TaskService.updateTask(id, req.body);
      sendSuccess(res, updatedTask, 200);
    } catch (error) {
      next(error);
    }
  }

  public static updateTaskStatus(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const updatedTask = TaskService.updateTaskStatus(id, status);
      sendSuccess(res, updatedTask, 200);
    } catch (error) {
      next(error);
    }
  }

  public static toggleSubtask(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const subtaskId = req.params.subtaskId as string;
      const updatedTask = TaskService.toggleSubtask(id, subtaskId);
      sendSuccess(res, updatedTask, 200);
    } catch (error) {
      next(error);
    }
  }

  public static deleteTask(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      TaskService.deleteTask(id);
      sendSuccess(res, { message: `Task with id '${id}' has been successfully deleted.` }, 200);
    } catch (error) {
      next(error);
    }
  }
}
