import mongoose from "mongoose";

type Lending = {
    id: string,
    readerId: mongoose.Schema.Types.ObjectId,
    bookId: mongoose.Schema.Types.ObjectId,
    borrowedDate: Date,
    dueDate: Date,
    returned: boolean,
    returnDate: Date,


}

const LendingSchema = new mongoose.Schema<Lending>({
    id: {
        type: String,
        required: true
    },
    readerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reader',
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrowedDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    returned: {
        type: Boolean,

    },
    returnDate: {
        type: Date,
    }
});

export const Lending = mongoose.model('Lending', LendingSchema);