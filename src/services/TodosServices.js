import mongoose from 'mongoose';
import Todo from '../model/Todos.js';
import { AppError } from '../utils/appError.js';

const validateObjectId = (id, entityName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(`ID ${entityName} không hợp lệ`, 400);
    }
};

const ownerFilter = (user) => (user.role === 'admin' ? {} : { user: user._id });

export const getAll = async (user) => {
    return Todo.find(ownerFilter(user)).sort({ createdAt: -1 }).select('-__v').lean().exec();
};

export const getById = async (id, user) => {
    validateObjectId(id, 'Todo');
    const todo = await Todo.findOne({ _id: id, ...ownerFilter(user) }).select('-__v').lean().exec();
    if (!todo) throw new AppError('Không tìm thấy Todo', 404);
    return todo;
};

export const create = async (data, user) => {
    const { title, completed } = data;
    const todo = await Todo.create({ title, completed, user: user._id });
    return todo.toObject({ versionKey: false });
};

export const update = async (id, data, user) => {
    validateObjectId(id, 'Todo');

    const { title, completed } = data;
    const todo = await Todo.findOneAndUpdate(
        { _id: id, ...ownerFilter(user) },
        { $set: { title, completed } },
        { returnDocument: 'after', runValidators: true }
    ).select('-__v').lean().exec();
    if (!todo) throw new AppError('Không tìm thấy Todo để cập nhật', 404);
    return todo;
};

export const remove = async (id, user) => {
    validateObjectId(id, 'Todo');
    const todo = await Todo.findOneAndDelete({ _id: id, ...ownerFilter(user) }).select('-__v').lean().exec();
    if (!todo) throw new AppError('Không tìm thấy Todo để xóa', 404);
    return todo;
};
