import { AppError } from '../utils/appError.js';

export const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return next(new AppError('Bạn không có quyền truy cập', 403));
    }
    next();
};
