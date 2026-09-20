import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('AI REST Endpoints (/api/v1/ai)', () => {
  it('POST /api/v1/ai/generate-task generates structured task with subtasks & estimated hours', async () => {
    const res = await request(app)
      .post('/api/v1/ai/generate-task')
      .send({
        prompt: 'Build Stripe checkout payment flow with webhook validation',
        projectKey: 'DPD',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBeDefined();
    expect(res.body.data.estimatedHours).toBeGreaterThanOrEqual(1);
    expect(res.body.data.subtasks.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.tags)).toBe(true);
    expect(res.body.data.tags.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/ai/generate-roadmap generates multi-phase deliverables', async () => {
    const res = await request(app)
      .post('/api/v1/ai/generate-roadmap')
      .send({
        projectName: 'Developer Productivity Hub',
        concept: 'Real-time dashboard for developer velocity & focus tracking',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.projectName).toBe('Developer Productivity Hub');
    expect(res.body.data.milestones.length).toBeGreaterThanOrEqual(3);
  });

  it('POST /api/v1/ai/standup-summary creates formatted daily standup report', async () => {
    const res = await request(app)
      .post('/api/v1/ai/standup-summary')
      .send({
        userName: 'Pankaj Prajapati',
        focusHours: 7.5,
        tasks: [
          { title: 'Setup JWT Auth Gateway', status: 'completed', projectName: 'DPD' },
          { title: 'Implement AI Sprint Assistant', status: 'in_progress', projectName: 'DPD' },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.yesterday.length).toBeGreaterThan(0);
    expect(res.body.data.today.length).toBeGreaterThan(0);
    expect(typeof res.body.data.formattedSlackText).toBe('string');
    expect(res.body.data.formattedSlackText.length).toBeGreaterThan(10);
  });

  it('POST /api/v1/ai/summarize-task creates executive summary of task deliverable', async () => {
    const res = await request(app)
      .post('/api/v1/ai/summarize-task')
      .send({
        title: 'Redis Blacklist Token Invalidation',
        description: 'Configure distributed redis cache to track invalidated JWT tokens on user logout.',
        subtasks: [
          { title: 'Redis client setup', completed: true },
          { title: 'Middleware integration', completed: false },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.executiveSummary).toContain('Redis');
    expect(res.body.data.keyPoints.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/ai/chat generates conversational developer assistance', async () => {
    const res = await request(app)
      .post('/api/v1/ai/chat')
      .send({
        messages: [
          { role: 'user', content: 'How should I optimize PostgreSQL index queries for sprint tasks?' },
        ],
        context: {
          userName: 'Pankaj Prajapati',
          activeTasksCount: 4,
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reply).toBeDefined();
    expect(res.body.data.reply.length).toBeGreaterThan(10);
    expect(Array.isArray(res.body.data.suggestedActions)).toBe(true);
  });
});

