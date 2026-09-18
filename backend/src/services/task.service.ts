import { prisma } from '../db/prisma.js';
import { Task, TaskPriority, TaskStatus, Subtask, User } from '../types/index.js';
import { NotFoundError } from '../utils/errors.js';
import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryParams,
} from '../validators/task.validator.js';
import { ProjectService } from './project.service.js';
import { UserService } from './user.service.js';

const syncProjectTaskCounts = async (projectId: string): Promise<void> => {
  const tasks = await prisma.task.findMany({
    where: { projectId },
    select: { status: true },
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  await prisma.project.update({
    where: { id: projectId },
    data: { progress },
  });
};

const formatTask = (t: any): Task => {
  let tags: string[] = [];
  try {
    tags = typeof t.tags === 'string' ? JSON.parse(t.tags) : (t.tags || []);
  } catch {
    tags = [];
  }

  const subtasks: Subtask[] = (t.subtasks || []).map((s: any) => ({
    id: s.id,
    title: s.title,
    completed: s.completed,
  }));

  return {
    id: t.id,
    title: t.title,
    description: t.description,
    projectId: t.projectId,
    projectName: t.project?.name || '',
    priority: t.priority as TaskPriority,
    status: t.status as TaskStatus,
    assignee: t.assignee as User,
    dueDate: t.dueDate,
    estimatedHours: t.estimatedHours,
    loggedHours: t.loggedHours,
    subtasks,
    tags,
    branchName: t.branchName || undefined,
    prNumber: t.prNumber || undefined,
    createdAt:
      t.createdAt instanceof Date
        ? t.createdAt.toISOString().split('T')[0]
        : String(t.createdAt).split('T')[0],
  };
};

export class TaskService {
  public static async getAllTasks(filters?: TaskQueryParams): Promise<Task[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters?.assigneeId) {
      where.assigneeId = filters.assigneeId;
    }

    if (filters?.search) {
      const q = filters.search;
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { branchName: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: true,
        assignee: true,
        subtasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map(formatTask);
  }

  public static async getTaskById(id: string): Promise<Task> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: true,
        subtasks: true,
      },
    });

    if (!task) {
      throw new NotFoundError(`Task with id '${id}' not found.`);
    }

    return formatTask(task);
  }

  public static async createTask(data: CreateTaskInput): Promise<Task> {
    // Relational validation: verify project and assignee exist
    await ProjectService.getProjectById(data.projectId);
    await UserService.getUserById(data.assigneeId);

    const id = `task-${Date.now()}`;
    const tagsJson = JSON.stringify(data.tags || []);

    const created = await prisma.task.create({
      data: {
        id,
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        priority: data.priority,
        status: data.status,
        assigneeId: data.assigneeId,
        dueDate: data.dueDate,
        estimatedHours: data.estimatedHours,
        loggedHours: data.loggedHours ?? 0,
        tags: tagsJson,
        branchName: data.branchName,
        prNumber: data.prNumber,
      },
    });

    // Create subtasks if provided
    if (data.subtasks && data.subtasks.length > 0) {
      for (let idx = 0; idx < data.subtasks.length; idx++) {
        const st = data.subtasks[idx];
        await prisma.subtask.create({
          data: {
            id: st.id || `sub-${id}-${idx + 1}`,
            title: st.title,
            completed: st.completed ?? false,
            taskId: created.id,
          },
        });
      }
    }

    await syncProjectTaskCounts(data.projectId);
    return this.getTaskById(created.id);
  }

  public static async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    const existing = await this.getTaskById(id);
    const { assigneeId, projectId, subtasks, tags, ...rest } = data;
    const updateData: any = { ...rest };

    let oldProjectId: string | undefined;

    if (projectId && projectId !== existing.projectId) {
      await ProjectService.getProjectById(projectId);
      oldProjectId = existing.projectId;
      updateData.projectId = projectId;
    }

    if (assigneeId && assigneeId !== existing.assignee.id) {
      await UserService.getUserById(assigneeId);
      updateData.assigneeId = assigneeId;
    }

    if (tags) {
      updateData.tags = JSON.stringify(tags);
    }

    await prisma.task.update({
      where: { id },
      data: updateData,
    });

    if (subtasks) {
      // Re-sync subtasks
      await prisma.subtask.deleteMany({ where: { taskId: id } });
      for (let idx = 0; idx < subtasks.length; idx++) {
        const st = subtasks[idx];
        await prisma.subtask.create({
          data: {
            id: st.id || `sub-${id}-${idx + 1}`,
            title: st.title,
            completed: st.completed ?? false,
            taskId: id,
          },
        });
      }
    }

    const currentProjectId = projectId || existing.projectId;
    await syncProjectTaskCounts(currentProjectId);
    if (oldProjectId) {
      await syncProjectTaskCounts(oldProjectId);
    }

    return this.getTaskById(id);
  }

  public static async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    await prisma.task.update({
      where: { id },
      data: { status },
    });

    await syncProjectTaskCounts(task.projectId);
    return this.getTaskById(id);
  }

  public static async toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const task = await this.getTaskById(taskId);
    const subtask = task.subtasks.find((st) => st.id === subtaskId);
    if (!subtask) {
      throw new NotFoundError(`Subtask with id '${subtaskId}' not found in task '${taskId}'.`);
    }

    await prisma.subtask.update({
      where: { id: subtaskId },
      data: { completed: !subtask.completed },
    });

    // Check if all subtasks completed
    const updatedSubtasks = await prisma.subtask.findMany({ where: { taskId } });
    const allCompleted =
      updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);

    let nextStatus = task.status;
    if (allCompleted && task.status !== 'completed') {
      nextStatus = 'completed';
    } else if (!allCompleted && task.status === 'completed') {
      nextStatus = 'in_progress';
    }

    if (nextStatus !== task.status) {
      await prisma.task.update({
        where: { id: taskId },
        data: { status: nextStatus },
      });
    }

    await syncProjectTaskCounts(task.projectId);
    return this.getTaskById(taskId);
  }

  public static async deleteTask(id: string): Promise<void> {
    const task = await this.getTaskById(id);

    await prisma.task.delete({
      where: { id },
    });

    await syncProjectTaskCounts(task.projectId);
  }
}
