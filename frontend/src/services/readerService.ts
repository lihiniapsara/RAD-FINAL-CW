import apiClient from './apiClient';

export const getReaders = () => apiClient.get('/readers');
export const addReader = (readerData: any) => apiClient.post('/readers', readerData);
export const updateReader = (id: string, readerData: any) => apiClient.put(`/readers/${id}`, readerData);
export const deleteReader = (id: string) => apiClient.delete(`/readers/${id}`);