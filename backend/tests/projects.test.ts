import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/data/mock-data.js';

describe('Projects API Endpoints (/api/v1/projects)', () => {
  beforeEach(() => {
    db.reset();
  });

  it('GET /api/v1/projects returns all projects with count', async () => {
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(5);
  });

  it('GET /api/v1/projects?status=on_track filters projects by status', async () => {
    const res = await request(app).get('/api/v1/projects?status=on_track');
    expect(res.status).toBe(200);
    expect(res.body.data.every((p: { status: string }) => p.status === 'on_track')).toBe(true);
  });

  it('GET /api/v1/projects?search=appointment filters projects by keyword', async () => {
    const res = await request(app).get('/api/v1/projects?search=appointment');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].name).toContain('Appointment');
  });

  it('GET /api/v1/projects/:id returns single project', async () => {
    const res = await request(app).get('/api/v1/projects/proj-dpd');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('proj-dpd');
    expect(res.body.data.key).toBe('DPD');
  });

  it('GET /api/v1/projects/:id returns 404 for invalid project ID', async () => {
    const res = await request(app).get('/api/v1/projects/proj-invalid-id');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('RESOURCE_NOT_FOUND');
  });

  it('POST /api/v1/projects creates a new project with lead', async () => {
    const newProject = {
      name: 'AI Code Analysis Engine',
      key: 'ACE',
      description: 'AST-based static code analyzer evaluating developer velocity and bug hotspots.',
      status: 'on_track',
      deadline: '2026-06-30',
      techStack: ['Python', 'FastAPI', 'TreeSitter', 'TypeScript'],
      leadId: 'usr-1',
    };

    const res = await request(app).post('/api/v1/projects').send(newProject);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('proj-ace');
    expect(res.body.data.lead.name).toBe('Pankaj Prajapati');
  });

  it('POST /api/v1/projects rejects duplicate key', async () => {
    const duplicateProject = {
      name: 'Duplicate DPD Project',
      key: 'DPD',
      description: 'Test duplicate key conflict',
      deadline: '2026-06-30',
      techStack: ['React'],
      leadId: 'usr-1',
    };

    const res = await request(app).post('/api/v1/projects').send(duplicateProject);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('RESOURCE_CONFLICT');
  });

  it('POST /api/v1/projects rejects invalid leadId', async () => {
    const invalidLeadProject = {
      name: 'Orphan Project',
      key: 'ORP',
      description: 'Project with non-existent lead',
      deadline: '2026-06-30',
      techStack: ['React'],
      leadId: 'usr-non-existent',
    };

    const res = await request(app).post('/api/v1/projects').send(invalidLeadProject);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('PATCH /api/v1/projects/:id updates project', async () => {
    const res = await request(app).patch('/api/v1/projects/proj-dpd').send({
      progress: 95,
      status: 'completed',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.progress).toBe(95);
    expect(res.body.data.status).toBe('completed');
  });

  it('DELETE /api/v1/projects/:id rejects deletion of project with associated tasks', async () => {
    const res = await request(app).delete('/api/v1/projects/proj-dpd');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('associated task(s)');
  });
});
