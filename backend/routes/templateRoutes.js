import { Router } from 'express';
import {
  getAllTemplates, getTemplateById, createTemplate,
  updateTemplate, deleteTemplate, getTemplateVersions,
} from '../controllers/templateController.js';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';
import validate from '../middleware/validate.js';
import { createTemplateSchema, updateTemplateSchema } from '../utils/templateSchemas.js';
import cache from '../middleware/cache.js';

const router = Router();

router.use(auth, roleGuard('admin', 'hr'));

router.get('/', cache(120), getAllTemplates);
router.get('/:id', cache(120), getTemplateById);
router.get('/:id/versions', cache(60), getTemplateVersions);
router.post('/', validate(createTemplateSchema), createTemplate);
router.put('/:id', validate(updateTemplateSchema), updateTemplate);
router.delete('/:id', roleGuard('admin'), deleteTemplate);

export default router;
