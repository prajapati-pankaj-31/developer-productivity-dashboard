import { z } from 'zod';

export const generateTasksSchema = z.object({
  prompt: z
    .string()
    .min(3, 'Prompt must be at least 3 characters long')
    .max(500, 'Prompt must not exceed 500 characters'),
  projectKey: z.string().optional(),
  projectName: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  priority: z.enum(['urgent', 'high', 'medium', 'low']).optional(),
});

export const generateRoadmapSchema = z.object({
  projectName: z
    .string()
    .min(2, 'Project name must be at least 2 characters long')
    .max(100, 'Project name must not exceed 100 characters'),
  concept: z
    .string()
    .min(5, 'Concept must be at least 5 characters long')
    .max(500, 'Concept must not exceed 500 characters'),
  techStack: z.array(z.string()).optional(),
});

export const standupSummarySchema = z.object({
  userName: z.string().optional(),
  userRole: z.string().optional(),
  tasks: z
    .array(
      z.object({
        title: z.string(),
        status: z.string(),
        projectName: z.string().optional(),
        priority: z.string().optional(),
      })
    )
    .optional(),
  focusHours: z.number().optional(),
  timeframe: z.enum(['daily', 'weekly']).optional(),
});

export const summarizeTaskSchema = z.object({
  title: z.string().min(2, 'Task title is required'),
  description: z.string().optional(),
  subtasks: z
    .array(
      z.object({
        title: z.string(),
        completed: z.boolean(),
      })
    )
    .optional(),
});

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1, 'Message content cannot be empty'),
      })
    )
    .min(1, 'At least one message is required'),
  context: z
    .object({
      userName: z.string().optional(),
      userRole: z.string().optional(),
      activeTasksCount: z.number().optional(),
      projectsCount: z.number().optional(),
      recentTasks: z.array(z.string()).optional(),
    })
    .optional(),
});

export type GenerateTasksInput = z.infer<typeof generateTasksSchema>;
export type GenerateRoadmapInput = z.infer<typeof generateRoadmapSchema>;
export type StandupSummaryInput = z.infer<typeof standupSummarySchema>;
export type SummarizeTaskInput = z.infer<typeof summarizeTaskSchema>;
export type ChatInput = z.infer<typeof chatSchema>;
