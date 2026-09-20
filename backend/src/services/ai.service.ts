import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';
import {
  GenerateTasksInput,
  GenerateRoadmapInput,
  StandupSummaryInput,
  SummarizeTaskInput,
} from '../validators/ai.validator.js';

function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your-groq-api-key')) {
    return null;
  }
  try {
    return new Groq({ apiKey: apiKey.trim() });
  } catch {
    return null;
  }
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your-gemini-api-key')) {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch {
    return null;
  }
}

function extractJson<T>(rawText: string | null): T | null {
  if (!rawText) return null;
  try {
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/, '');
    }
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

export interface AIGeneratedTask {
  title: string;
  description: string;
  suggestedPriority: 'urgent' | 'high' | 'medium' | 'low';
  estimatedHours: number;
  tags: string[];
  subtasks: Array<{ title: string; completed: boolean }>;
}

export interface AIRoadmapMilestone {
  phase: string;
  title: string;
  duration: string;
  deliverables: string[];
}

export interface AIRoadmapResponse {
  projectName: string;
  description: string;
  suggestedTechStack: string[];
  milestones: AIRoadmapMilestone[];
  riskAssessment: string;
}

export interface AIStandupResponse {
  greeting: string;
  yesterday: string[];
  today: string[];
  blockers: string[];
  productivityScore: number;
  smartSuggestions: string[];
  formattedSlackText: string;
}

export interface AISummaryResponse {
  executiveSummary: string;
  keyPoints: string[];
  riskFactor: 'low' | 'medium' | 'high';
}

