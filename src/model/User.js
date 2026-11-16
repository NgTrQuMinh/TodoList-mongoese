import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Vui lòng nhập tên'],
            trim: true,
            maxlength: [100, 'Tên tối đa 100 ký tự'],
        },
        email: {
            type: String,
            required: [true, 'Vui lòng nhập email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
        },
        password: {
            type: String,
            required: [true, 'Vui lòng nhập mật khẩu'],
            minlength: [6, 'Mật khẩu tối thiểu 6 ký tự'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true }
);

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
