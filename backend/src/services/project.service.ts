import { prisma } from '../db/prisma.js';
import { Project, User } from '../types/index.js';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/errors.js';
import {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectQueryParams,
} from '../validators/project.validator.js';
import { UserService } from './user.service.js';

const formatProject = (p: any): Project => {
  let techStack: string[] = [];
  try {
    techStack = typeof p.techStack === 'string' ? JSON.parse(p.techStack) : (p.techStack || []);
  } catch {
    techStack = [];
  }

  const tasks = p.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
  const progress =
    p.progress !== undefined && p.progress !== null
      ? p.progress
      : totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

  const members: User[] = (p.members || []).map((m: any) => m.user as User).filter(Boolean);

  return {
    id: p.id,
    name: p.name,
    key: p.key,
    description: p.description,
    status: p.status,
    progress,
    totalTasks,
    completedTasks,
    deadline: p.deadline,
    repository: p.repository,
    techStack,
    lead: p.lead as User,
    members,
    color: p.color,
  };
};

export class ProjectService {
  public static async getAllProjects(filters?: ProjectQueryParams): Promise<Project[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      const q = filters.search;
      where.OR = [
        { name: { contains: q } },
        { key: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        lead: true,
        members: {
          include: { user: true },
        },
        tasks: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return projects.map(formatProject);
  }

  public static async getProjectById(id: string): Promise<Project> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        lead: true,
        members: {
          include: { user: true },
        },
        tasks: true,
      },
    });

    if (!project) {
      throw new NotFoundError(`Project with id '${id}' not found.`);
    }

    return formatProject(project);
  }

  public static async createProject(data: CreateProjectInput): Promise<Project> {
    // Validate lead user exists
    const leadUser = await UserService.getUserById(data.leadId);

    // Check project key uniqueness
    const existing = await prisma.project.findUnique({
      where: { key: data.key.toUpperCase() },
    });
    if (existing) {
      throw new ConflictError(`Project with key '${data.key}' already exists.`);
    }

    const id = `proj-${data.key.toLowerCase()}`;
    const techStackJson = JSON.stringify(data.techStack || []);

    const createdProject = await prisma.project.create({
      data: {
        id,
        name: data.name,
        key: data.key.toUpperCase(),
        description: data.description,
        status: data.status,
        progress: 0,
        deadline: data.deadline,
        repository: data.repository,
        techStack: techStackJson,
        leadId: leadUser.id,
        color: data.color,
      },
    });

    // Add lead as member
    const memberIds = new Set<string>([leadUser.id]);
    if (data.memberIds && data.memberIds.length > 0) {
      for (const mId of data.memberIds) {
        await UserService.getUserById(mId); // ensure member user exists
        memberIds.add(mId);
      }
    }

    for (const mId of Array.from(memberIds)) {
      await prisma.projectMember.create({
        data: {
          projectId: createdProject.id,
          userId: mId,
          role: mId === leadUser.id ? 'lead' : 'developer',
        },
      });
    }

    return this.getProjectById(createdProject.id);
  }

  public static async updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
    const project = await this.getProjectById(id);
    const { leadId, memberIds, ...rest } = data;
    const updateData: any = { ...rest };

    if (data.key && data.key.toUpperCase() !== project.key) {
      const keyConflict = await prisma.project.findFirst({
        where: {
          key: data.key.toUpperCase(),
          NOT: { id },
        },
      });
      if (keyConflict) {
        throw new ConflictError(`Project with key '${data.key}' already exists.`);
      }
      updateData.key = data.key.toUpperCase();
    }

    if (data.techStack) {
      updateData.techStack = JSON.stringify(data.techStack);
    }

    if (leadId) {
      await UserService.getUserById(leadId);
      updateData.leadId = leadId;
    }

    await prisma.project.update({
      where: { id },
      data: updateData,
    });

    if (memberIds) {
      // Re-sync project members
      await prisma.projectMember.deleteMany({ where: { projectId: id } });

      const currentLeadId = leadId || project.lead.id;
      const allMembers = new Set<string>([currentLeadId, ...memberIds]);

      for (const mId of Array.from(allMembers)) {
        await UserService.getUserById(mId);
        await prisma.projectMember.create({
          data: {
            projectId: id,
            userId: mId,
            role: mId === currentLeadId ? 'lead' : 'developer',
          },
        });
      }
    }

    return this.getProjectById(id);
  }

  public static async deleteProject(id: string): Promise<void> {
    await this.getProjectById(id);

    // Relational safety check: cannot delete project with associated tasks
    const activeTasksCount = await prisma.task.count({
      where: { projectId: id },
    });
    if (activeTasksCount > 0) {
      throw new BadRequestError(
        `Cannot delete project '${id}' because it has ${activeTasksCount} associated task(s). Delete or reassign tasks first.`
      );
    }

    await prisma.project.delete({
      where: { id },
    });
  }
}
