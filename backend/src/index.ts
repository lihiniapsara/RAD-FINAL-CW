import express from 'express';
import {connectDB} from "./db/mongo";
import dotenv from "dotenv"
import cors from "cors"
import {errorHandler} from "./middleware/errorHandler";
import rootRouter from "./routes";
import cookieParser from "cookie-parser";



dotenv.config()
const app = express();

//handle cors
const corsOptions = {
    origin: process.env.CLIRNT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT ;

// Routes
app.use('/api', rootRouter);
app.use(errorHandler)


connectDB().then(() => {

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})
