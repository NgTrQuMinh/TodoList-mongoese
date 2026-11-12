import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Vui lòng nhập tiêu đề công việc'],
            trim: true,
            maxlength: [200, 'Tiêu đề tối đa 200 ký tự'],
        },
        completed: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true
    }
);

const Todo = mongoose.model('Todo', TodoSchema);

export default Todo;