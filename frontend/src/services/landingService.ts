import apiClient from './apiClient';

export const getLendings = () => apiClient.get('/lendings');
export const addLending = (lendingData: any) => apiClient.post('/lendings', lendingData);
export const updateLending = (id: string, lendingData: any) => apiClient.put(`/lendings/${id}`, lendingData);
export const deleteLending = (id: string) => apiClient.delete(`/lendings/${id}`);