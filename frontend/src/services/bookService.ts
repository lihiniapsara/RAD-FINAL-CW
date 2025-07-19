import apiClient from './apiClient';

export const getBooks = () => apiClient.get('/books');
export const addBook = (bookData: any) => apiClient.post('/books', bookData);
export const updateBook = (id: string, bookData: any) => apiClient.put(`/books/${id}`, bookData);
export const deleteBook = (id: string) => apiClient.delete(`/books/${id}`);