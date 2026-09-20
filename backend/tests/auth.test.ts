import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Authentication API Endpoints (/api/v1/auth)', () => {
  const testEmail = `test.dev.${Date.now()}@devhub.io`;
  let authToken = '';

  it('POST /api/v1/auth/signup registers a new user with valid payload and returns JWT', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        name: 'Aarav Patel',
        email: testEmail,
        password: 'SecurePassword123!',
        role: 'Full Stack Engineer',
        weeklyFocusGoalHours: 40,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.token).toBeDefined();
    expect(typeof res.body.data.token).toBe('string');
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.body.data.user.name).toBe('Aarav Patel');
    expect(res.body.data.user.initials).toBe('AP');
    // Ensure sensitive fields are omitted
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('POST /api/v1/auth/signup rejects duplicate email with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        name: 'Duplicate User',
        email: testEmail,
        password: 'SecurePassword123!',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('RESOURCE_CONFLICT');
  });

  it('POST /api/v1/auth/signup rejects short password (< 6 chars) with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        name: 'Weak Pass User',
        email: 'weak.pass@devhub.io',
        password: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/auth/signup rejects invalid email format with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        name: 'Invalid Email User',
        email: 'not-an-email',
        password: 'SecurePassword123!',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/auth/login successfully logs in seeded user and returns JWT token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'pankaj.prajapati@devhub.io',
        password: 'DevPass123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('pankaj.prajapati@devhub.io');
    expect(res.body.data.user.name).toBe('Pankaj Prajapati');
    expect(res.body.data.user.passwordHash).toBeUndefined();

    authToken = res.body.data.token;
  });

  it('POST /api/v1/auth/login rejects wrong password with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'pankaj.prajapati@devhub.io',
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/v1/auth/login rejects non-existent email with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent.user.999@devhub.io',
        password: 'DevPass123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/v1/auth/me returns current user profile with valid Bearer token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('pankaj.prajapati@devhub.io');
    expect(res.body.data.name).toBe('Pankaj Prajapati');
  });

  it('GET /api/v1/auth/me returns 401 Unauthorized when Authorization header is missing', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/v1/auth/me returns 401 Unauthorized when token is invalid or corrupted', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid_tampered_jwt_token');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
