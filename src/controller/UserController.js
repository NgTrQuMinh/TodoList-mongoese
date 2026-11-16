import * as AuthServices from '../services/AuthServices.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/sendResponse.js';

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await AuthServices.getAllUsers();
    return sendResponse(res, 200, users, 'Lấy danh sách người dùng thành công');
});
