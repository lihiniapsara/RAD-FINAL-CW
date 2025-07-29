import apiClient from './apiClient';
import type { BorrowBook } from '../models/BorrowBook';

export const getLendings = async (): Promise<BorrowBook[]> => {
    const response = await apiClient.get('/lendings');
    return response.data;
};

export const lendBook = async (readerId: string, bookId: string): Promise<BorrowBook> => {
    const response = await apiClient.post('/lendings/lend', { readerId, bookId });
    return response.data;
};

export const returnBook = async (id: string): Promise<BorrowBook> => {
    const response = await apiClient.put(`/lendings/return/${id}`);
    return response.data;
};

export const getLendingsByReader = async (readerId: string): Promise<BorrowBook[]> => {
    const response = await apiClient.get(`/lendings/reader/${readerId}`);
    return response.data;
};

export const getLendingsByBook = async (bookId: string): Promise<BorrowBook[]> => {
    const response = await apiClient.get(`/lendings/book/${bookId}`);
    return response.data;
};

export const sendOverdueNotifications = async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/notifications/send-overdue-notifications');
    return response.data;
};