import mongoose from 'mongoose';
import Todo from '../model/Todos.js';
import { AppError } from '../utils/appError.js';

const validateObjectId = (id, entityName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(`ID ${entityName} không hợp lệ`, 400);
    }
};

export const getAll = async () => {
    try {
        const todo = await Todo.find().sort({ createdAt: -1 }).lean().exec();
        return todo;
    } catch (error) {
        console.error('Error -> getTodosServices', error);
        throw error;
    }
}

export const getById = async (id) => {
    try {
        validateObjectId(id, 'Todo');
        const todo = await Todo.findById(id).lean().exec();
        if (!todo) throw new AppError('Không tìm thấy Todo', 404);
        return todo;
    } catch (error) {
        console.error('Error -> getByIdTodosServices', error);
        throw error;
    }
}

export const create = async (data) => {
    try {
        const todo = await Todo.create(data);
        return todo;
    } catch (error) {
        console.error('Error -> createTodosServices:', error);
        throw error;
    }
};

export const update = async (id, data = {}) => {
    try {
        validateObjectId(id, 'Todo');

        const { _id, __v, ...payload } = data;
        const todo = await Todo.findByIdAndUpdate(
            id,
            { $set: payload },
            { returnDocument: 'after', runValidators: true }
        ).lean().exec();
        if (!todo) {
            throw new AppError('Không tìm thấy Todo để cập nhật', 404);
        }
        return todo;
    } catch (error) {
        console.error('Error -> updateTodosServices:', error);
        throw error;
    }
}

export const deletes = async (id) => {
    try {
        validateObjectId(id, 'Todo');
        const todo = await Todo.findByIdAndDelete(id).lean().exec();
        if (!todo) {
            throw new AppError('Không tìm thấy Todo để xóa', 404);
        }
        return todo;
    } catch (error) {
        console.error('Error -> deletesTodosServices:', error);
        throw error;
    }
}

