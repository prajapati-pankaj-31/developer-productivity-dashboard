import { prisma } from './prisma.js';
import { seed } from './seed.js';

export async function resetTestDatabase(): Promise<void> {
  await seed(prisma);
}

export { prisma };
