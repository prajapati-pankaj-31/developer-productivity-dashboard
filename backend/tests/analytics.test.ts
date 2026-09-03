import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/data/mock-data.js';

describe('Analytics, Activities & Subtask Toggle Endpoints', () => {
  beforeEach(() => {
    db.reset();
  });

  it('GET /api/v1/analytics/metrics returns 4 KPI metrics', async () => {
    const res = await request(app).get('/api/v1/analytics/metrics');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(4);
    expect(res.body.data[0].label).toBe('Focus Score');
  });

  it('GET /api/v1/analytics/weekly returns 7 days of velocity data', async () => {
    const res = await request(app).get('/api/v1/analytics/weekly');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(7);
    expect(res.body.data[0].day).toBe('Monday');
  });

  it('GET /api/v1/analytics/overview returns aggregated overview summary', async () => {
    const res = await request(app).get('/api/v1/analytics/overview');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary.totalTasks).toBeGreaterThan(0);
    expect(res.body.data.summary.totalProjects).toBeGreaterThan(0);
  });

  it('GET /api/v1/activities returns live activity stream', async () => {
    const res = await request(app).get('/api/v1/activities');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(6);
  });

  it('POST /api/v1/activities creates a new engineering telemetry event', async () => {
    const newAct = {
      type: 'commit',
      title: 'Pushed commit to feature/dpd-analytics-api',
      description: 'Implemented analytics and activities controllers.',
      userId: 'usr-1',
      projectKey: 'DPD',
      badgeText: '1 commit',
    };
    const res = await request(app).post('/api/v1/activities').send(newAct);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(newAct.title);
    expect(res.body.data.user.name).toBe('Pankaj Prajapati');
  });

  it('PATCH /api/v1/tasks/:id/subtasks/:subtaskId/toggle toggles subtask completion', async () => {
    // task-1 has sub-3 which is false initially
    const res = await request(app).patch('/api/v1/tasks/task-1/subtasks/sub-3/toggle');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const sub3 = res.body.data.subtasks.find((st: { id: string }) => st.id === 'sub-3');
    expect(sub3.completed).toBe(true);
    // Since sub-1, sub-2, and sub-3 are all true now, task auto-completes
    expect(res.body.data.status).toBe('completed');
  });
});
