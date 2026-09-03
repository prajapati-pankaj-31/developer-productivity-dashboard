import { db } from '../data/mock-data.js';
import { Task, TaskStatus, Subtask } from '../types/index.js';
import { NotFoundError } from '../utils/errors.js';
import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryParams,
} from '../validators/task.validator.js';
import { ProjectService } from './project.service.js';
import { UserService } from './user.service.js';

const syncProjectTaskCounts = (projectId: string): void => {
  const project = db.getProjectById(projectId);
  if (!project) return;

  const projectTasks = db.getTasks().filter((t) => t.projectId === projectId);
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t) => t.status === 'completed').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  db.updateProject(projectId, {
    totalTasks,
    completedTasks,
    progress,
  });
};

export class TaskService {
  public static getAllTasks(filters?: TaskQueryParams): Task[] {
    let tasks = db.getTasks();

    if (!filters) return tasks;

    if (filters.status) {
      tasks = tasks.filter((t) => t.status === filters.status);
    }

    if (filters.priority) {
      tasks = tasks.filter((t) => t.priority === filters.priority);
    }

    if (filters.projectId) {
      tasks = tasks.filter((t) => t.projectId === filters.projectId);
    }

    if (filters.assigneeId) {
      tasks = tasks.filter((t) => t.assignee.id === filters.assigneeId);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          (t.branchName && t.branchName.toLowerCase().includes(q))
      );
    }

    return tasks;
  }

  public static getTaskById(id: string): Task {
    const task = db.getTaskById(id);
    if (!task) {
      throw new NotFoundError(`Task with id '${id}' not found.`);
    }
    return task;
  }

  public static createTask(data: CreateTaskInput): Task {
    // Relational validation: verify project exists
    const project = ProjectService.getProjectById(data.projectId);

    // Relational validation: verify assignee exists
    const assignee = UserService.getUserById(data.assigneeId);

    const id = `task-${Date.now()}`;
    const subtasks: Subtask[] = (data.subtasks || []).map((st, idx) => ({
      id: st.id || `sub-${id}-${idx + 1}`,
      title: st.title,
      completed: st.completed ?? false,
    }));

    const newTask: Task = {
      id,
      title: data.title,
      description: data.description,
      projectId: project.id,
      projectName: project.name,
      priority: data.priority,
      status: data.status,
      assignee,
      dueDate: data.dueDate,
      estimatedHours: data.estimatedHours,
      loggedHours: data.loggedHours ?? 0,
      subtasks,
      tags: data.tags || [],
      branchName: data.branchName,
      prNumber: data.prNumber,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const created = db.addTask(newTask);
    syncProjectTaskCounts(project.id);
    return created;
  }

  public static updateTask(id: string, data: UpdateTaskInput): Task {
    const existingTask = this.getTaskById(id);
    const { assigneeId, projectId, subtasks, ...rest } = data;
    const updatePayload: Partial<Task> = { ...rest };

    let oldProjectId: string | undefined;

    if (projectId && projectId !== existingTask.projectId) {
      const project = ProjectService.getProjectById(projectId);
      oldProjectId = existingTask.projectId;
      updatePayload.projectId = project.id;
      updatePayload.projectName = project.name;
    }

    if (assigneeId && assigneeId !== existingTask.assignee.id) {
      const assignee = UserService.getUserById(assigneeId);
      updatePayload.assignee = assignee;
    }

    if (subtasks) {
      updatePayload.subtasks = subtasks.map((st, idx) => ({
        id: st.id || `sub-${id}-${idx + 1}`,
        title: st.title,
        completed: st.completed ?? false,
      }));
    }

    const updated = db.updateTask(id, updatePayload);
    if (!updated) {
      throw new NotFoundError(`Task with id '${id}' not found.`);
    }

    syncProjectTaskCounts(updated.projectId);
    if (oldProjectId) {
      syncProjectTaskCounts(oldProjectId);
    }

    return updated;
  }

  public static updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    const updated = db.updateTask(id, { status });
    if (!updated) {
      throw new NotFoundError(`Task with id '${id}' not found.`);
    }

    syncProjectTaskCounts(task.projectId);
    return updated;
  }

  public static toggleSubtask(taskId: string, subtaskId: string): Task {
    const task = this.getTaskById(taskId);
    const subtaskIndex = task.subtasks.findIndex((st) => st.id === subtaskId);
    if (subtaskIndex === -1) {
      throw new NotFoundError(`Subtask with id '${subtaskId}' not found in task '${taskId}'.`);
    }

    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    const allCompleted =
      updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);

    let nextStatus = task.status;
    if (allCompleted && task.status !== 'completed') {
      nextStatus = 'completed';
    } else if (!allCompleted && task.status === 'completed') {
      nextStatus = 'in_progress';
    }

    const updated = db.updateTask(taskId, {
      subtasks: updatedSubtasks,
      status: nextStatus,
    });

    if (!updated) {
      throw new NotFoundError(`Task with id '${taskId}' not found.`);
    }

    syncProjectTaskCounts(task.projectId);
    return updated;
  }

  public static deleteTask(id: string): void {
    const task = this.getTaskById(id);
    const deleted = db.deleteTask(id);
    if (!deleted) {
      throw new NotFoundError(`Task with id '${id}' not found.`);
    }

    syncProjectTaskCounts(task.projectId);
  }
}
