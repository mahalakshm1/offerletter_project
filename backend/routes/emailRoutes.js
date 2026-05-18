import { Router } from 'express';
import { sendOffer, scheduleOffer, getScheduledEmails } from '../controllers/emailController.js';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';
import validate from '../middleware/validate.js';
import { scheduleEmailSchema } from '../utils/emailSchemas.js';

const router = Router();

router.use(auth, roleGuard('admin', 'hr'));

router.post('/:id/send', sendOffer);
router.post('/:id/schedule', validate(scheduleEmailSchema), scheduleOffer);
router.get('/:id/scheduled', getScheduledEmails);

export default router;
