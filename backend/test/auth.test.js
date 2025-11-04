const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');

const app = express();
app.use(express.json());
app.use('/api/employee/auth', authRoutes);

describe('Auth Endpoints', () => {
  it('should return 400 on login with no data', async () => {
    const res = await request(app)
      .post('/api/employee/auth/login')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Please enter all fields');
  });
});