export class AIService {
  /**
   * Generates a technical sprint task with acceptance criteria & subtasks from a prompt
   */
  public static async generateTask(data: GenerateTasksInput): Promise<AIGeneratedTask> {
    // 1. Primary: Groq LPU Engine (Llama 3.3 70B Versatile)
    const groq = getGroqClient();
    if (groq) {
      try {
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert full-stack engineering lead and sprint planner. You MUST respond with valid JSON matching the exact schema: { "title": string, "description": string, "suggestedPriority": "urgent"|"high"|"medium"|"low", "estimatedHours": number, "tags": string[], "subtasks": [{ "title": string, "completed": false }] }',
            },
            {
              role: 'user',
              content: `Generate a structured sprint task for prompt: "${data.prompt}". Project: ${data.projectKey || 'General'}. Priority hint: ${data.priority || 'auto'}.`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });

        const content = completion.choices[0]?.message?.content;
        const parsed = extractJson<AIGeneratedTask>(content);
        if (parsed && parsed.title && Array.isArray(parsed.subtasks)) {
          return {
            title: parsed.title,
            description: parsed.description || `Implement ${parsed.title}`,
            suggestedPriority: parsed.suggestedPriority || 'medium',
            estimatedHours: Number(parsed.estimatedHours) || 4,
            tags: Array.isArray(parsed.tags) ? parsed.tags : ['Engineering', 'Feature'],
            subtasks: parsed.subtasks.map((st: any) => ({
              title: typeof st === 'string' ? st : st.title || 'Task item',
              completed: false,
            })),
          };
        }
      } catch (err) {
        console.warn('⚠️ [Groq API] Failed, checking secondary engine:', err);
      }
    }

    // 2. Secondary: Google Gemini API
    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `Generate a structured engineering sprint task JSON for this prompt: "${data.prompt}". Project: ${data.projectKey || 'General'}. Return JSON matching: { "title": string, "description": string, "suggestedPriority": "urgent"|"high"|"medium"|"low", "estimatedHours": number, "tags": string[], "subtasks": [{ "title": string, "completed": false }] }`,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed.title && Array.isArray(parsed.subtasks)) {
            return {
              title: parsed.title,
              description: parsed.description || `Implement ${parsed.title}`,
              suggestedPriority: parsed.suggestedPriority || 'medium',
              estimatedHours: Number(parsed.estimatedHours) || 4,
              tags: Array.isArray(parsed.tags) ? parsed.tags : ['Engineering'],
              subtasks: parsed.subtasks.map((st: any) => ({
                title: typeof st === 'string' ? st : st.title || 'Task item',
                completed: false,
              })),
            };
          }
        }
      } catch (err) {
        console.warn('⚠️ [Gemini API] Fallback to smart heuristic engine:', err);
      }
    }

    // 3. Fallback: Built-in contextual heuristic engine
    const promptLower = data.prompt.toLowerCase();

    let priority: 'urgent' | 'high' | 'medium' | 'low' = data.priority || 'medium';
    if (promptLower.includes('bug') || promptLower.includes('fix') || promptLower.includes('crash') || promptLower.includes('security') || promptLower.includes('auth')) {
      priority = 'high';
    } else if (promptLower.includes('urgent') || promptLower.includes('critical') || promptLower.includes('down')) {
      priority = 'urgent';
    }

    let hours = 4;
    if (promptLower.includes('refactor') || promptLower.includes('architecture') || promptLower.includes('migration') || promptLower.includes('payment')) {
      hours = 8;
    } else if (promptLower.includes('button') || promptLower.includes('typo') || promptLower.includes('color') || promptLower.includes('icon')) {
      hours = 2;
    }

    const tags: string[] = [];
    if (promptLower.includes('api') || promptLower.includes('backend') || promptLower.includes('endpoint') || promptLower.includes('webhook') || promptLower.includes('gateway')) tags.push('Backend', 'REST API');
    if (promptLower.includes('auth') || promptLower.includes('jwt') || promptLower.includes('login') || promptLower.includes('security')) tags.push('Security', 'Authentication');
    if (promptLower.includes('payment') || promptLower.includes('stripe') || promptLower.includes('checkout') || promptLower.includes('billing')) tags.push('Backend', 'Payments');
    if (promptLower.includes('ui') || promptLower.includes('frontend') || promptLower.includes('modal') || promptLower.includes('css')) tags.push('Frontend', 'UI/UX');
    if (promptLower.includes('database') || promptLower.includes('postgres') || promptLower.includes('prisma') || promptLower.includes('schema')) tags.push('Database', 'Prisma');
    if (promptLower.includes('docker') || promptLower.includes('ci') || promptLower.includes('deploy') || promptLower.includes('k8s')) tags.push('DevOps', 'CI/CD');
    if (tags.length === 0) tags.push('Engineering', 'Sprint');

    let title = data.prompt.trim();
    if (!title.match(/^(build|implement|refactor|create|fix|add|optimize|integrate|setup)/i)) {
      title = `Implement ${title}`;
    }
    title = title.charAt(0).toUpperCase() + title.slice(1);

    const subtasks = [
      { title: `Design technical schema and interface contract for ${data.prompt.slice(0, 30)}`, completed: false },
      { title: `Implement core logic with error boundary & validation handling`, completed: false },
      { title: `Write unit and integration tests covering edge cases`, completed: false },
      { title: `Code review and documentation update`, completed: false },
    ];

    if (promptLower.includes('auth') || promptLower.includes('login')) {
      subtasks[1] = { title: `Implement JWT verification and token expiration middleware`, completed: false };
      subtasks[2] = { title: `Add bcrypt password salting & rate-limiting guards`, completed: false };
    } else if (promptLower.includes('payment') || promptLower.includes('stripe')) {
      subtasks[1] = { title: `Create webhook handler with idempotent event processing`, completed: false };
      subtasks[2] = { title: `Test checkout session redirection with sandbox card credentials`, completed: false };
    }

    const description = `### 🎯 Objective\nImplement robust functionality for **${title}** with full production reliability.\n\n### 📋 Acceptance Criteria\n- Clean TypeScript types and API contracts.\n- Centralized error handling and schema validation.\n- Zero regressions in existing sprint modules.\n- Complete responsive UI states with dark mode support.`;

    return {
      title,
      description,
      suggestedPriority: priority,
      estimatedHours: hours,
      tags: Array.from(new Set(tags)),
      subtasks,
    };
  }

  /**
   * Generates a multi-phase project roadmap & tech stack
   */
  public static async generateProjectRoadmap(data: GenerateRoadmapInput): Promise<AIRoadmapResponse> {
    // 1. Primary: Groq LPU Engine
    const groq = getGroqClient();
    if (groq) {
      try {
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'You are an executive software architect. You MUST output a valid JSON object matching: { "projectName": string, "description": string, "suggestedTechStack": string[], "milestones": [{ "phase": string, "title": string, "duration": string, "deliverables": string[] }], "riskAssessment": string }',
            },
            {
              role: 'user',
              content: `Generate engineering roadmap for project "${data.projectName}" with concept: "${data.concept}".`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });

        const content = completion.choices[0]?.message?.content;
        const parsed = extractJson<AIRoadmapResponse>(content);
        if (parsed && parsed.projectName && Array.isArray(parsed.milestones)) {
          return parsed;
        }
      } catch (err) {
        console.warn('⚠️ [Groq API] Roadmap failed, checking secondary:', err);
      }
    }

    // 2. Secondary: Google Gemini API
    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `Generate a software engineering roadmap JSON for project "${data.projectName}" with concept "${data.concept}". Return JSON matching: { "projectName": string, "description": string, "suggestedTechStack": string[], "milestones": [{ "phase": string, "title": string, "duration": string, "deliverables": string[] }], "riskAssessment": string }`,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed.projectName && Array.isArray(parsed.milestones)) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn('⚠️ [Gemini API] Roadmap fallback to smart engine:', err);
      }
    }

    // 3. Fallback heuristic roadmap
    const techStack = data.techStack && data.techStack.length > 0
      ? data.techStack
      : ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Express.js', 'PostgreSQL', 'Prisma'];

    const description = `Production-grade architecture for **${data.projectName}**. Built to address ${data.concept.toLowerCase()} with high throughput, modern UX, and real-time observability.`;

    const milestones: AIRoadmapMilestone[] = [
      {
        phase: 'Phase 1 - Foundation & Auth',
        title: 'Core Architecture & Data Modeling',
        duration: 'Sprint 1 (Week 1-2)',
        deliverables: [
          'PostgreSQL schema design with Prisma ORM',
          'JWT authentication with bcrypt password security',
          'Design system tokens and responsive dashboard shell',
        ],
      },
      {
        phase: 'Phase 2 - Feature Development',
        title: 'Core Business Logic & Workflows',
        duration: 'Sprint 2 (Week 3-4)',
        deliverables: [
          'REST API endpoints with Zod validation & centralized error middleware',
          'Kanban sprint boards with optimistic UI updates',
          'Real-time team directory synchronization',
        ],
      },
      {
        phase: 'Phase 3 - Optimization & Release',
        title: 'AI Enhancements, Testing & Cloud Deployment',
        duration: 'Sprint 3 (Week 5)',
        deliverables: [
          'AI-assisted sprint copilots and task generation',
          'End-to-end automated test suites (Vitest)',
          'Production containerization and cloud release',
        ],
      },
    ];

    return {
      projectName: data.projectName,
      description,
      suggestedTechStack: techStack,
      milestones,
      riskAssessment: 'Low to Moderate: Ensure rate-limiting and connection pooling are configured before heavy production loads.',
    };
  }

  /**
   * Generates a daily / weekly standup report based on current user tasks and focus metrics
   */
  public static async generateStandupSummary(data: StandupSummaryInput): Promise<AIStandupResponse> {
    // 1. Primary: Groq LPU Engine
    const groq = getGroqClient();
    if (groq) {
      try {
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'You are an agile engineering manager and AI sprint copilot. You MUST respond with a valid JSON object matching: { "greeting": string, "yesterday": string[], "today": string[], "blockers": string[], "productivityScore": number, "smartSuggestions": string[], "formattedSlackText": string }',
            },
            {
              role: 'user',
              content: `Generate a daily engineering standup report JSON for developer "${data.userName || 'Developer'}". Tasks: ${JSON.stringify(data.tasks || [])}. Deep focus hours: ${data.focusHours || 6.5}.`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });

        const content = completion.choices[0]?.message?.content;
        const parsed = extractJson<AIStandupResponse>(content);
        if (parsed && Array.isArray(parsed.yesterday) && Array.isArray(parsed.today)) {
          return parsed;
        }
      } catch (err) {
        console.warn('⚠️ [Groq API] Standup failed, checking secondary:', err);
      }
    }

    // 2. Secondary: Google Gemini API
    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `Generate a daily engineering standup report JSON for developer "${data.userName || 'Developer'}". Tasks: ${JSON.stringify(data.tasks || [])}. Deep focus hours: ${data.focusHours || 6.5}. Return JSON matching: { "greeting": string, "yesterday": string[], "today": string[], "blockers": string[], "productivityScore": number, "smartSuggestions": string[], "formattedSlackText": string }`,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (Array.isArray(parsed.yesterday) && Array.isArray(parsed.today)) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn('⚠️ [Gemini API] Standup fallback to smart engine:', err);
      }
    }

    // 3. Fallback heuristic standup
    const name = data.userName || 'Developer';
    const tasks = data.tasks || [];
    const focusHours = data.focusHours || 6.5;

    const completedTasks = tasks.filter((t) => t.status === 'completed' || t.status === 'done');
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress' || t.status === 'in_review');

    const yesterday = completedTasks.length > 0
      ? completedTasks.map((t) => `Completed "${t.title}" (${t.projectName || 'Core'})`)
      : [
          'Refactored API error handling and connection pool limits',
          'Reviewed team pull requests and optimized database query indexes',
        ];

    const today = inProgressTasks.length > 0
      ? inProgressTasks.map((t) => `Active development on "${t.title}" (${t.projectName || 'Core'})`)
      : [
          'Implementing Task 4 AI sprint assistant & roadmap generators',
          'Writing comprehensive Vitest integration test suites',
        ];

    const blockers = inProgressTasks.some((t) => t.priority === 'urgent')
      ? ['Awaiting peer code review on urgent auth rate limiting PR.']
      : ['No blocking issues. Velocity on track for current sprint milestone.'];

    const smartSuggestions = [
      `Great momentum! You logged ${focusHours}h of deep work. Keep high-focus blocks uninterrupted.`,
      inProgressTasks.length > 3
        ? '⚠️ You have more than 3 tasks in progress. Consider finishing active items before starting new ones to reduce context switching.'
        : '✨ Task WIP limit is optimal. Excellent task flow velocity.',
      'Schedule 15 minutes before EOD to review upcoming backlog tickets.',
    ];

    const formattedSlackText = `*🚀 Daily Standup - ${name}*\n\n*✅ Yesterday:* \n${yesterday.map((y) => `• ${y}`).join('\n')}\n\n*🎯 Today:* \n${today.map((t) => `• ${t}`).join('\n')}\n\n*🛑 Blockers:* \n${blockers.map((b) => `• ${b}`).join('\n')}\n\n*⚡ Focus Log:* ${focusHours} hours deep work logged.`;

    return {
      greeting: `Good morning, ${name}! Here is your automated sprint standup draft:`,
      yesterday,
      today,
      blockers,
      productivityScore: Math.min(Math.round((focusHours / 7) * 100), 98),
      smartSuggestions,
      formattedSlackText,
    };
  }

  /**
   * Summarizes a task or PR description into executive bullets
   */
  public static async summarizeTask(data: SummarizeTaskInput): Promise<AISummaryResponse> {
    const totalSubtasks = data.subtasks?.length || 0;
    const completedSubtasks = data.subtasks?.filter((st) => st.completed).length || 0;

    return {
      executiveSummary: `Sprint task "${data.title}" focuses on delivering core functionality with ${completedSubtasks}/${totalSubtasks} subtasks completed.`,
      keyPoints: [
        `Deliverable: ${data.title}`,
        data.description ? `Context: ${data.description.slice(0, 100)}...` : 'Standard engineering task',
        `Subtask Completion: ${Math.round((completedSubtasks / (totalSubtasks || 1)) * 100)}% progress`,
      ],
      riskFactor: completedSubtasks === totalSubtasks && totalSubtasks > 0 ? 'low' : 'medium',
    };
  }
}
