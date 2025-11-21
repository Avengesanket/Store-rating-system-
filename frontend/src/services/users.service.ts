import api from '../api/axios';
import type { User } from '../types';

export const usersService = {
  getAll: async (filters?: { role?: string; name?: string; email?: string }) => {

    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.name) params.append('name', filters.name);
    if (filters?.email) params.append('email', filters.email);
    const response = await api.get<User[]>(`/users?${params.toString()}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },
  update: async (id: string, data: Partial<any>) => {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/users/${id}`);
  }
};