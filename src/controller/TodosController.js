import * as TodosServices from '../services/TodosServices.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getAllTodos = asyncHandler(async (req, res) => {
    const todos = await TodosServices.getAll();
    return sendResponse(res, 200, todos, 'Lấy danh sách công việc thành công');
});

export const getTodosById = asyncHandler(async (req, res) => {
    const todo = await TodosServices.getById(req.params.id);
    return sendResponse(res, 200, todo, 'Lấy chi tiết công việc thành công');
});

export const createTodos = asyncHandler(async (req, res) => {
    const todo = await TodosServices.create(req.body);
    return sendResponse(res, 201, todo, 'Tạo công việc mới thành công');
});

export const updateTodos = asyncHandler(async (req, res) => {
    const todo = await TodosServices.update(req.params.id, req.body);
    return sendResponse(res, 200, todo, 'Cập nhật công việc thành công');
});

export const deleteTodos = asyncHandler(async (req, res) => {
    await TodosServices.deletes(req.params.id);
    return res.status(204).end();
});
