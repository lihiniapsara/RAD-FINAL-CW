import apiClient from './apiClient';
import type { User } from '../models/User';

export const login = async (email: string, password: string): Promise<{ user: User; accessToken: string }> => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const logout = async () => {
  await apiClient.post('/auth/logout', {}, { withCredentials: true });
};

export const signup = async (name: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/signup', { name, email, password });
    return response.data;
};