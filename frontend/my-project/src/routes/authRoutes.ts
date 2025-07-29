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
authRouter.post('/signup', signUp);        // POST /api/auth/signup
authRouter.post('/login', login);          // POST /api/auth/login
authRouter.post('/refresh-token', refreshToken); // POST /api/auth/refresh-token
authRouter.post('/logout', logout);        // POST /api/auth/logout

// Admin Routes (Require Authentication)
authRouter.post('/register',registerUser);  // POST /api/auth/register (admin only)
authRouter.get('/users', authenticateToken, getAllUsers);       // GET /api/auth/users

export default authRouter;
