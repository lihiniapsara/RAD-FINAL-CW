import { Request, Response, NextFunction } from 'express';
import {Lending} from '../models/Lending';
import {Book} from '../models/Book';
import { APIError } from '../errors/APIError';

const currentTime = () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: true });

// Lend a book
export const lendBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { readerId, bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      console.log(`[${currentTime()}] Book not found for lending: ID ${bookId}`);
      return next(new APIError(404, 'Book not found'));
    }

    if (book.quantity <= 0) {
      console.log(`[${currentTime()}] Book out of stock: ID ${bookId}`);
      return next(new APIError(400, 'Book is out of stock'));
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // due in 14 days

    const lending = new Lending({
      readerId,
      bookId,
      borrowedDate: new Date(),
      dueDate,
    });

    await lending.save();

    // Decrease book quantity
    book.quantity -= 1;
    await book.save();

    console.log(`[${currentTime()}] Book lent: ID ${bookId} to Reader ${readerId}`);
    res.status(201).json(lending);
  } catch (err) {
    console.error(`[${currentTime()}] Error lending book:`, err);
    next(new APIError(500, 'Failed to lend book'));
  }
};

// Return a book
export const returnBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lending = await Lending.findById(req.params.id);
    if (!lending) {
      console.log(`[${currentTime()}] Lending record not found: ID ${req.params.id}`);
      return next(new APIError(404, 'Lending record not found'));
    }

    if (lending.returned) {
      console.log(`[${currentTime()}] Book already returned: ID ${req.params.id}`);
      return next(new APIError(400, 'Book already returned'));
    }

    lending.returned = true;
    await lending.save();

    // Increase book quantity
    const book = await Book.findById(lending.bookId);
    if (book) {
      book.quantity += 1;
      await book.save();
    }

    console.log(`[${currentTime()}] Book returned: ID ${req.params.id}`);
    res.json({ message: 'Book returned successfully', lending });
  } catch (err) {
    console.error(`[${currentTime()}] Error returning book:`, err);
    next(new APIError(500, 'Failed to return book'));
  }
};

// Get all lending records
export const getAllLendings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await Lending.find().populate('readerId').populate('bookId');
    console.log(`[${currentTime()}] Fetched all lendings: ${records.length} records`);
    res.json(records);
  } catch (err) {
    console.error(`[${currentTime()}] Error fetching lendings:`, err);
    next(new APIError(500, 'Failed to fetch lendings'));
  }
};

// Get lending records by reader
export const getLendingsByReader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await Lending.find({ readerId: req.params.readerId }).populate('bookId');
    if (records.length === 0) {
      console.log(`[${currentTime()}] No lendings found for Reader ID ${req.params.readerId}`);
      return res.status(404).json({ message: 'No lendings found for this reader' });
    }
    console.log(`[${currentTime()}] Fetched lendings for Reader ID ${req.params.readerId}: ${records.length} records`);
    res.json(records);
  } catch (err) {
    console.error(`[${currentTime()}] Error fetching lendings by Reader ID ${req.params.readerId}:`, err);
    next(new APIError(500, 'Failed to fetch lendings by reader'));
  }
};

// Get lending records by book
export const getLendingsByBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await Lending.find({ bookId: req.params.bookId }).populate('readerId');
    if (records.length === 0) {
      console.log(`[${currentTime()}] No lendings found for Book ID ${req.params.bookId}`);
      return res.status(404).json({ message: 'No lendings found for this book' });
    }
    console.log(`[${currentTime()}] Fetched lendings for Book ID ${req.params.bookId}: ${records.length} records`);
    res.json(records);
  } catch (err) {
    console.error(`[${currentTime()}] Error fetching lendings by Book ID ${req.params.bookId}:`, err);
    next(new APIError(500, 'Failed to fetch lendings by book'));
  }
};