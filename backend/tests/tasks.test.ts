import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/data/mock-data.js';

describe('Tasks API Endpoints (/api/v1/tasks)', () => {
  beforeEach(() => {
    db.reset();
  });

  it('GET /api/v1/tasks returns all tasks with count', async () => {
    const res = await request(app).get('/api/v1/tasks');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(5);
  });

  it('GET /api/v1/tasks?status=in_progress filters by status', async () => {
    const res = await request(app).get('/api/v1/tasks?status=in_progress');
    expect(res.status).toBe(200);
    expect(res.body.data.every((t: { status: string }) => t.status === 'in_progress')).toBe(true);
  });

  it('GET /api/v1/tasks?priority=urgent filters by priority', async () => {
    const res = await request(app).get('/api/v1/tasks?priority=urgent');
    expect(res.status).toBe(200);
    expect(res.body.data.every((t: { priority: string }) => t.priority === 'urgent')).toBe(true);
  });

  it('GET /api/v1/tasks?projectId=proj-saq filters by project', async () => {
    const res = await request(app).get('/api/v1/tasks?projectId=proj-saq');
    expect(res.status).toBe(200);
    expect(res.body.data.every((t: { projectId: string }) => t.projectId === 'proj-saq')).toBe(true);
  });

  it('GET /api/v1/tasks?search=algorithm filters by search keyword', async () => {
    const res = await request(app).get('/api/v1/tasks?search=algorithm');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].title.toLowerCase()).toContain('algorithm');
  });

  it('GET /api/v1/tasks/:id returns specific task', async () => {
    const res = await request(app).get('/api/v1/tasks/task-1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('task-1');
    expect(res.body.data.projectName).toBeDefined();
  });

  it('GET /api/v1/tasks/:id returns 404 for non-existent task', async () => {
    const res = await request(app).get('/api/v1/tasks/task-invalid-999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('RESOURCE_NOT_FOUND');
  });

  it('POST /api/v1/tasks creates new task with relational validation', async () => {
    const newTask = {
      title: 'Integrate WebSockets telemetry bridge',
      description: 'Stream live build and deployment metrics to active dashboard cards.',
      projectId: 'proj-dpd',
      assigneeId: 'usr-1',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2026-03-12',
      estimatedHours: 6,
      subtasks: [
        { title: 'Setup WebSocket server gateway', completed: false },
      ],
      tags: ['WebSockets', 'Telemetry', 'FullStack'],
    };

    const res = await request(app).post('/api/v1/tasks').send(newTask);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.projectName).toBe('Innovation Hacks Internship / Developer Productivity Dashboard');
    expect(res.body.data.assignee.name).toBe('Pankaj Prajapati');
  });

  it('POST /api/v1/tasks rejects invalid projectId', async () => {
    const invalidTask = {
      title: 'Task for ghost project',
      description: 'Should fail with 404',
      projectId: 'proj-ghost',
      assigneeId: 'usr-1',
      dueDate: '2026-03-12',
    };

    const res = await request(app).post('/api/v1/tasks').send(invalidTask);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('Project with id \'proj-ghost\' not found');
  });

  it('POST /api/v1/tasks rejects invalid assigneeId', async () => {
    const invalidTask = {
      title: 'Task for ghost assignee',
      description: 'Should fail with 404',
      projectId: 'proj-dpd',
      assigneeId: 'usr-ghost',
      dueDate: '2026-03-12',
    };

    const res = await request(app).post('/api/v1/tasks').send(invalidTask);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('User with id \'usr-ghost\' not found');
  });

  it('PATCH /api/v1/tasks/:id/status updates task status', async () => {
    const res = await request(app)
      .patch('/api/v1/tasks/task-1/status')
      .send({ status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('completed');

    // Verify task status persisted
    const getRes = await request(app).get('/api/v1/tasks/task-1');
    expect(getRes.body.data.status).toBe('completed');
  });

  it('PATCH /api/v1/tasks/:id/status rejects invalid status with 400 Bad Request', async () => {
    const res = await request(app)
      .patch('/api/v1/tasks/task-1/status')
      .send({ status: 'invalid_status_enum' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('DELETE /api/v1/tasks/:id removes task', async () => {
    const delRes = await request(app).delete('/api/v1/tasks/task-1');
    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);

    const getRes = await request(app).get('/api/v1/tasks/task-1');
    expect(getRes.status).toBe(404);
  });
});
