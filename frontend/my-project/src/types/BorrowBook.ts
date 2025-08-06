export interface BorrowBook {
    _id: string;
    id: string;
    readerId: { _id: string; name: string; email: string };
    bookId: { _id: string; title: string };
    borrowedDate: string;
    dueDate: string;
    returned: boolean;
    returnDate?: string;
}