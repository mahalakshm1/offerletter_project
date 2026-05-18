import { Router } from 'express';
import { downloadPDF, uploadPDF, getDownloadUrl } from '../controllers/pdfController.js';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = Router();

router.use(auth, roleGuard('admin', 'hr'));

router.get('/:id/pdf', downloadPDF);
router.post('/:id/pdf/upload', uploadPDF);
router.get('/:id/pdf/url', getDownloadUrl);

export default router;
