import mongoose from "mongoose";

type Book = {
    id: string;
    title: string;
    author: string;
    genre: string;
    language: string;
    quantity: number;
    available: boolean;
}

const BookSchema = new mongoose.Schema<Book>({
    id: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    language: { type: String, required: true },
    quantity: { type: Number, required: true },
    available: { type: Boolean, default: true },
});

export const Book = mongoose.model('Book', BookSchema);

