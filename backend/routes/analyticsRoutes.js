import { Router } from 'express';
import { getOverview, getByStatus, getByDepartment, getOverTime } from '../controllers/analyticsController.js';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';
import cache from '../middleware/cache.js';

const router = Router();

router.use(auth, roleGuard('admin', 'hr'));

router.get('/overview', cache(0), getOverview);
router.get('/by-status', cache(30), getByStatus);
router.get('/by-department', cache(30), getByDepartment);
router.get('/over-time', cache(60), getOverTime);

export default router;
