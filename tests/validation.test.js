import { describe, it, expect } from 'vitest';
import { createTodoSchema, updateTodoSchema } from '../src/validators/todo.validation.js';
import { registerSchema } from '../src/validators/auth.validation.js';

const opts = { abortEarly: false, stripUnknown: true };

describe('Todo validators', () => {
    it('create: trim title, default completed=false, strip field lạ', () => {
        const { value, error } = createTodoSchema.validate({ title: '  hoc bai  ', foo: 'bar' }, opts);
        expect(error).toBeUndefined();
        expect(value).toEqual({ title: 'hoc bai', completed: false });
    });

    it('create: thiếu title -> lỗi', () => {
        const { error } = createTodoSchema.validate({}, opts);
        expect(error).toBeTruthy();
    });

    it('update: object rỗng -> lỗi', () => {
        const { error } = updateTodoSchema.validate({}, opts);
        expect(error).toBeTruthy();
    });

    it('update: chỉ field lạ -> lỗi sau khi strip', () => {
        const { error } = updateTodoSchema.validate({ foo: 1 }, opts);
        expect(error).toBeTruthy();
    });

    it('update: completed hợp lệ', () => {
        const { value, error } = updateTodoSchema.validate({ completed: true }, opts);
        expect(error).toBeUndefined();
        expect(value).toEqual({ completed: true });
    });
});

describe('Auth validators', () => {
    it('register: email sai định dạng -> lỗi', () => {
        const { error } = registerSchema.validate(
            { name: 'A', email: 'not-an-email', password: 'secret1' },
            opts
        );
        expect(error).toBeTruthy();
    });

    it('register: password ngắn -> lỗi', () => {
        const { error } = registerSchema.validate(
            { name: 'A', email: 'a@example.com', password: '123' },
            opts
        );
        expect(error).toBeTruthy();
    });
});
