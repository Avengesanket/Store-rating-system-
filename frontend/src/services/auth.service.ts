import api from '../api/axios';
import type { LoginResponse, User } from '../types';

// We define the types for the payloads here locally or import them
interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  address: string;
}

export const authService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupPayload): Promise<User> => {
    // The backend endpoint for signup is POST /users
    const response = await api.post<User>('/users', data);
    return response.data;
  },
};