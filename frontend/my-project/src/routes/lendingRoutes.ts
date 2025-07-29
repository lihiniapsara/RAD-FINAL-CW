/*
import  {Router} from 'express';
import {
    lendBook,
    returnBook,
    getAllLendings,
    getLendingsByReader,
    getLendingsByBook,
} from '../controllers/lendingController';
import {authenticateToken} from "../middleware/authenticateToken";

const landingRoutes= Router();

landingRoutes.get('/', getAllLendings,authenticateToken);
landingRoutes.get('/reader/:readerId', getLendingsByReader);
landingRoutes.get('/book/:bookId', getLendingsByBook);
landingRoutes.post('/lend', lendBook);
landingRoutes.put('/return/:id', returnBook);

export default landingRoutes;
*/

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

lendingRoutes.get('/', getAllLendings, authenticateToken);
lendingRoutes.get('/reader/:readerId', getLendingsByReader);
lendingRoutes.get('/book/:bookId', getLendingsByBook);
lendingRoutes.post('/lend', lendBook);
lendingRoutes.put('/return/:id', returnBook);

export default lendingRoutes;
