import express from 'express';
import * as TodosController from '../controller/TodosController.js';
const router = express.Router();

router.get('/', TodosController.getAllTodos);
router.get('/:id', TodosController.getTodosById);
router.post('/', TodosController.createTodos);
router.put('/:id', TodosController.updateTodos);
router.patch('/:id', TodosController.updateTodos);
router.delete('/:id', TodosController.deleteTodos);

export default router;
