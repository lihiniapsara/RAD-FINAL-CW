import {Router} from "express";
import {sendEmail} from "../controllers/notificationController";

const emailRouter = Router();

emailRouter.post("/" , sendEmail)

export default emailRouter