import { Router } from 'express';
import { sendOverdueNotifications } from '../controllers/notificationController';

const notificationRoutes = Router();

notificationRoutes.post('/send-overdue-notifications', async (req, res) => {
    try {
        await sendOverdueNotifications(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error sending notifications', error: (error as Error).message });
    }
});

export default notificationRoutes;