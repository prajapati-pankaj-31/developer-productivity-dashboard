import { z } from 'zod';

export const projectStatusEnum = z.enum(['on_track', 'at_risk', 'delayed', 'completed'], {
  errorMap: () => ({
    message: "Invalid project status. Allowed values: 'on_track', 'at_risk', 'delayed', 'completed'",
  }),
});

export const createProjectSchema = z.object({
  name: z.string({ required_error: 'Project name is required' }).trim().min(2, 'Name must be at least 2 characters').max(120),
  key: z
    .string({ required_error: 'Project key is required' })
    .trim()
    .min(2, 'Key must be 2 to 6 characters')
    .max(6, 'Key must be 2 to 6 characters')
    .toUpperCase(),
  description: z.string({ required_error: 'Project description is required' }).trim().min(5, 'Description must be at least 5 characters'),
  status: projectStatusEnum.default('on_track'),
  deadline: z.string({ required_error: 'Deadline is required' }),
  repository: z.string().optional().default('https://github.com/prajapati-pankaj-31'),
  techStack: z.array(z.string()).min(1, 'At least one tech stack tag is required'),
  leadId: z.string({ required_error: 'Project leadId is required' }),
  memberIds: z.array(z.string()).optional(),
  color: z.string().optional().default('#6366f1'),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  key: z.string().trim().min(2).max(6).toUpperCase().optional(),
  description: z.string().trim().min(5).optional(),
  status: projectStatusEnum.optional(),
  deadline: z.string().optional(),
  repository: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  leadId: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
  progress: z.number().min(0).max(100).optional(),
  color: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const projectQuerySchema = z.object({
  status: projectStatusEnum.optional(),
  search: z.string().trim().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectQueryParams = z.infer<typeof projectQuerySchema>;
