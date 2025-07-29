import { Request, Response } from 'express';
import { Lending } from '../models/Lending';
import nodemailer from 'nodemailer';

interface Reader {
    name: string;
    email: string;
}

interface Book {
    title: string;
}

export const sendOverdueNotifications = async (req: Request, res: Response) => {
    try {
        // Validate environment variables
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.status(500).json({ message: 'Email configuration is missing' });
        }

        // Fetch overdue lendings (15 days past due date)
        const today = new Date();
        const fifteenDaysAgo = new Date(today);
        fifteenDaysAgo.setDate(today.getDate() - 15); // Check lendings overdue by 15 days

        const overdueLendings = await Lending.find({
            dueDate: { $lte: fifteenDaysAgo }, // Lendings due 15 days ago or earlier
            returned: false,
        })
            .populate<{ readerId: Reader }>('readerId')
            .populate<{ bookId: Book }>('bookId')
            .lean();

        if (overdueLendings.length === 0) {
            return res.status(200).json({ message: 'No overdue readers found' });
        }

        // Initialize nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send emails in parallel
        const emailPromises = overdueLendings.map(async (lending) => {
            const reader = lending.readerId;
            const book = lending.bookId;

            if (!reader?.email || !book?.title) {
                console.warn(`Invalid data for lending: ${lending._id}`);
                return { success: false, lendingId: lending._id };
            }

            const emailText = `
Hi ${reader.name || 'Reader'},

This is a reminder that the following book is overdue:

Title: ${book.title}
Due Date: ${new Date(lending.dueDate).toDateString()}
Overdue by: ${Math.floor((today.getTime() - lending.dueDate.getTime()) / (1000 * 60 * 60 * 24))} days

Please return it as soon as possible.

- Book Club Library
`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: reader.email,
                subject: 'Overdue Book Reminder',
                text: emailText,
            };

            await transporter.sendMail(mailOptions);
            return { success: true, lendingId: lending._id };
        });

        const results = await Promise.allSettled(emailPromises);
        const failedEmails = results.filter(
            (result) => result.status === 'rejected' || !result.value.success
        );

        if (failedEmails.length > 0) {
            console.error('Failed to send some emails:', failedEmails);
            return res.status(207).json({
                message: 'Some emails failed to send',
                failed: failedEmails.map((f) => f.status === 'rejected' ? f.reason : f.value.lendingId),
            });
        }

        return res.status(200).json({ message: 'Overdue emails sent successfully' });
    } catch (error) {
        console.error('Error in sendOverdueNotifications:', error);
        return res.status(500).json({ message: 'Error sending emails', error: (error as Error).message });
    }
};