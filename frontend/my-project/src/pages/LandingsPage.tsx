import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, Plus, Filter, Calendar, Clock, User, BookOpen, ArrowRight, CheckCircle, AlertCircle, X, Save } from 'lucide-react';

// Mock interfaces
interface Reader {
    _id: string;
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

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

interface BorrowBook {
    _id: string;
    readerId: Reader;
    bookId: Book;
    borrowedDate: string;
    dueDate: string;
    returned: boolean;
    returnedDate?: string;
}

// LendingsPage component එක
const LendingsPage: React.FC = () => {
    // ලෙන්ඩිං ලිස්ට් එක store කරන state
    const [lendings, setLendings] = useState<BorrowBook[]>([
        {
            _id: '1',
            readerId: {
                _id: '1',
                id: 'R001',
                name: 'John Doe',
                email: 'john@email.com',
                phone: '+1-234-567-8900',
                address: '123 Main St'
            },
            bookId: {
                _id: '1',
                id: 'B001',
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                genre: 'Fiction',
                language: 'English',
                quantity: 5,
                available: true
            },
            borrowedDate: '2024-01-15',
            dueDate: '2024-02-15',
            returned: false
        },
        {
            _id: '2',
            readerId: {
                _id: '2',
                id: 'R002',
                name: 'Jane Smith',
                email: 'jane@email.com',
                phone: '+1-234-567-8901',
                address: '456 Oak Ave'
            },
            bookId: {
                _id: '2',
                id: 'B002',
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                genre: 'Fiction',
                language: 'English',
                quantity: 3,
                available: true
            },
            borrowedDate: '2024-01-10',
            dueDate: '2024-02-10',
            returned: true,
            returnedDate: '2024-02-08'
        }
    ]);

    // Readers ලිස්ට් එක (mock data)
    const [readers] = useState<Reader[]>([
        {
            _id: '1',
            id: 'R001',
            name: 'John Doe',
            email: 'john@email.com',
            phone: '+1-234-567-8900',
            address: '123 Main St'
        },
        {
            _id: '2',
            id: 'R002',
            name: 'Jane Smith',
            email: 'jane@email.com',
            phone: '+1-234-567-8901',
            address: '456 Oak Ave'
        }
    ]);

    // Books ලිස්ට් එක (mock data)
    const [books] = useState<Book[]>([
        {
            _id: '1',
            id: 'B001',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            genre: 'Fiction',
            language: 'English',
            quantity: 5,
            available: true
        },
        {
            _id: '2',
            id: 'B002',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            genre: 'Fiction',
            language: 'English',
            quantity: 3,
            available: true
        }
    ]);

    // නව ලෙන්ඩිං එකතු කිරීමට form state
    const [newLending, setNewLending] = useState({ readerId: '', bookId: '' });
    // Filter type (all, reader, book)
    const [filterType, setFilterType] = useState<'all' | 'reader' | 'book'>('all');
    // Filter ID
    const [filterId, setFilterId] = useState('');
    // Current time state
    const [currentTime, setCurrentTime] = useState(new Date());
    // UI visibility state
    const [isVisible, setIsVisible] = useState(false);
    // Add lending form visibility
    const [showAddForm, setShowAddForm] = useState(false);
    // Search term state
    const [searchTerm, setSearchTerm] = useState('');

    // Real-time clock සහ UI visibility සඳහා useEffect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        setTimeout(() => setIsVisible(true), 100);

        return () => clearInterval(timer);
    }, []);

    // Time format කිරීම
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Date format කිරීම
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Display date format කිරීම
    const formatDisplayDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Overdue days ගණනය කිරීම
    const getDaysOverdue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = today.getTime() - due.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // නව ලෙන්ඩිං එකතු කිරීම
    const handleLendBook = () => {
        if (!newLending.readerId || !newLending.bookId) return;

        const reader = readers.find(r => r._id === newLending.readerId);
        const book = books.find(b => b._id === newLending.bookId);

        if (!reader || !book) return;

        const borrowedDate = new Date();
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + 1);

        const lending: BorrowBook = {
            _id: Date.now().toString(),
            readerId: reader,
            bookId: book,
            borrowedDate: borrowedDate.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            returned: false
        };

        setLendings([...lendings, lending]);
        setNewLending({ readerId: '', bookId: '' });
        setShowAddForm(false);
    };

    // පොත ආපසු ගැනීම
    const handleReturnBook = (id: string) => {
        setLendings(lendings.map(lending =>
            lending._id === id
                ? { ...lending, returned: true, returnedDate: new Date().toISOString().split('T')[0] }
                : lending
        ));
    };

    // Filter කරන ලෙන්ඩිං
    const filteredLendings = lendings.filter(lending => {
        const matchesSearch =
            lending.readerId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lending.bookId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lending.bookId.author.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterType === 'all') return matchesSearch;
        if (filterType === 'reader') return matchesSearch && (!filterId || lending.readerId._id === filterId);
        if (filterType === 'book') return matchesSearch && (!filterId || lending.bookId._id === filterId);
        return matchesSearch;
    });

    // History එකට filter කරන ලෙන්ඩිං (returned: true)
    const historyLendings = filteredLendings.filter(l => l.returned);

    // Statistics ගණනය කිරීම
    const activeLendings = filteredLendings.filter(l => !l.returned).length;
    const overdueLendings = filteredLendings.filter(l => !l.returned && getDaysOverdue(l.dueDate) > 0).length;

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
                <div className={`text-center mb-8 transition-all duration-1000 transform ${
                    isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
                }`}>
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
                        <RefreshCw size={48} className="text-orange-400 animate-spin-slow" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                            Lendings Management
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Track book lending, returns, and overdue items
                    </p>
                </div>

                {/* Stats Cards */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-all duration-1000 transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`} style={{ transitionDelay: '200ms' }}>
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                                <BookOpen size={24} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Lendings</p>
                                <p className="text-2xl font-bold text-white">{filteredLendings.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl">
                                <RefreshCw size={24} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Active Lendings</p>
                                <p className="text-2xl font-bold text-white">{activeLendings}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                                <AlertCircle size={24} className="text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Overdue Items</p>
                                <p className="text-2xl font-bold text-white">{overdueLendings}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className={`mb-8 transition-all duration-1000 transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`} style={{ transitionDelay: '400ms' }}>
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
                        {/* Search and Filter */}
                        <div className="flex flex-col md:flex-row gap-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search lendings..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>

                            <div className="flex gap-2">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as 'all' | 'reader' | 'book')}
                                    className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="all">All Lendings</option>
                                    <option value="reader">By Reader</option>
                                    <option value="book">By Book</option>
                                </select>

                                {filterType !== 'all' && (
                                    <select
                                        value={filterId}
                                        onChange={(e) => setFilterId(e.target.value)}
                                        className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">All {filterType}s</option>
                                        {(filterType === 'reader' ? readers : books).map(item => (
                                            <option key={item._id} value={item._id}>
                                                {filterType === 'reader'
                                                    ? (item as Reader).name
                                                    : (item as Book).title
                                                }
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Plus size={18} />
                            Lend Book
                        </button>
                    </div>
                </div>

                {/* Active Lendings List */}
                <div className={`transition-all duration-1000 transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`} style={{ transitionDelay: '600ms' }}>
                    <h2 className="text-2xl font-bold text-white mb-4">Active Lendings</h2>
                    <div className="space-y-4">
                        {filteredLendings.filter(l => !l.returned).length === 0 ? (
                            <div className="text-center py-12">
                                <RefreshCw size={48} className="text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">No active lendings found</p>
                            </div>
                        ) : (
                            filteredLendings
                                .filter(l => !l.returned)
                                .map((lending) => {
                                    const isOverdue = !lending.returned && getDaysOverdue(lending.dueDate) > 0;
                                    const daysOverdue = getDaysOverdue(lending.dueDate);

                                    return (
                                        <div
                                            key={lending._id}
                                            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
                                        >
                                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {/* Reader Info */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                                                            <User size={20} className="text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{lending.readerId.name}</p>
                                                            <p className="text-gray-400 text-sm">ID: {lending.readerId.id}</p>
                                                        </div>
                                                    </div>

                                                    {/* Book Info */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                                            <BookOpen size={20} className="text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{lending.bookId.title}</p>
                                                            <p className="text-gray-400 text-sm">by {lending.bookId.author}</p>
                                                        </div>
                                                    </div>

                                                    {/* Dates */}
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Borrowed</p>
                                                        <p className="text-white font-medium">{formatDisplayDate(lending.borrowedDate)}</p>
                                                        <p className="text-gray-400 text-sm mt-1">Due: {formatDisplayDate(lending.dueDate)}</p>
                                                    </div>

                                                    {/* Status */}
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {isOverdue ? (
                                                                <AlertCircle size={16} className="text-red-400" />
                                                            ) : (
                                                                <RefreshCw size={16} className="text-blue-400" />
                                                            )}
                                                            <span className={`text-sm font-medium ${
                                                                isOverdue ? 'text-red-400' : 'text-blue-400'
                                                            }`}>
                                                                {isOverdue ? `${daysOverdue} days overdue` : 'Active'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    {!lending.returned && (
                                                        <button
                                                            onClick={() => handleReturnBook(lending._id)}
                                                            className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-500/30 transition-all duration-300 flex items-center gap-2"
                                                        >
                                                            <CheckCircle size={16} />
                                                            Return Book
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </div>

                {/* Lending History */}
                <div className={`mt-12 transition-all duration-1000 transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`} style={{ transitionDelay: '800ms' }}>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <BookOpen className="text-green-400" />
                        Lending History
                    </h2>
                    <div className="space-y-4">
                        {historyLendings.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">No lending history found</p>
                            </div>
                        ) : (
                            historyLendings.map((lending) => (
                                <div
                                    key={lending._id}
                                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                >
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Reader Info */}
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                                                    <User size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{lending.readerId.name}</p>
                                                    <p className="text-gray-400 text-sm">ID: {lending.readerId.id}</p>
                                                </div>
                                            </div>

                                            {/* Book Info */}
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                                    <BookOpen size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{lending.bookId.title}</p>
                                                    <p className="text-gray-400 text-sm">by {lending.bookId.author}</p>
                                                </div>
                                            </div>

                                            {/* Dates */}
                                            <div>
                                                <p className="text-gray-400 text-sm">Borrowed</p>
                                                <p className="text-white font-medium">{formatDisplayDate(lending.borrowedDate)}</p>
                                                <p className="text-gray-400 text-sm mt-1">Returned: {formatDisplayDate(lending.returnedDate!)}</p>
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle size={16} className="text-green-400" />
                                                    <span className="text-sm font-medium text-green-400">Returned</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Add Lending Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Plus className="text-orange-400" />
                                    Lend Book
                                </h3>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
                                >
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2">Select Reader</label>
                                    <select
                                        value={newLending.readerId}
                                        onChange={(e) => setNewLending({ ...newLending, readerId: e.target.value })}
                                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value="">Choose a reader...</option>
                                        {readers.map(reader => (
                                            <option key={reader._id} value={reader._id}>
                                                {reader.name} (ID: {reader.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">Select Book</label>
                                    <select
                                        value={newLending.bookId}
                                        onChange={(e) => setNewLending({ ...newLending, bookId: e.target.value })}
                                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value="">Choose a book...</option>
                                        {books.filter(book => book.quantity > 0).map(book => (
                                            <option key={book._id} value={book._id}>
                                                {book.title} by {book.author}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-gray-300 rounded-lg hover:bg-white/20 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleLendBook}
                                        disabled={!newLending.readerId || !newLending.bookId}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save size={18} />
                                        Lend Book
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

export default LendingsPage;