import { Request, Response, NextFunction } from 'express';
import {Reader} from '../models/Reader';
import { APIError } from '../errors/APIError';

const currentTime = () => new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: true });

// Get all readers
export const getAllReaders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readers = await Reader.find();
    console.log(`[${currentTime()}] Fetched all readers: ${readers.length} records`);
    res.status(200).json(readers);
  } catch (error) {
    console.error(`[${currentTime()}] Error fetching readers:`, error);
    next(new APIError(500, 'Failed to fetch readers'));
  }
};


// Add new reader
export const addReader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newReader = new Reader(req.body);
    await newReader.save();
    console.log(`[${currentTime()}] Added new reader: ${newReader.name || 'Unnamed'}`);
    res.status(201).json(newReader);
  } catch (error) {
    console.error(`[${currentTime()}] Error adding reader:`, error);
    next(new APIError(500, 'Failed to add reader'));
  }
};

// Update reader
export const updateReader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reader = await Reader.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reader) {
      console.log(`[${currentTime()}] Reader not found for update: ID ${req.params.id}`);
      return next(new APIError(404, 'Reader not found'));
    }
    console.log(`[${currentTime()}] Updated reader: ID ${req.params.id}`);
    res.status(200).json(reader);
  } catch (error) {
    console.error(`[${currentTime()}] Error updating reader ID ${req.params.id}:`, error);
    next(new APIError(500, 'Failed to update reader'));
  }
};

// Delete reader
export const deleteReader = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reader = await Reader.findByIdAndDelete(req.params.id);
    if (!reader) {
      console.log(`[${currentTime()}] Reader not found for deletion: ID ${req.params.id}`);
      return next(new APIError(404, 'Reader not found'));
    }
    console.log(`[${currentTime()}] Deleted reader: ID ${req.params.id}`);
    res.status(200).json({ message: 'Reader deleted successfully' });
  } catch (error) {
    console.error(`[${currentTime()}] Error deleting reader ID ${req.params.id}:`, error);
    next(new APIError(500, 'Failed to delete reader'));
  }
};