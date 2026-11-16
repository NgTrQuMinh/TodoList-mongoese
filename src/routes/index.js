import express from 'express';
import todosRouter from './todos.route.js';
import authRouter from './auth.route.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/todos', todosRouter);

export default router;
