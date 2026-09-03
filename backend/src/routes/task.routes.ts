import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { validateBody, validateQuery } from '../middleware/validation.middleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  taskQuerySchema,
} from '../validators/task.validator.js';

const router = Router();

router.get('/', validateQuery(taskQuerySchema), TaskController.getAllTasks);
router.get('/:id', TaskController.getTaskById);
router.post('/', validateBody(createTaskSchema), TaskController.createTask);
router.patch('/:id', validateBody(updateTaskSchema), TaskController.updateTask);
router.patch('/:id/status', validateBody(updateTaskStatusSchema), TaskController.updateTaskStatus);
router.patch('/:id/subtasks/:subtaskId/toggle', TaskController.toggleSubtask);
router.delete('/:id', TaskController.deleteTask);

export default router;
