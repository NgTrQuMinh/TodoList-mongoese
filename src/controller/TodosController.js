import * as TodosServices from '../services/TodosServices.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getAllTodos = asyncHandler(async (req, res) => {
    const todos = await TodosServices.getAll(req.user);
    return sendResponse(res, 200, todos, 'Lấy danh sách công việc thành công');
});

export const getTodosById = asyncHandler(async (req, res) => {
    const todo = await TodosServices.getById(req.params.id, req.user);
    return sendResponse(res, 200, todo, 'Lấy chi tiết công việc thành công');
});

export const createTodos = asyncHandler(async (req, res) => {
    const todo = await TodosServices.create(req.body, req.user);
    return sendResponse(res, 201, todo, 'Tạo công việc mới thành công');
});

export const updateTodos = asyncHandler(async (req, res) => {
    const todo = await TodosServices.update(req.params.id, req.body, req.user);
    return sendResponse(res, 200, todo, 'Cập nhật công việc thành công');
});

export const deleteTodos = asyncHandler(async (req, res) => {
    await TodosServices.remove(req.params.id, req.user);
    return res.status(204).end();
});
