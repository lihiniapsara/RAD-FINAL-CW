import { Request, Response, NextFunction } from 'express';
import { Book } from '../models/Book';
import { APIError } from '../errors/APIError';

const currentTime = () =>
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: true });

//  Get all books
export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await Book.find();
        console.log(`[${currentTime()}] Fetched all books: ${books.length} records`);
        res.json(books);
    } catch (err) {
        console.error(`[${currentTime()}] Error fetching books:`, err);
        next(new APIError(500, 'Failed to fetch books'));
    }
};


//  Add new book
export const addBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, title, author, genre, language, quantity, available } = req.body;

        if (!id || !title || !author || !genre || !language || quantity == null) {
            console.log(`[${currentTime()}] Missing required fields`);
            return next(new APIError(400, 'All required fields must be provided'));
        }

        const newBook = new Book({
            id,
            title,
            author,
            genre,
            language,
            quantity,
            available: available ?? true,
        });

        const savedBook = await newBook.save();
        console.log(`[${currentTime()}] Added new book: ID ${savedBook.id}`);
        res.status(201).json(savedBook);
    } catch (err) {
        console.error(`[${currentTime()}] Error adding new book:`, err);
        next(new APIError(500, 'Failed to add new book'));
    }
};

//  Update book
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            console.log(`[${currentTime()}] Book not found for update: ID ${req.params.id}`);
            return next(new APIError(404, 'Book not found'));
        }
        console.log(`[${currentTime()}] Updated book: ID ${req.params.id}`);
        res.json(updated);
    } catch (err) {
        console.error(`[${currentTime()}] Error updating book ID ${req.params.id}:`, err);
        next(new APIError(500, 'Failed to update book'));
    }
};

//  Delete book
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await Book.findByIdAndDelete(req.params.id);
        if (!deleted) {
            console.log(`[${currentTime()}] Book not found for deletion: ID ${req.params.id}`);
            return next(new APIError(404, 'Book not found'));
        }
        console.log(`[${currentTime()}] Deleted book: ID ${req.params.id}`);
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error(`[${currentTime()}] Error deleting book ID ${req.params.id}:`, err);
        next(new APIError(500, 'Failed to delete book'));
    }
};
