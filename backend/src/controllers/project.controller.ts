import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service.js';
import { sendSuccess, sendCollection } from '../utils/api-response.js';

export class ProjectController {
  public static async getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await ProjectService.getAllProjects(req.query);
      sendCollection(res, projects);
    } catch (error) {
      next(error);
    }
  }

  public static async getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const project = await ProjectService.getProjectById(id);
      sendSuccess(res, project);
    } catch (error) {
      next(error);
    }
  }

  public static async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newProject = await ProjectService.createProject(req.body);
      sendSuccess(res, newProject, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updatedProject = await ProjectService.updateProject(id, req.body);
      sendSuccess(res, updatedProject, 200);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await ProjectService.deleteProject(id);
      sendSuccess(res, { message: `Project with id '${id}' has been successfully deleted.` }, 200);
    } catch (error) {
      next(error);
    }
  }
}
