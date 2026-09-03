import { db } from '../data/mock-data.js';
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
  public static getAllUsers(): User[] {
    return db.getUsers();
  }

  public static getUserById(id: string): User {
    const user = db.getUserById(id);
    if (!user) {
      throw new NotFoundError(`User with id '${id}' not found.`);
    }
    return user;
  }

  public static createUser(data: CreateUserInput): User {
    const existingUsers = db.getUsers();
    const id = `usr-${Date.now()}`;
    const initials = getInitials(data.name);
    const email =
      data.email ||
      `${data.name.toLowerCase().replace(/\s+/g, '.')}@devhub.io`;

    // Check duplicate email
    if (existingUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new BadRequestError(`User with email '${email}' already exists.`);
    }

    const newUser: User = {
      id,
      name: data.name,
      email,
      role: data.role,
      avatarUrl: data.avatarUrl || '/pankaj.jpg',
      initials,
      status: data.status,
      statusMessage: data.statusMessage,
      weeklyFocusGoalHours: data.weeklyFocusGoalHours ?? 35,
    };

    return db.addUser(newUser);
  }

  public static updateUser(id: string, data: UpdateUserInput): User {
    const user = this.getUserById(id);

    const updatePayload: Partial<User> = { ...data };
    if (data.name) {
      updatePayload.initials = getInitials(data.name);
    }

    if (data.email && data.email !== user.email) {
      const emailTaken = db.getUsers().some(
        (u) => u.id !== id && u.email.toLowerCase() === data.email!.toLowerCase()
      );
      if (emailTaken) {
        throw new BadRequestError(`Email '${data.email}' is already in use by another user.`);
      }
    }

    const updated = db.updateUser(id, updatePayload);
    if (!updated) {
      throw new NotFoundError(`User with id '${id}' not found.`);
    }
    return updated;
  }

  public static deleteUser(id: string): void {
    this.getUserById(id);

    // Relational safety check: cannot delete user if assigned to active tasks
    const activeAssignedTasks = db
      .getTasks()
      .filter((t) => t.assignee.id === id && t.status !== 'completed');

    if (activeAssignedTasks.length > 0) {
      throw new BadRequestError(
        `Cannot delete user '${id}' because they are currently assigned to ${activeAssignedTasks.length} active task(s). Reassign tasks before deleting.`
      );
    }

    const deleted = db.deleteUser(id);
    if (!deleted) {
      throw new NotFoundError(`User with id '${id}' not found.`);
    }
  }
}
