import { Router } from 'express';
import {
  getAllCandidates, getCandidateById, createCandidate,
  updateCandidate, deleteCandidate, bulkUpload,
} from '../controllers/candidateController.js';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';
import validate from '../middleware/validate.js';
import { candidateSchema, updateCandidateSchema } from '../utils/candidateSchemas.js';
import upload from '../utils/multerConfig.js';

const router = Router();

router.use(auth, roleGuard('admin', 'hr'));

router.get('/', getAllCandidates);
router.get('/:id', getCandidateById);
router.post('/', validate(candidateSchema), createCandidate);
router.post('/bulk', upload.single('file'), bulkUpload);
router.put('/:id', validate(updateCandidateSchema), updateCandidate);
router.delete('/:id', deleteCandidate);

export default router;
