import { Router } from 'express';
import {
  getAllTemplates, getTemplateById, createTemplate,
  updateTemplate, deleteTemplate, getTemplateVersions,
} from '../controllers/templateController.js';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';
import validate from '../middleware/validate.js';
import { createTemplateSchema, updateTemplateSchema } from '../utils/templateSchemas.js';

const router = Router();

router.use(auth, roleGuard('admin', 'hr'));

router.get('/', getAllTemplates);
router.get('/:id', getTemplateById);
router.get('/:id/versions', getTemplateVersions);
router.post('/', validate(createTemplateSchema), createTemplate);
router.put('/:id', validate(updateTemplateSchema), updateTemplate);
router.delete('/:id', roleGuard('admin'), deleteTemplate);

export default router;
