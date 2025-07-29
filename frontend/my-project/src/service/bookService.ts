import apiClient from './apiClient';
import type {Book} from '../models/Books';

export const getBooks = async (): Promise<Book[]> => {
    const response = await apiClient.get('/books');
    return response.data;
};

export const addBook = async (book: Omit<Book, '_id'>): Promise<Book> => {
    const response = await apiClient.post('/books', book);
    return response.data;
};

export const updateBook = async (id: string, book: Partial<Book>): Promise<Book> => {
    const response = await apiClient.put(`/books/${id}`, book);
    return response.data;
};

export const deleteBook = async (id: string): Promise<void> => {
    await apiClient.delete(`/books/${id}`);
};