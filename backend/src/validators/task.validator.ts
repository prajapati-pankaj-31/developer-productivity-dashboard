import { z } from 'zod';

export const taskPriorityEnum = z.enum(['urgent', 'high', 'medium', 'low'], {
  errorMap: () => ({
    message: "Invalid priority. Allowed values: 'urgent', 'high', 'medium', 'low'",
  }),
});

export const taskStatusEnum = z.enum(['backlog', 'in_progress', 'in_review', 'completed'], {
  errorMap: () => ({
    message: "Invalid task status. Allowed values: 'backlog', 'in_progress', 'in_review', 'completed'",
  }),
});

export const subtaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, 'Subtask title cannot be empty'),
  completed: z.boolean().default(false),
});

export const createTaskSchema = z.object({
  title: z.string({ required_error: 'Task title is required' }).trim().min(3, 'Title must be at least 3 characters').max(150),
  description: z.string({ required_error: 'Task description is required' }).trim().min(5, 'Description must be at least 5 characters'),
  projectId: z.string({ required_error: 'projectId is required' }),
  assigneeId: z.string({ required_error: 'assigneeId is required' }),
  priority: taskPriorityEnum.default('medium'),
  status: taskStatusEnum.default('backlog'),
  dueDate: z.string({ required_error: 'dueDate is required' }),
  estimatedHours: z.number().min(0.5, 'Estimated hours must be at least 0.5').default(4),
  loggedHours: z.number().min(0).optional().default(0),
  subtasks: z.array(subtaskSchema).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  branchName: z.string().optional(),
  prNumber: z.number().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(3).max(150).optional(),
  description: z.string().trim().min(5).optional(),
  projectId: z.string().optional(),
  assigneeId: z.string().optional(),
  priority: taskPriorityEnum.optional(),
  status: taskStatusEnum.optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().min(0.5).optional(),
  loggedHours: z.number().min(0).optional(),
  subtasks: z.array(subtaskSchema).optional(),
  tags: z.array(z.string()).optional(),
  branchName: z.string().optional(),
  prNumber: z.number().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const updateTaskStatusSchema = z.object({
  status: taskStatusEnum,
});

export const taskQuerySchema = z.object({
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  projectId: z.string().trim().optional(),
  search: z.string().trim().optional(),
  assigneeId: z.string().trim().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type TaskQueryParams = z.infer<typeof taskQuerySchema>;
