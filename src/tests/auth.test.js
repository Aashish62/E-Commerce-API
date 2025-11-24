
import request from 'supertest';
import app from '../app.js'; 
import models from '../models/index.js';

const { sequelize, User } = models;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth', () => {
  test('signup and login', async () => {
    const signupRes = await request(app).post('/api/auth/signup').send({
      email: 'test@example.com',
      password: 'password',
      name: 'Test User'
    });
    expect(signupRes.statusCode).toBe(201);
    expect(signupRes.body.token).toBeDefined();

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password'
    });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });
});

