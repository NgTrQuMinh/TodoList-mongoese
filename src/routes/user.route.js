import express from 'express';
import * as UserController from '../controller/UserController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), UserController.getAllUsers);

export default router;
