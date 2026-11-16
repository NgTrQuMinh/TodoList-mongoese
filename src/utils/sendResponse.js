export const sendResponse = (res, status, data, message = 'Thành công') => {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
};