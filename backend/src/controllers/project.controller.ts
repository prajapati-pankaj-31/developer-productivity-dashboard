import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service.js';
import { sendSuccess, sendCollection } from '../utils/api-response.js';

export class ProjectController {
  public static getAllProjects(req: Request, res: Response, next: NextFunction): void {
    try {
      const projects = ProjectService.getAllProjects(req.query);
      sendCollection(res, projects);
    } catch (error) {
      next(error);
    }
  }

  public static getProjectById(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const project = ProjectService.getProjectById(id);
      sendSuccess(res, project);
    } catch (error) {
      next(error);
    }
  }

  public static createProject(req: Request, res: Response, next: NextFunction): void {
    try {
      const newProject = ProjectService.createProject(req.body);
      sendSuccess(res, newProject, 201);
    } catch (error) {
      next(error);
    }
  }

  public static updateProject(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const updatedProject = ProjectService.updateProject(id, req.body);
      sendSuccess(res, updatedProject, 200);
    } catch (error) {
      next(error);
    }
  }

  public static deleteProject(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      ProjectService.deleteProject(id);
      sendSuccess(res, { message: `Project with id '${id}' has been successfully deleted.` }, 200);
    } catch (error) {
      next(error);
    }
  }
}
