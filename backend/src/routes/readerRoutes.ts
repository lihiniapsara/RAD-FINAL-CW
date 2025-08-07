import {Router} from 'express';
import {
    getAllReaders,
    addReader,
    updateReader,
    deleteReader,
} from '../controllers/readerController';
import { authenticateToken } from '../middleware/authenticateToken';


const readerRouter = Router();

readerRouter.get('/',authenticateToken, getAllReaders); // View all readers
readerRouter.post('/', addReader); // Add reader
readerRouter.put('/:id', updateReader); // Update reader
readerRouter.delete('/:id', deleteReader); // Delete reader

export default readerRouter;
