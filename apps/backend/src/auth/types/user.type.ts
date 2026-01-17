import type { Role } from '@prisma/client';

export type User = {
  id: string;
  email: string;
  role: Role;
};
