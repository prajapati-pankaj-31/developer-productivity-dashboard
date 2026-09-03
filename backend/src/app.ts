import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';

dotenv.config();

export const createApp = (): Express => {
  const app = express();

  // Security & Utility Middlewares
  app.use(helmet());

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.use(
    cors({
      origin: [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // Root & Health Endpoints
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Developer Productivity Dashboard REST API v1',
      version: '1.0.0',
      health: '/health',
      apiPrefix: process.env.API_PREFIX || '/api/v1',
      resources: {
        users: '/api/v1/users',
        projects: '/api/v1/projects',
        tasks: '/api/v1/tasks',
      },
    });
  });

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    });
  });

  // Mount API v1 Routes
  const apiPrefix = process.env.API_PREFIX || '/api/v1';
  app.use(apiPrefix, apiRouter);

  // 404 Route Handler
  app.use(notFoundHandler);

  // Centralized Error Handler Middleware
  app.use(errorHandler);

  return app;
};

export const app = createApp();
export default app;
