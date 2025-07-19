import express, {NextFunction} from "express";
import {APIError} from "../errors/APIError";
import jwt, {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";

export const authenticateToken = (req:express.Request, res:express.Response, next:NextFunction) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[1]
        console.log("Token: " + token)

        if(!token){
            return next (new APIError(401, "Access token not found"))
        }
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET !,
            (err , decoded) => {
                if (err) {
                    if (err instanceof TokenExpiredError) {
                        return next( new APIError(403, "Access token expired"))
                    } else if (err instanceof JsonWebTokenError) {
                        return next (new APIError(401, "Invalid access token"))
                        console.log("Error: " + err)
                    } else {
                        return next (new APIError(500, "Internal server error"))

                    }
                }

                if (!decoded || typeof decoded === 'string') {
                    return next (new APIError(500,"Access token payload error"))

                }
                next()
            }
        )
    }catch (error){
        next(error)
    }
}
/*

import express, { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError, JwtPayload } from "jsonwebtoken";
import { APIError } from "../errors/APIError";

// Extend the request type to include userId
interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return next(new APIError(401, "Access token not found"));
        }

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
            (err, decoded) => {
                if (err) {
                    if (err instanceof TokenExpiredError) {
                        return next(new APIError(401, "Access token expired"));
                    } else if (err instanceof jwt.JsonWebTokenError) {
                        return next(new APIError(401, "Invalid access token"));
                    } else {
                        return next(new APIError(500, "Internal server error"));
                    }
                }

                if (!decoded || typeof decoded === 'string') {
                    return next(new APIError(500, "Access token payload error"));
                }

                // Attach userId to the request object for future use
                req.userId = (decoded as JwtPayload).userId;
                next();
            }
        );
    } catch (error) {
        next(error);
    }
};
*/
