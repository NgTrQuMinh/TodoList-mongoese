import * as AuthServices from '../services/AuthServices.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/sendResponse.js';

export const register = asyncHandler(async (req, res) => {
    const result = await AuthServices.register(req.body);
    return sendResponse(res, 201, result, 'Đăng ký thành công');
});

export const login = asyncHandler(async (req, res) => {
    const result = await AuthServices.login(req.body);
    return sendResponse(res, 200, result, 'Đăng nhập thành công');
});

export const getMe = asyncHandler(async (req, res) => {
    const user = await AuthServices.getMe(req.user._id);
    return sendResponse(res, 200, user, 'Lấy thông tin người dùng thành công');
});
