import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/metrics', AnalyticsController.getMetrics);
router.get('/weekly', AnalyticsController.getWeeklyProductivity);
router.get('/overview', AnalyticsController.getOverviewSummary);

export default router;
