import { Router } from 'express';
import {
    lendBook,
    returnBook,
    getAllLendings,
} from '../controllers/lendingController';
import { authenticateToken } from "../middleware/authenticateToken";

const lendingRoutes = Router();

 lendingRoutes.get('/', authenticateToken, getAllLendings); // Fixed order
lendingRoutes.post('/lend', authenticateToken, lendBook); // Added authentication
lendingRoutes.put('/return/:id', authenticateToken, returnBook); // Added authentication

export default lendingRoutes;