import api from '../api/axios';
import type { Store } from '../types';

export const storesService = {
  getAll: async (search?: { name?: string; address?: string }) => {
    const params = new URLSearchParams();
    if (search?.name) params.append('name', search.name);
    if (search?.address) params.append('address', search.address);

    const response = await api.get<Store[]>(`/stores?${params.toString()}`);
    return response.data;
  },

  create: async (data: { name: string; address: string; email: string; ownerId: string }) => {
    const response = await api.post<Store>('/stores', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Store>) => {
    const response = await api.patch<Store>(`/stores/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/stores/${id}`);
  }
};