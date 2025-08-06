import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Edit3, Trash2, X, Save, Calendar, Clock, Grid, List } from 'lucide-react';
import { getBooks, addBook, updateBook, deleteBook } from '../service/bookService';
import type { Book } from '@/types/Books';

const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [newBook, setNewBook] = useState<Omit<Book, '_id'>>({
        id: '',
        title: '',
        author: '',
        genre: '',
        language: '',
        quantity: 0,
        available: true,
    });
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [search, setSearch] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const fetchedBooks = await getBooks();
                setBooks(fetchedBooks);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch books');
                console.error(err);
            }
        };

        if (token) {
            fetchBooks();
        }

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [token]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Colombo',
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Colombo',
        });
    };

    const handleAddBook = async () => {
        try {
            if (!newBook.id || !newBook.title || !newBook.author || !newBook.genre || !newBook.language || newBook.quantity === 0) {
                setError('All fields are required');
                return;
            }
            const addedBook = await addBook(newBook);
            setBooks([...books, addedBook]);
            setNewBook({ id: '', title: '', author: '', genre: '', language: '', quantity: 0, available: true });
            setShowAddForm(false);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add book');
            console.error(err);
        }
    };

    const handleEditBook = async () => {
        if (!editingBook || !editingBook._id || !editingBook.id || !editingBook.title || !editingBook.author || !editingBook.genre || !editingBook.language || editingBook.quantity === undefined) {
            setError('All book fields are required');
            return;
        }
        try {
            const updatedBook = await updateBook(editingBook._id, editingBook);
            setBooks(books.map(book => (book._id === updatedBook._id ? updatedBook : book)));
            setEditingBook(null);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update book');
            console.error(err);
        }
    };

    const handleDeleteBook = async (id: string) => {
        try {
            await deleteBook(id);
            setBooks(books.filter(book => book._id !== id));
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete book');
            console.error(err);
        }
    };

    const filteredBooks = books.filter(
        book =>
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase()) ||
            book.genre.toLowerCase().includes(search.toLowerCase())
    );

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
                    <p className="text-gray-600">You need to be logged in to access the Books Management page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-4 mb-6 px-6 py-3 bg-white rounded-full shadow-sm border">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Calendar size={18} />
                            <span className="text-sm font-medium">{formatDate(currentTime)}</span>
                        </div>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-green-600">
                            <Clock size={18} />
                            <span className="text-sm font-mono font-bold">{formatTime(currentTime)}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="p-3 bg-blue-600 rounded-lg">
                            <BookOpen size={32} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">Books Management</h1>
                    </div>
                    <p className="text-gray-600 text-lg">Manage your library's book collection</p>
                </div>

                {/* Controls */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search books, authors, genres..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                {viewMode === 'grid' ? <List size={18} /> : <Grid size={18} />}
                                {viewMode === 'grid' ? 'Table' : 'Grid'}
                            </button>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add Book
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-4 border">
                            <div className="text-2xl font-bold text-blue-600">{books.length}</div>
                            <div className="text-gray-600 text-sm">Total Books</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border">
                            <div className="text-2xl font-bold text-green-600">
                                {books.filter(book => book.available).length}
                            </div>
                            <div className="text-gray-600 text-sm">Available</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border">
                            <div className="text-2xl font-bold text-orange-600">
                                {books.filter(book => !book.available).length}
                            </div>
                            <div className="text-gray-600 text-sm">Unavailable</div>
                        </div>
                    </div>
                </div>

                {/* Books Display */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBooks.map(book => (
                            <div key={book._id} className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <BookOpen size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{book.title}</h3>
                                            <p className="text-gray-500 text-sm">ID: {book.id}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {book.available ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <p className="text-gray-700"><span className="font-medium">Author:</span> {book.author}</p>
                                    <p className="text-gray-700"><span className="font-medium">Genre:</span> {book.genre}</p>
                                    <p className="text-gray-700"><span className="font-medium">Language:</span> {book.language}</p>
                                    <p className="text-gray-700"><span className="font-medium">Quantity:</span> {book.quantity}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            console.log('Editing book:', book); // Debug
                                            setEditingBook(book);
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit3 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBook(book._id)}
                                        className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-left text-gray-700 font-semibold">ID</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Title</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Author</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Genre</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Language</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Quantity</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Status</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredBooks.map(book => (
                                    <tr key={book._id} className="border-t hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-900">{book.id}</td>
                                        <td className="p-4 text-gray-900 font-medium">{book.title}</td>
                                        <td className="p-4 text-gray-700">{book.author}</td>
                                        <td className="p-4 text-gray-700">{book.genre}</td>
                                        <td className="p-4 text-gray-700">{book.language}</td>
                                        <td className="p-4 text-gray-700">{book.quantity}</td>
                                        <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {book.available ? 'Available' : 'Unavailable'}
                                                </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        console.log('Editing book:', book); // Debug
                                                        setEditingBook(book);
                                                    }}
                                                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBook(book._id)}
                                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Add Book Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                        <Plus className="text-blue-600" />
                                        Add New Book
                                    </h3>
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Book ID</label>
                                            <input
                                                type="text"
                                                value={newBook.id}
                                                onChange={e => setNewBook({ ...newBook, id: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter book ID"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={newBook.title}
                                                onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter book title"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Author</label>
                                            <input
                                                type="text"
                                                value={newBook.author}
                                                onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter author name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Genre</label>
                                            <input
                                                type="text"
                                                value={newBook.genre}
                                                onChange={e => setNewBook({ ...newBook, genre: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter genre"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Language</label>
                                            <input
                                                type="text"
                                                value={newBook.language}
                                                onChange={e => setNewBook({ ...newBook, language: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter language"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                                            <input
                                                type="number"
                                                value={newBook.quantity}
                                                onChange={e => setNewBook({ ...newBook, quantity: parseInt(e.target.value) || 0 })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter quantity"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="available"
                                            checked={newBook.available}
                                            onChange={e => setNewBook({ ...newBook, available: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="available" className="text-gray-700">Available for lending</label>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t bg-gray-50">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddBook}
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} />
                                        Add Book
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Book Modal */}
                {editingBook && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                        <Edit3 className="text-blue-600" />
                                        Edit Book
                                    </h3>
                                    <button
                                        onClick={() => setEditingBook(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Book ID</label>
                                            <input
                                                type="text"
                                                value={editingBook.id}
                                                onChange={e => setEditingBook({ ...editingBook, id: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={editingBook.title}
                                                onChange={e => setEditingBook({ ...editingBook, title: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Author</label>
                                            <input
                                                type="text"
                                                value={editingBook.author}
                                                onChange={e => setEditingBook({ ...editingBook, author: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Genre</label>
                                            <input
                                                type="text"
                                                value={editingBook.genre}
                                                onChange={e => setEditingBook({ ...editingBook, genre: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Language</label>
                                            <input
                                                type="text"
                                                value={editingBook.language}
                                                onChange={e => setEditingBook({ ...editingBook, language: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                                            <input
                                                type="number"
                                                value={editingBook.quantity}
                                                onChange={e => setEditingBook({ ...editingBook, quantity: parseInt(e.target.value) || 0 })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="editAvailable"
                                            checked={editingBook.available}
                                            onChange={e => setEditingBook({ ...editingBook, available: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="editAvailable" className="text-gray-700">Available for lending</label>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t bg-gray-50">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setEditingBook(null)}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEditBook}
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BooksPage;