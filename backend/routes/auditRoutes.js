import { Router } from 'express';
import { getLogs } from '../controllers/auditController.js';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = Router();

router.get('/', auth, roleGuard('admin'), getLogs);

export default router;
