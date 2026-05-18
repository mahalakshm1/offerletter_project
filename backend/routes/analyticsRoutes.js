import { Router } from 'express';
import { getOverview, getByStatus, getByDepartment, getOverTime } from '../controllers/analyticsController.js';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = Router();

router.use(auth, roleGuard('admin', 'hr'));

router.get('/overview', getOverview);
router.get('/by-status', getByStatus);
router.get('/by-department', getByDepartment);
router.get('/over-time', getOverTime);

export default router;
