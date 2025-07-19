import React, { useEffect, useState } from 'react';
import BooksTable from '../components/tables/BooksTable';
import BookForm from '../forms/BookForm';

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        fetch('/api/books')
            .then((res) => res.json())
            .then((data) => setBooks(data));
    }, []);

    const handleSubmit = (data: any) => {
        if (selectedBook) {
            // Update logic
            fetch(`/api/books/${selectedBook._id}`, { method: 'PUT', body: JSON.stringify(data) })
                .then(() => setBooks(books.map((b) => (b._id === selectedBook._id ? data : b))));
        } else {
            // Add logic
            fetch('/api/books', { method: 'POST', body: JSON.stringify(data) })
                .then((res) => res.json())
                .then((newBook) => setBooks([...books, newBook]));
        }
        setSelectedBook(null);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Books</h1>
            <BookForm onSubmit={handleSubmit} initialData={selectedBook} />
            <BooksTable books={books} onEdit={(book) => setSelectedBook(book)} />
        </div>
    );
};

export default BooksPage;