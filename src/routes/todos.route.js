import express from 'express';
import * as TodosController from '../controller/TodosController.js';
import { validate } from '../middleware/validate.js';
import { createTodoSchema, updateTodoSchema } from '../validators/todo.validation.js';

const router = express.Router();

router.get('/', TodosController.getAllTodos);
router.get('/:id', TodosController.getTodosById);
router.post('/', validate(createTodoSchema), TodosController.createTodos);
router.patch('/:id', validate(updateTodoSchema), TodosController.updateTodos);
router.delete('/:id', TodosController.deleteTodos);

export default router;
