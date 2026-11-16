import express from 'express';
import * as AuthController from '../controller/AuthController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/auth.validation.js';

const router = express.Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', protect, AuthController.getMe);

export default router;
