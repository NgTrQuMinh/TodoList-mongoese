import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) throw new AppError('Chưa đăng nhập', 401);

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        throw new AppError('Token không hợp lệ hoặc đã hết hạn', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) throw new AppError('Người dùng không tồn tại', 401);

    req.user = user;
    next();
});
