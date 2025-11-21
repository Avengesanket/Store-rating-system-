export const UserRole = {
  ADMIN: 'admin',
  NORMAL_USER: 'normal_user',
  STORE_OWNER: 'store_owner',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  email: string;
  avgRating: number; 
  owner?: User;
}

export interface Rating {
  id: string;
  value: number;
  user?: User;
  store?: Store;
  createdAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}