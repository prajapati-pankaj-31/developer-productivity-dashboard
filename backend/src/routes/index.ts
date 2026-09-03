import { Router, Request, Response } from 'express';
import userRoutes from './user.routes.js';
import projectRoutes from './project.routes.js';
import taskRoutes from './task.routes.js';
import analyticsRoutes from './analytics.routes.js';
import activityRoutes from './activity.routes.js';

const apiRouter = Router();

apiRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Developer Productivity Dashboard REST API (v1)',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: {
        list: 'GET /api/v1/users',
        getById: 'GET /api/v1/users/:id',
        create: 'POST /api/v1/users',
        update: 'PATCH /api/v1/users/:id',
        delete: 'DELETE /api/v1/users/:id',
      },
      projects: {
        list: 'GET /api/v1/projects',
        filterStatus: 'GET /api/v1/projects?status=on_track',
        search: 'GET /api/v1/projects?search=keyword',
        getById: 'GET /api/v1/projects/:id',
        create: 'POST /api/v1/projects',
        update: 'PATCH /api/v1/projects/:id',
        delete: 'DELETE /api/v1/projects/:id',
      },
      tasks: {
        list: 'GET /api/v1/tasks',
        filterStatus: 'GET /api/v1/tasks?status=in_progress',
        filterPriority: 'GET /api/v1/tasks?priority=urgent',
        filterProject: 'GET /api/v1/tasks?projectId=proj-saq',
        search: 'GET /api/v1/tasks?search=keyword',
        getById: 'GET /api/v1/tasks/:id',
        create: 'POST /api/v1/tasks',
        update: 'PATCH /api/v1/tasks/:id',
        updateStatus: 'PATCH /api/v1/tasks/:id/status',
        toggleSubtask: 'PATCH /api/v1/tasks/:id/subtasks/:subtaskId/toggle',
        delete: 'DELETE /api/v1/tasks/:id',
      },
      analytics: {
        metrics: 'GET /api/v1/analytics/metrics',
        weekly: 'GET /api/v1/analytics/weekly',
        overview: 'GET /api/v1/analytics/overview',
      },
      activities: {
        list: 'GET /api/v1/activities',
        create: 'POST /api/v1/activities',
      },
    },
  });
});

apiRouter.use('/users', userRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/tasks', taskRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/activities', activityRoutes);

export default apiRouter;
