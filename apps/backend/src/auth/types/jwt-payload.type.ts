import type { Role } from '@prisma/client';

export type JwtPayload = {
  sub: string; // User ID
  email: string;
  role: Role;
  iat?: number; // Issued at
  exp?: number; // Expiration
};
