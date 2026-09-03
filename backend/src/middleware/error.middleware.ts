import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/api-response.js';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.code, err.message, err.statusCode, err.details);
    return;
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'VALIDATION_ERROR', 'Input validation failed', 400, formattedErrors);
    return;
  }

  if ('type' in err && (err as { type: string }).type === 'entity.parse.failed') {
    sendError(res, 'INVALID_JSON', 'Malformed JSON payload provided in request body', 400);
    return;
  }

  // Unhandled / Internal Server Error
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.error('Unhandled Server Error:', err);
  }

  sendError(
    res,
    'INTERNAL_SERVER_ERROR',
    isDev ? err.message : 'An unexpected internal server error occurred',
    500
  );
};
