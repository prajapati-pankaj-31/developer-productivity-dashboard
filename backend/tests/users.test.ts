import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/data/mock-data.js';

describe('Users API Endpoints (/api/v1/users)', () => {
  beforeEach(() => {
    db.reset();
  });

  it('GET /api/v1/users returns all users with count', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(5);
  });

  it('GET /api/v1/users/:id returns a specific user', async () => {
    const res = await request(app).get('/api/v1/users/usr-1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('usr-1');
    expect(res.body.data.name).toBe('Pankaj Prajapati');
  });

  it('GET /api/v1/users/:id returns 404 for non-existent user', async () => {
    const res = await request(app).get('/api/v1/users/non-existent-user');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('RESOURCE_NOT_FOUND');
  });

  it('POST /api/v1/users creates a new user', async () => {
    const newUser = {
      name: 'Ananya Sharma',
      role: 'ML & Data Engineer',
      status: 'flow',
      weeklyFocusGoalHours: 35,
    };
    const res = await request(app).post('/api/v1/users').send(newUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.name).toBe('Ananya Sharma');
    expect(res.body.data.initials).toBe('AS');
  });

  it('POST /api/v1/users rejects invalid input (missing role)', async () => {
    const invalidUser = {
      name: 'Incomplete User',
    };
    const res = await request(app).post('/api/v1/users').send(invalidUser);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('PATCH /api/v1/users/:id updates user fields', async () => {
    const updatePayload = {
      role: 'Staff AI Engineer',
      status: 'flow',
    };
    const res = await request(app).patch('/api/v1/users/usr-1').send(updatePayload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe('Staff AI Engineer');
  });

  it('PATCH /api/v1/users/:id rejects invalid status enum', async () => {
    const invalidPayload = {
      status: 'invalid_status_value',
    };
    const res = await request(app).patch('/api/v1/users/usr-1').send(invalidPayload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('DELETE /api/v1/users/:id deletes unassigned user', async () => {
    // Create an unassigned user
    const createRes = await request(app).post('/api/v1/users').send({
      name: 'Temporary User',
      role: 'QA Engineer',
    });
    const tempUserId = createRes.body.data.id;

    const delRes = await request(app).delete(`/api/v1/users/${tempUserId}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);

    // Verify user is gone
    const getRes = await request(app).get(`/api/v1/users/${tempUserId}`);
    expect(getRes.status).toBe(404);
  });

  it('DELETE /api/v1/users/:id prevents deletion of user with active tasks', async () => {
    // usr-1 is assigned to active tasks
    const res = await request(app).delete('/api/v1/users/usr-1');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('Cannot delete user');
  });
});
