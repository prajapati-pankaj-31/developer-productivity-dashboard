import { z } from 'zod';

export const userStatusEnum = z.enum(['flow', 'available', 'in_review', 'away'], {
  errorMap: () => ({
    message: "Invalid status. Allowed values: 'flow', 'available', 'in_review', 'away'",
  }),
});

export const createUserSchema = z.object({
  name: z.string({ required_error: 'User name is required' }).trim().min(2, 'Name must be at least 2 characters').max(100),
  role: z.string({ required_error: 'User role is required' }).trim().min(2, 'Role must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').optional(),
  status: userStatusEnum.default('available'),
  statusMessage: z.string().max(255).optional(),
  avatarUrl: z.string().optional(),
  weeklyFocusGoalHours: z.number().min(1).max(168).optional().default(35),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  role: z.string().trim().min(2).max(100).optional(),
  email: z.string().email().optional(),
  status: userStatusEnum.optional(),
  statusMessage: z.string().max(255).optional(),
  avatarUrl: z.string().optional(),
  weeklyFocusGoalHours: z.number().min(1).max(168).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
