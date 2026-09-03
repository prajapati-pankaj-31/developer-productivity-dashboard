import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { validateBody, validateQuery } from '../middleware/validation.middleware.js';
import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
} from '../validators/project.validator.js';

const router = Router();

router.get('/', validateQuery(projectQuerySchema), ProjectController.getAllProjects);
router.get('/:id', ProjectController.getProjectById);
router.post('/', validateBody(createProjectSchema), ProjectController.createProject);
router.patch('/:id', validateBody(updateProjectSchema), ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);

export default router;
