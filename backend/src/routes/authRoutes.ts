import { Router } from 'express';
import {
    registerUser,
    signUp,
    login,
    getAllUsers,
    refreshToken,
    logout
} from '../controllers/authController';
import { authenticateToken } from '../middleware/authenticateToken';

const authRouter = Router();

// Public Routes
authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/logout', logout);

// Admin Routes (Require Authentication)
authRouter.post('/register',registerUser);
authRouter.get('/users', authenticateToken, getAllUsers);

export default authRouter;
