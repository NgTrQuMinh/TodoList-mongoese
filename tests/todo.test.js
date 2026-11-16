import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/model/User.js';
import { connectTestDB, clearTestDB, closeTestDB } from './helpers/testDb.js';

beforeAll(connectTestDB);
afterAll(closeTestDB);
beforeEach(clearTestDB);

const createUser = async (email, role = 'user') => {
    const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'User', email, password: 'secret1' });

    if (role !== 'user') {
        await User.updateOne({ email }, { role });
        const login = await request(app)
            .post('/api/v1/auth/login')
            .send({ email, password: 'secret1' });
        return login.body.data.token;
    }
    return res.body.data.token;
};

const auth = (token) => ({ Authorization: `Bearer ${token}` });

describe('Todos + Auth', () => {
    it('tạo todo không token -> 401', async () => {
        const res = await request(app).post('/api/v1/todos').send({ title: 'x' });
        expect(res.status).toBe(401);
    });

    it('tạo todo có token -> 201', async () => {
        const token = await createUser('u1@example.com');
        const res = await request(app)
            .post('/api/v1/todos')
            .set(auth(token))
            .send({ title: 'hoc bai' });
        expect(res.status).toBe(201);
        expect(res.body.data.title).toBe('hoc bai');
        expect(res.body.data.user).toBeTruthy();
    });

    it('user chỉ thấy todo của mình', async () => {
        const token1 = await createUser('u1@example.com');
        const token2 = await createUser('u2@example.com');

        await request(app).post('/api/v1/todos').set(auth(token1)).send({ title: 'của u1' });

        const list1 = await request(app).get('/api/v1/todos').set(auth(token1));
        const list2 = await request(app).get('/api/v1/todos').set(auth(token2));

        expect(list1.body.data).toHaveLength(1);
        expect(list2.body.data).toHaveLength(0);
    });

    it('user không xem/sửa/xóa được todo người khác', async () => {
        const token1 = await createUser('u1@example.com');
        const token2 = await createUser('u2@example.com');

        const created = await request(app)
            .post('/api/v1/todos')
            .set(auth(token1))
            .send({ title: 'của u1' });
        const id = created.body.data._id;

        expect((await request(app).get(`/api/v1/todos/${id}`).set(auth(token2))).status).toBe(404);
        expect((await request(app).patch(`/api/v1/todos/${id}`).set(auth(token2)).send({ completed: true })).status).toBe(404);
        expect((await request(app).delete(`/api/v1/todos/${id}`).set(auth(token2))).status).toBe(404);
    });

    it('admin thấy được todo của mọi user', async () => {
        const token1 = await createUser('u1@example.com');
        const adminToken = await createUser('admin@example.com', 'admin');

        await request(app).post('/api/v1/todos').set(auth(token1)).send({ title: 'của u1' });

        const res = await request(app).get('/api/v1/todos').set(auth(adminToken));
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
    });

    it('RBAC: user thường không vào được /users, admin thì được', async () => {
        const token = await createUser('u1@example.com');
        const adminToken = await createUser('admin@example.com', 'admin');

        expect((await request(app).get('/api/v1/users').set(auth(token))).status).toBe(403);

        const res = await request(app).get('/api/v1/users').set(auth(adminToken));
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });
});
