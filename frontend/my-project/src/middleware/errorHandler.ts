import express, {NextFunction} from "express";
import mongoose from "mongoose";
import {APIError} from "../errors/APIError";

export const errorHandler= (
    error:any,
    req:express.Request,
    res:express.Response,
    next:NextFunction) => {
    if (error instanceof mongoose.Error) {
        res.status(400).json({message: error.message})
        return
    }
    if (error instanceof APIError){
        res.status(400).json({message: error.message})
    return
    }

    res.status(500).json({message:"Internal Server Error"})
}