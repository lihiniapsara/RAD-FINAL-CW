import {Router} from 'express';
import {
    getAllReaders,
    getReaderById,
    addReader,
    updateReader,
    deleteReader,
} from '../controllers/readerController';
import { authenticateToken } from '../middleware/authenticateToken';


const readerRouter = Router();

readerRouter.get('/',authenticateToken, getAllReaders); // View all readers
readerRouter.get('/:id', getReaderById); // View one reader
readerRouter.post('/', addReader); // Add reader
readerRouter.put('/:id', updateReader); // Update reader
readerRouter.delete('/:id', deleteReader); // Delete reader

export default readerRouter;
