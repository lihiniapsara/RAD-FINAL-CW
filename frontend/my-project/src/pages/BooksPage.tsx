import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Edit3, Trash2, X, Save, Calendar, Clock, Grid, List } from 'lucide-react';

// Book interface
interface Book {
    _id: string;
    id: string;
    title: string;
    author: string;
    genre: string;
    language: string;
    quantity: number;
    available: boolean;
}

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
    const [isVisible, setIsVisible] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [showAddForm, setShowAddForm] = useState(false);

    // Fetch books from API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/books');
                if (!response.ok) throw new Error('Failed to fetch books');
                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        setTimeout(() => setIsVisible(true), 100);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleAddBook = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBook),
            });
            if (!response.ok) throw new Error('Failed to add book');
            const addedBook = await response.json();
            setBooks([...books, addedBook]);
            setNewBook({ id: '', title: '', author: '', genre: '', language: '', quantity: 0, available: true });
            setShowAddForm(false);
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const handleEditBook = async () => {
        if (!editingBook) return;
        try {
            const response = await fetch(`http://localhost:3001/api/books/${editingBook._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingBook),
            });
            if (!response.ok) throw new Error('Failed to update book');
            const updatedBook = await response.json();
            setBooks(books.map(book => (book._id === updatedBook._id ? updatedBook : book)));
            setEditingBook(null);
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const handleDeleteBook = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/books/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete book');
            setBooks(books.filter(book => book._id !== id));
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const filteredBooks = books.filter(
        book =>
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase()) ||
            book.genre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 left-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-8">
                {/* Header */}
                <div className={`text-center mb-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                    <div className="inline-flex items-center gap-4 mb-6 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
                        <div className="flex items-center gap-2 text-blue-300">
                            <Calendar size={18} />
                            <span className="text-sm font-medium">{formatDate(currentTime)}</span>
                        </div>
                        <div className="w-px h-6 bg-white/30"></div>
                        <div className="flex items-center gap-2 text-emerald-300">
                            <Clock size={18} />
                            <span className="text-sm font-mono font-bold">{formatTime(currentTime)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-4">
                        <BookOpen size={48} className="text-blue-400" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Books Management
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg">Manage your library's book collection with style</p>
                </div>

                {/* Controls */}
                <div className={`mb-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search books, authors, genres..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                                className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                            >
                                {viewMode === 'grid' ? <List size={18} /> : <Grid size={18} />}
                                {viewMode === 'grid' ? 'Table' : 'Grid'}
                            </button>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Plus size={18} />
                                Add Book
                            </button>
                        </div>
                    </div>
                </div>

                {/* Books Display */}
                {viewMode === 'grid' ? (
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
                        {filteredBooks.map(book => (
                            <div
                                key={book._id}
                                className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                                            <BookOpen size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">{book.title}</h3>
                                            <p className="text-gray-400 text-sm">ID: {book.id}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs ${book.available ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                        {book.available ? 'Available' : 'Unavailable'}
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <p className="text-gray-300">
                                        <span className="text-gray-400">Author:</span> {book.author}
                                    </p>
                                    <p className="text-gray-300">
                                        <span className="text-gray-400">Genre:</span> {book.genre}
                                    </p>
                                    <p className="text-gray-300">
                                        <span className="text-gray-400">Language:</span> {book.language}
                                    </p>
                                    <p className="text-gray-300">
                                        <span className="text-gray-400">Quantity:</span> {book.quantity}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingBook(book)}
                                        className="flex-1 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Edit3 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBook(book._id)}
                                        className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="bg-white/10 border-b border-white/20">
                                        <th className="p-4 text-left text-gray-300 font-semibold">ID</th>
                                        <th className="p-4 text-left text-gray-300 font-semibold">Title</th>
                                        <th className="p-4 text-left text-gray-300 font-semibold">Author</th>
                                        <th className="p-4 text-left text-gray-300 font-semibold">Genre</th>
                                        <th className="p-4 text-left text-gray-300 font-semibold">Language</th>
                                        <th className="p-4 text-left text-gray-300 font-semibold">Quantity</th>
                                        <th className="p-4 text-left text-gray-300 font-semibold">Status</th>
                                        <th className="p-4 text-left text-gray-300 font-semibold">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredBooks.map(book => (
                                        <tr key={book._id} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-300">
                                            <td className="p-4 text-white">{book.id}</td>
                                            <td className="p-4 text-white font-medium">{book.title}</td>
                                            <td className="p-4 text-gray-300">{book.author}</td>
                                            <td className="p-4 text-gray-300">{book.genre}</td>
                                            <td className="p-4 text-gray-300">{book.language}</td>
                                            <td className="p-4 text-gray-300">{book.quantity}</td>
                                            <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${book.available ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                            {book.available ? 'Available' : 'Unavailable'}
                          </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingBook(book)}
                                                        className="p-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-300"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBook(book._id)}
                                                        className="p-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300"
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
                    </div>
                )}

                {/* Add Book Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Plus className="text-blue-400" />
                                    Add New Book
                                </h3>
                                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300">
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2">Book ID</label>
                                        <input
                                            type="text"
                                            value={newBook.id}
                                            onChange={e => setNewBook({ ...newBook, id: e.target.value })}
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={newBook.title}
                                            onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Author</label>
                                        <input
                                            type="text"
                                            value={newBook.author}
                                            onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Genre</label>
                                        <input
                                            type="text"
                                            value={newBook.genre}
                                            onChange={e => setNewBook({ ...newBook, genre: e.target.value })}
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Language</label>
                                        <input
                                            type="text"
                                            value={newBook.language}
                                            onChange={e => setNewBook({ ...newBook, language: e.target.value })}
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Quantity</label>
                                        <input
                                            type="number"
                                            value={newBook.quantity}
                                            onChange={e => setNewBook({ ...newBook, quantity: parseInt(e.target.value) || 0 })}
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-4">
                                    <input
                                        type="checkbox"
                                        id="available"
                                        checked={newBook.available}
                                        onChange={e => setNewBook({ ...newBook, available: e.target.checked })}
                                        className="w-5 h-5 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="available" className="text-gray-300">Available for lending</label>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-gray-300 rounded-lg hover:bg-white/20 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddBook}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
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
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Edit3 className="text-blue-400" />
                                    Edit Book
                                </h3>
                                <button onClick={() => setEditingBook(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300">
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2">Book ID</label>
                                        <input
                                            type="text"
                                            value={editingBook.id}
                                            onChange={e => setEditingBook({ ...editingBook, id: e.target.value })}
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={editingBook.title}
                                            onChange={e => setEditingBook({ ...editingBook, title: e.target.value })}
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Author</label>
                                        <input
                                            type="text"
                                            value={editingBook.author}
                                            onChange={e => setEditingBook({ ...editingBook, author: e.target.value })}
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Genre</label>
                                        <input
                                            type="text"
                                            value={editingBook.genre}
                                            onChange={e => setEditingBook({ ...editingBook, genre: e.target.value })}
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Language</label>
                                        <input
                                            type="text"
                                            value={editingBook.language}
                                            onChange={e => setEditingBook({ ...editingBook, language: e.target.value })}
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Quantity</label>
                                        <input
                                            type="number"
                                            value={editingBook.quantity}
                                            onChange={e => setEditingBook({ ...editingBook, quantity: parseInt(e.target.value) || 0 })}
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-4">
                                    <input
                                        type="checkbox"
                                        id="editAvailable"
                                        checked={editingBook.available}
                                        onChange={e => setEditingBook({ ...editingBook, available: e.target.checked })}
                                        className="w-5 h-5 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="editAvailable" className="text-gray-300">Available for lending</label>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingBook(null)}
                                        className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-gray-300 rounded-lg hover:bg-white/20 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleEditBook}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
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