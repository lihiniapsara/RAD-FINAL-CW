import { Router } from 'express';
import {
    lendBook,
    returnBook,
    getAllLendings,
    getLendingsByReader,
    getLendingsByBook,
} from '../controllers/lendingController';
import { authenticateToken } from "../middleware/authenticateToken";

const lendingRoutes = Router();

lendingRoutes.get('/', authenticateToken, getAllLendings); // Fixed order
lendingRoutes.get('/reader/:readerId', authenticateToken, getLendingsByReader); // Added authentication
lendingRoutes.get('/book/:bookId', authenticateToken, getLendingsByBook); // Added authentication
lendingRoutes.post('/lend', authenticateToken, lendBook); // Added authentication
lendingRoutes.put('/return/:id', authenticateToken, returnBook); // Added authentication

export default lendingRoutes;