import { Request, Response } from 'express';
import { sendError } from '../utils/api-response.js';

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(
    res,
    'ROUTE_NOT_FOUND',
    `Cannot ${req.method} ${req.originalUrl}. The requested API endpoint does not exist.`,
    404
  );
};
