import api from '../api/axios';
import type { Rating } from '../types';

export const ratingsService = {
  upsert: async (storeId: string, value: number) => {
    const response = await api.post<Rating>('/ratings', { storeId, value });
    return response.data;
  },
  getByStore: async (storeId: string) => {
    const response = await api.get<Rating[]>(`/ratings/store/${storeId}`);
    return response.data;
  },
  getMyRating: async (storeId: string) => {
    const response = await api.get<Rating>(`/ratings/my-rating/${storeId}`);
    return response.data;
  },
  getTotalCount: async () => {
    const response = await api.get<number>('/ratings/count');
    return response.data;
  }
};