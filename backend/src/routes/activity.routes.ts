import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller.js';

const router = Router();

router.get('/', ActivityController.getAllActivities);
router.post('/', ActivityController.createActivity);

export default router;
