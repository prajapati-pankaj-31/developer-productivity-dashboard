import {
  GenerateTasksInput,
  GenerateRoadmapInput,
  StandupSummaryInput,
  SummarizeTaskInput,
} from '../validators/ai.validator.js';

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
    const promptLower = data.prompt.toLowerCase();

    // Contextual heuristics mapping
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

    // Extract tags
    const tags: string[] = [];
    if (promptLower.includes('api') || promptLower.includes('backend') || promptLower.includes('endpoint') || promptLower.includes('webhook') || promptLower.includes('gateway')) tags.push('Backend', 'REST API');
    if (promptLower.includes('auth') || promptLower.includes('jwt') || promptLower.includes('login') || promptLower.includes('security')) tags.push('Security', 'Authentication');
    if (promptLower.includes('payment') || promptLower.includes('stripe') || promptLower.includes('checkout') || promptLower.includes('billing')) tags.push('Backend', 'Payments');
    if (promptLower.includes('ui') || promptLower.includes('frontend') || promptLower.includes('modal') || promptLower.includes('css')) tags.push('Frontend', 'UI/UX');
    if (promptLower.includes('database') || promptLower.includes('postgres') || promptLower.includes('prisma') || promptLower.includes('schema')) tags.push('Database', 'Prisma');
    if (promptLower.includes('docker') || promptLower.includes('ci') || promptLower.includes('deploy') || promptLower.includes('k8s')) tags.push('DevOps', 'CI/CD');
    if (tags.length === 0) tags.push('Engineering', 'Sprint');

    // Title formatting
    let title = data.prompt.trim();
    if (!title.match(/^(build|implement|refactor|create|fix|add|optimize|integrate|setup)/i)) {
      title = `Implement ${title}`;
    }
    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);

    // Subtasks generation
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
    const name = data.userName || 'Developer';
    const tasks = data.tasks || [];
    const focusHours = data.focusHours || 6.5;

    const completedTasks = tasks.filter((t) => t.status === 'completed' || t.status === 'done');
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress' || t.status === 'in_review');
    const backlogTasks = tasks.filter((t) => t.status === 'backlog');

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
