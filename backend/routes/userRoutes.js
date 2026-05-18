import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';
import validate from '../middleware/validate.js';
import { updateUserSchema } from '../utils/userSchemas.js';

const router = Router();

router.use(auth, roleGuard('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;
