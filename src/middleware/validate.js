import { AppError } from '../utils/appError.js';

export const validate = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const message = error.details.map((detail) => detail.message).join(', ');
        return next(new AppError(message, 400));
    }

    req.body = value;
    next();
};
