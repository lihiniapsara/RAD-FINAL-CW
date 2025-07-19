import React from 'react';

const BooksTable = ({ books, onEdit, onDelete }: { books: any[]; onEdit?: (book: any) => void; onDelete?: (id: string) => void }) => {
    return (
        <table className="min-w-full bg-white border rounded-lg shadow-sm mt-4">
            <thead>
            <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Author</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
            </tr>
            </thead>
            <tbody>
            {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{book.title}</td>
                    <td className="py-2 px-4 border-b">{book.author}</td>
                    <td className="py-2 px-4 border-b">{book.status}</td>
                    <td className="py-2 px-4 border-b">
                        <button onClick={() => onEdit?.(book)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">
                            Edit
                        </button>
                        <button onClick={() => onDelete?.(book._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default BooksTable;