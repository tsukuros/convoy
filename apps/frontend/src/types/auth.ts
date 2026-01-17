export const Role = {
  VIEWER: 'VIEWER',
  OPERATOR: 'OPERATOR',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
};
