export default function errorHandler(err, req, res, next) {
    console.error(err);

    let status = err.statusCode || err.status || 500;
    let message = err.message || 'Lỗi máy chủ';

    // 1. Lỗi sai kiểu dữ liệu của Mongoose (ví dụ: completed: "abc" hoặc ID sai định dạng)
    if (err.name === 'CastError') {
        status = 400;
        message = `Giá trị không hợp lệ cho trường '${err.path}': ${err.value}`;
    }

    // 2. Lỗi validate dữ liệu của Mongoose (thiếu trường required, sai enum, min/max...)
    if (err.name === 'ValidationError') {
        status = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(', ');
    }

    // 3. Lỗi trùng dữ liệu unique trong MongoDB (nếu có dùng unique: true)
    if (err.code === 11000) {
        status = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `Dữ liệu '${field}' đã tồn tại`;
    }

    res.status(status).json({
        success: false,
        message,
    });
}
