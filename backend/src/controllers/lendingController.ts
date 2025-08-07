import { Request, Response, NextFunction } from 'express';
import { Lending } from '../models/Lending';
import { Book } from '../models/Book';
import { Reader } from '../models/Reader'; // Reader model එක import කරන්න
import { APIError } from '../errors/APIError';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

const currentTime = () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: true });

// Lend a book
export const lendBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { readerId, bookId } = req.body;

    // Validate input
    if (!readerId || !bookId) {
      console.log(`[${currentTime()}] Missing readerId or bookId`);
      return next(new APIError(400, 'readerId and bookId are required'));
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(readerId) || !mongoose.Types.ObjectId.isValid(bookId)) {
      console.log(`[${currentTime()}] Invalid readerId or bookId: ${readerId}, ${bookId}`);
      return next(new APIError(400, 'Invalid readerId or bookId format'));
    }

    // Check if reader exists
    const reader = await Reader.findById(readerId);
    if (!reader) {
      console.log(`[${currentTime()}] Reader not found: ID ${readerId}`);
      return next(new APIError(404, 'Reader not found'));
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      console.log(`[${currentTime()}] Book not found for lending: ID ${bookId}`);
      return next(new APIError(404, 'Book not found'));
    }

    // Check book quantity
    if (book.quantity <= 0) {
      console.log(`[${currentTime()}] Book out of stock: ID ${bookId}`);
      return next(new APIError(400, 'Book is out of stock'));
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // due in 14 days

    const lending = new Lending({
      id: uuidv4(), // Use uuidv4() for unique ID
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
  } catch (err: any) {
    console.error(`[${currentTime()}] Error lending book:`, err);
    if (err.name === 'ValidationError') {
      return next(new APIError(400, `Lending validation failed: ${err.message}`));
    }
    if (err.name === 'CastError') {
      return next(new APIError(400, 'Invalid readerId or bookId'));
    }
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

