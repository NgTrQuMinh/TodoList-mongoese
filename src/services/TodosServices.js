import mongoose from 'mongoose';
import Todo from '../model/Todos.js';
import { AppError } from '../utils/appError.js';

const validateObjectId = (id, entityName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(`ID ${entityName} không hợp lệ`, 400);
    }
};

export const getAll = async () => {
    return Todo.find().sort({ createdAt: -1 }).select('-__v').lean().exec();
};

export const getById = async (id) => {
    validateObjectId(id, 'Todo');
    const todo = await Todo.findById(id).select('-__v').lean().exec();
    if (!todo) throw new AppError('Không tìm thấy Todo', 404);
    return todo;
};

export const create = async (data) => {
    const { title, completed } = data;
    const todo = await Todo.create({ title, completed });
    return todo;
};

export const update = async (id, data = {}) => {
    validateObjectId(id, 'Todo');

    const { title, completed } = data;
    const todo = await Todo.findByIdAndUpdate(
        id,
        { $set: { title, completed } },
        { returnDocument: 'after', runValidators: true }
    ).select('-__v').lean().exec();
    if (!todo) throw new AppError('Không tìm thấy Todo để cập nhật', 404);
    return todo;
};

export const remove = async (id) => {
    validateObjectId(id, 'Todo');
    const todo = await Todo.findByIdAndDelete(id).select('-__v').lean().exec();
    if (!todo) throw new AppError('Không tìm thấy Todo để xóa', 404);
    return todo;
};
