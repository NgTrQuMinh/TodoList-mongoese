import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import { AppError } from '../utils/appError.js';

const signToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

const sanitizeUser = (user) => {
    const obj = user.toObject ? user.toObject({ versionKey: false }) : { ...user };
    delete obj.password;
    return obj;
};

export const register = async (data) => {
    const { name, email, password } = data;

    const existed = await User.findOne({ email });
    if (existed) throw new AppError('Email đã được sử dụng', 400);

    const user = await User.create({ name, email, password });
    return { user: sanitizeUser(user), token: signToken(user) };
};

export const login = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Email hoặc mật khẩu không đúng', 401);
    }

    return { user: sanitizeUser(user), token: signToken(user) };
};

export const getMe = async (id) => {
    const user = await User.findById(id).select('-__v');
    if (!user) throw new AppError('Không tìm thấy người dùng', 404);
    return user;
};

export const getAllUsers = async () => {
    return User.find().select('-__v').lean().exec();
};
