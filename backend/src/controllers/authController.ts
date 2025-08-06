import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { UserModel } from '../models/user';
import { APIError } from '../errors/APIError';

const createAccessToken = (userId: string) => {
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET || 'default_access_token_secret_2024',
        { expiresIn: '70d' },
    );
};

const createRefreshToken = (userId: string) => {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET || 'default_refresh_token_secret_2024',
        { expiresIn: '70d' },
    );
};

// Register new user (admin use only)
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const exists = await UserModel.findOne({ email });
        if (exists) throw new APIError(400, 'User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        next(err);
    }
};

// Sign up (alternative registration)
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) throw new APIError(404, 'User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new APIError(401, 'Invalid password');

        const accessToken = createAccessToken(user._id.toString());
        const refreshToken = createRefreshToken(user._id.toString());

        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProd,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth/refresh-token',
        });

        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };

        res.status(200).json({ user: userWithoutPassword, accessToken });
    } catch (err) {
        next(err);
    }
};

// Get all users (admin use only)
export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.find(); // exclude password
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

// Refresh token - issue new access token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) return next(new APIError(401, 'Refresh token missing'));

        jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET || 'default_refresh_token_secret_2024',
            async (err: Error | null, decoded: string | JwtPayload | undefined) => {
                if (err) {
                    if (err instanceof TokenExpiredError) return next(new APIError(401, 'Refresh token expired'));
                    if (err instanceof JsonWebTokenError) return next(new APIError(401, 'Invalid refresh token'));
                    return next(new APIError(401, 'Could not verify refresh token'));
                }

                if (!decoded || typeof decoded === 'string') return next(new APIError(401, 'Invalid refresh token payload'));

                const userId = decoded.userId as string;
                const user = await UserModel.findById(userId);

                if (!user) return next(new APIError(401, 'User not found'));

                const newAccessToken = createAccessToken(userId);
                res.status(200).json({ accessToken: newAccessToken });
            },
        );
    } catch (err) {
        next(err);
    }
};

// Logout - Clear refresh token cookie
export const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: isProduction,
            expires: new Date(0), // Set cookie expiration to past date
            path: '/api/auth/refresh-token',
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        next(err);
    }
};