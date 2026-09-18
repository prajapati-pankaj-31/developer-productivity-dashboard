import { prisma } from '../db/prisma.js';
import { User } from '../types/index.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { CreateUserInput, UpdateUserInput } from '../validators/user.validator.js';

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export class UserService {
  public static async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return users as User[];
  }

  public static async getUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundError(`User with id '${id}' not found.`);
    }
    return user as User;
  }

  public static async createUser(data: CreateUserInput): Promise<User> {
    const initials = getInitials(data.name);
    const email =
      data.email ||
      `${data.name.toLowerCase().replace(/\s+/g, '.')}@devhub.io`;

    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      throw new BadRequestError(`User with email '${email}' already exists.`);
    }

    const newUser = await prisma.user.create({
      data: {
        id: `usr-${Date.now()}`,
        name: data.name,
        email,
        role: data.role,
        avatarUrl: data.avatarUrl || '/pankaj.jpg',
        initials,
        status: data.status,
        statusMessage: data.statusMessage,
        weeklyFocusGoalHours: data.weeklyFocusGoalHours ?? 35,
      },
    });

    return newUser as User;
  }

  public static async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.getUserById(id);

    if (data.email && data.email !== user.email) {
      const emailTaken = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id },
        },
      });
      if (emailTaken) {
        throw new BadRequestError(`Email '${data.email}' is already in use by another user.`);
      }
    }

    const updatePayload: any = { ...data };
    if (data.name) {
      updatePayload.initials = getInitials(data.name);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updatePayload,
    });

    return updated as User;
  }

  public static async deleteUser(id: string): Promise<void> {
    await this.getUserById(id);

    // Relational safety check: cannot delete user if assigned to active tasks
    const activeTasksCount = await prisma.task.count({
      where: {
        assigneeId: id,
        NOT: { status: 'completed' },
      },
    });

    if (activeTasksCount > 0) {
      throw new BadRequestError(
        `Cannot delete user '${id}' because they are currently assigned to ${activeTasksCount} active task(s). Reassign tasks before deleting.`
      );
    }

    // Relational safety check: cannot delete user if they lead any project
    const ledProjectsCount = await prisma.project.count({
      where: { leadId: id },
    });
    if (ledProjectsCount > 0) {
      throw new BadRequestError(
        `Cannot delete user '${id}' because they are the lead of ${ledProjectsCount} project(s). Reassign project leads before deleting.`
      );
    }

    await prisma.user.delete({
      where: { id },
    });
  }
}
