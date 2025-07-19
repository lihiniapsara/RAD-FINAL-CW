
import  {Router} from 'express';
import {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook
} from '../controllers/bookController';
import {authenticateToken} from "../middleware/authenticateToken";

const bookRoute = Router();

bookRoute.get('/', getAllBooks,authenticateToken);         // View all books
bookRoute.get('/:id', getBookById);      // View one book
bookRoute.post('/', addBook);            // Add a book
bookRoute.put('/:id', updateBook);       // Update book
bookRoute.delete('/:id', deleteBook);    // Delete book

export default bookRoute;
