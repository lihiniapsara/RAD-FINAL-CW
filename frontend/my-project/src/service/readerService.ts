import apiClient from './apiClient';
import type { Reader } from '../models/Readers';

export const getReaders = async (): Promise<Reader[]> => {
    const response = await apiClient.get('/readers');
    return response.data;
};

export const addReader = async (reader: Omit<Reader, '_id'>): Promise<Reader> => {
    const response = await apiClient.post('/readers', reader);
    return response.data;
};

export const updateReader = async (id: string, reader: Partial<Reader>): Promise<Reader> => {
    const response = await apiClient.put(`/readers/${id}`, reader);
    return response.data;
};

export const deleteReader = async (id: string): Promise<void> => {
    await apiClient.delete(`/readers/${id}`);
};