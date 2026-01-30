import api from './api';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@types/index';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await api.post<{ accessToken: string }>('/auth/refresh');
    return response.data;
  },
};
