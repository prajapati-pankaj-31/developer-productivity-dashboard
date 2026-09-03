import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { createUserSchema, updateUserSchema } from '../validators/user.validator.js';

const router = Router();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', validateBody(createUserSchema), UserController.createUser);
router.patch('/:id', validateBody(updateUserSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
