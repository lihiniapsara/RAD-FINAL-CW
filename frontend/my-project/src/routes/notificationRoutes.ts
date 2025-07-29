import { Router, Request, Response } from 'express';
import { sendOverdueNotifications } from '../controllers/notificationController';

class NotificationRoutes {
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/send-overdue-notifications', async (req: Request, res: Response) => {
            try {
                await sendOverdueNotifications(req, res);
            } catch (error) {
                res.status(500).json({ message: 'Error sending notifications', error: (error as Error).message });
            }
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default new NotificationRoutes().getRouter();