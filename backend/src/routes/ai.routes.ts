import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { validateBody } from '../middleware/validation.middleware.js';
import {
  generateTasksSchema,
  generateRoadmapSchema,
  standupSummarySchema,
  summarizeTaskSchema,
  chatSchema,
} from '../validators/ai.validator.js';

const router = Router();

router.post('/generate-task', validateBody(generateTasksSchema), AIController.generateTask);
router.post('/generate-roadmap', validateBody(generateRoadmapSchema), AIController.generateRoadmap);
router.post('/standup-summary', validateBody(standupSummarySchema), AIController.generateStandup);
router.post('/summarize-task', validateBody(summarizeTaskSchema), AIController.summarizeTask);
router.post('/chat', validateBody(chatSchema), AIController.chat);

export default router;
