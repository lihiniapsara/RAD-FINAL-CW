import type { Book } from '@/types/Books';
import apiClient from "./apiClient.ts";

export const getBooks = async (): Promise<Book[]> => {
    const response = await apiClient.get('/api/books');
    return response.data;
};

export const addBook = async (book: Omit<Book, '_id'>): Promise<Book> => {
    const response = await apiClient.post('/api/books', book);
    return response.data;
};

export const updateBook = async (id: string, book: Partial<Book>): Promise<Book> => {
    const response = await apiClient.put(`/api/books/${id}`, book);
    return response.data;
};

export const deleteBook = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/books/${id}`);
};