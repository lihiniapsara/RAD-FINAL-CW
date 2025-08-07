import {Router} from "express";
import bookRoutes from "./bookRoutes";
import authRoutes from "./authRoutes";
import readerRoutes from "./readerRoutes";
import lendingRoutes from "./lendingRoutes";
import notificationRoutes from "./notificationRoutes";
import emailRouter from "./notificationRoutes";


const rootRouter = Router();

rootRouter.use("/auth",authRoutes);
rootRouter.use("/books",bookRoutes);
rootRouter.use("/readers",readerRoutes);
rootRouter.use("/lendings",lendingRoutes);
rootRouter.use("/notifications",emailRouter);

export default rootRouter;