import { Router } from 'express';
import {
  getAllOffers, getOfferById, createOffer,
  updateOfferStatus, getOfferVersions,
} from '../controllers/offerController.js';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';
import validate from '../middleware/validate.js';
import { createOfferSchema, updateStatusSchema } from '../utils/offerSchemas.js';

const router = Router();

router.use(auth, roleGuard('admin', 'hr'));

router.get('/', getAllOffers);
router.get('/:id', getOfferById);
router.get('/:id/versions', getOfferVersions);
router.post('/', validate(createOfferSchema), createOffer);
router.patch('/:id/status', validate(updateStatusSchema), updateOfferStatus);

export default router;
