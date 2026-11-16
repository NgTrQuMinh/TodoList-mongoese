import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, closeTestDB } from './helpers/testDb.js';

const register = (body) => request(app).post('/api/v1/auth/register').send(body);
const login = (body) => request(app).post('/api/v1/auth/login').send(body);

beforeAll(connectTestDB);
afterAll(closeTestDB);
beforeEach(clearTestDB);

describe('Auth', () => {
    it('register -> 201, trả token, không lộ password', async () => {
        const res = await register({ name: 'A', email: 'a@example.com', password: 'secret1' });
        expect(res.status).toBe(201);
        expect(res.body.data.token).toBeTruthy();
        expect(res.body.data.user.password).toBeUndefined();
        expect(res.body.data.user.role).toBe('user');
    });

    it('register thiếu email -> 400', async () => {
        const res = await register({ name: 'A', password: 'secret1' });
        expect(res.status).toBe(400);
    });

    it('register email trùng -> 400', async () => {
        await register({ name: 'A', email: 'a@example.com', password: 'secret1' });
        const res = await register({ name: 'B', email: 'a@example.com', password: 'secret2' });
        expect(res.status).toBe(400);
    });

    it('login đúng -> 200 + token', async () => {
        await register({ name: 'A', email: 'a@example.com', password: 'secret1' });
        const res = await login({ email: 'a@example.com', password: 'secret1' });
        expect(res.status).toBe(200);
        expect(res.body.data.token).toBeTruthy();
    });

    it('login sai mật khẩu -> 401', async () => {
        await register({ name: 'A', email: 'a@example.com', password: 'secret1' });
        const res = await login({ email: 'a@example.com', password: 'wrong' });
        expect(res.status).toBe(401);
    });

    it('GET /me không token -> 401', async () => {
        const res = await request(app).get('/api/v1/auth/me');
        expect(res.status).toBe(401);
    });

    it('GET /me có token -> 200', async () => {
        const reg = await register({ name: 'A', email: 'a@example.com', password: 'secret1' });
        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${reg.body.data.token}`);
        expect(res.status).toBe(200);
        expect(res.body.data.email).toBe('a@example.com');
    });
});
