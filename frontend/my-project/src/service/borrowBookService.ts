import apiClient from './apiClient';
import type { BorrowBook } from '@/types/BorrowBook';
import type {Email} from "@/types/Email.ts";

export const getLendings = async (): Promise<BorrowBook[]> => {
    const response = await apiClient.get('/api/lendings'); // Updated to /api/lendings
    return response.data;
};

export const lendBook = async (readerId: string, bookId: string): Promise<BorrowBook> => {
    const response = await apiClient.post('/api/lendings/lend', { readerId, bookId }); // Updated to /api/lendings/lend
    return response.data;
};

export const returnBook = async (id: string): Promise<BorrowBook> => {
    const response = await apiClient.put(`/api/lendings/return/${id}`); // Updated to /api/lendings/return/:id
    return response.data;
};

export const sendOverdueNotifications = async (emailData: Email): Promise<{ notify: Email }> => {
    const response = await apiClient.post('/api/notifications' , emailData); // Updated to /api/notifications/send-overdue-notifications
    return response.data;
};