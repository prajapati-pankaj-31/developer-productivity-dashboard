import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { sendSuccess, sendCollection } from '../utils/api-response.js';

export class UserController {
  public static getAllUsers(_req: Request, res: Response, next: NextFunction): void {
    try {
      const users = UserService.getAllUsers();
      sendCollection(res, users);
    } catch (error) {
      next(error);
    }
  }

  public static getUserById(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const user = UserService.getUserById(id);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  public static createUser(req: Request, res: Response, next: NextFunction): void {
    try {
      const newUser = UserService.createUser(req.body);
      sendSuccess(res, newUser, 201);
    } catch (error) {
      next(error);
    }
  }

  public static updateUser(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      const updatedUser = UserService.updateUser(id, req.body);
      sendSuccess(res, updatedUser, 200);
    } catch (error) {
      next(error);
    }
  }

  public static deleteUser(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = req.params.id as string;
      UserService.deleteUser(id);
      sendSuccess(res, { message: `User with id '${id}' has been successfully deleted.` }, 200);
    } catch (error) {
      next(error);
    }
  }
}
