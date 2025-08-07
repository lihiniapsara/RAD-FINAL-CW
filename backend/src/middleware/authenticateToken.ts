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
            process.env.ACCESS_TOKEN_SECRET || 'default_access_token_secret_2024',
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

