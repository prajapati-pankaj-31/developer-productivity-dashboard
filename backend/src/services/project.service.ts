import { db } from '../data/mock-data.js';
import { Project, User } from '../types/index.js';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/errors.js';
import {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectQueryParams,
} from '../validators/project.validator.js';
import { UserService } from './user.service.js';

export class ProjectService {
  public static getAllProjects(filters?: ProjectQueryParams): Project[] {
    let projects = db.getProjects();

    if (!filters) return projects;

    if (filters.status) {
      projects = projects.filter((p) => p.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.key.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.techStack.some((tech) => tech.toLowerCase().includes(q))
      );
    }

    return projects;
  }

  public static getProjectById(id: string): Project {
    const project = db.getProjectById(id);
    if (!project) {
      throw new NotFoundError(`Project with id '${id}' not found.`);
    }
    return project;
  }

  public static createProject(data: CreateProjectInput): Project {
    // Validate lead user exists
    const leadUser = UserService.getUserById(data.leadId);

    // Validate members exist
    const members: User[] = [leadUser];
    if (data.memberIds && data.memberIds.length > 0) {
      for (const mId of data.memberIds) {
        if (mId !== data.leadId && !members.some((m) => m.id === mId)) {
          const member = UserService.getUserById(mId);
          members.push(member);
        }
      }
    }

    // Check project key uniqueness
    const existingProjects = db.getProjects();
    if (existingProjects.some((p) => p.key.toUpperCase() === data.key.toUpperCase())) {
      throw new ConflictError(`Project with key '${data.key}' already exists.`);
    }

    const id = `proj-${data.key.toLowerCase()}`;
    const newProject: Project = {
      id,
      name: data.name,
      key: data.key.toUpperCase(),
      description: data.description,
      status: data.status,
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      deadline: data.deadline,
      repository: data.repository,
      techStack: data.techStack,
      lead: leadUser,
      members,
      color: data.color,
    };

    return db.addProject(newProject);
  }

  public static updateProject(id: string, data: UpdateProjectInput): Project {
    const project = this.getProjectById(id);
    const { leadId, memberIds, ...rest } = data;
    const updatePayload: Partial<Project> = { ...rest };

    if (data.key && data.key.toUpperCase() !== project.key) {
      const keyConflict = db
        .getProjects()
        .some((p) => p.id !== id && p.key.toUpperCase() === data.key!.toUpperCase());
      if (keyConflict) {
        throw new ConflictError(`Project with key '${data.key}' already exists.`);
      }
      updatePayload.key = data.key.toUpperCase();
    }

    if (leadId) {
      const leadUser = UserService.getUserById(leadId);
      updatePayload.lead = leadUser;
    }

    if (memberIds) {
      const members: User[] = [];
      for (const mId of memberIds) {
        members.push(UserService.getUserById(mId));
      }
      updatePayload.members = members;
    }

    const updated = db.updateProject(id, updatePayload);
    if (!updated) {
      throw new NotFoundError(`Project with id '${id}' not found.`);
    }
    return updated;
  }

  public static deleteProject(id: string): void {
    this.getProjectById(id);

    // Relational safety check: cannot delete project with associated tasks
    const associatedTasks = db.getTasks().filter((t) => t.projectId === id);
    if (associatedTasks.length > 0) {
      throw new BadRequestError(
        `Cannot delete project '${id}' because it has ${associatedTasks.length} associated task(s). Delete or reassign tasks first.`
      );
    }

    const deleted = db.deleteProject(id);
    if (!deleted) {
      throw new NotFoundError(`Project with id '${id}' not found.`);
    }
  }
}
