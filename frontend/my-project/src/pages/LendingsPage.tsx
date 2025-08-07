import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Search, Plus, Filter, Calendar, Clock, User, BookOpen, CheckCircle, AlertCircle, X, Save, List, Grid, Mail, AlertTriangle, Bell } from 'lucide-react';
import type { Reader } from '@/types/Readers';
import type { BorrowBook } from '@/types/BorrowBook';
import type { Book } from '@/types/Books';
import {getLendings, lendBook, returnBook, sendOverdueNotifications} from '@/service/borrowBookService';
import { getReaders } from '@/service/readerService';
import { getBooks } from '@/service/bookService';
import type {Email} from "@/types/Email.ts";

// Extended interfaces
interface EmailNotification {
    id: string;
    readerId: string;
    readerName: string;
    readerEmail: string;
    bookTitle: string;
    dueDate: string;
    daysOverdue: number;
    sentDate: string;
    type: 'overdue' | 'reminder';
}

interface ExtendedBorrowBook extends Omit<BorrowBook, 'readerId' | 'bookId'> {
    readerId: Reader;
    bookId: Book;
    returnedDate?: string;
    emailSent?: boolean;
    lastEmailDate?: string;
}

const LendingsPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<'lendings' | 'overdue'>('lendings');
    const [lendings, setLendings] = useState<ExtendedBorrowBook[]>([]);
    const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>([]);
    const [readers, setReaders] = useState<Reader[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [newLending, setNewLending] = useState({ readerId: '', bookId: '' });
    const [filterType, setFilterType] = useState<'all' | 'active' | 'returned'>('all');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [selectedOverdue, setSelectedOverdue] = useState<ExtendedBorrowBook | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load data with improved error handling
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [readersData, booksData, lendingsData] = await Promise.all([
                getReaders().catch(err => {
                    console.error('Failed to fetch readers:', err);
                    setError('Failed to load readers. Please check backend connectivity.');
                    return [];
                }),
                getBooks().catch(err => {
                    console.error('Failed to fetch books:', err);
                    setError('Failed to load books. Please check backend connectivity.');
                    return [];
                }),
                getLendings().catch(err => {
                    console.error('Failed to fetch lendings:', err);
                    setError('Failed to load lendings. Please check backend connectivity or authentication.');
                    return [];
                }),
            ]);

            if (!readersData.length) {
                setError('No readers found in the database.');
                return;
            }
            if (!booksData.length) {
                setError('No books found in the database.');
                return;
            }
            if (!lendingsData.length) {
                setError('No lendings found in the database.');
                return;
            }

            const transformedLendings: ExtendedBorrowBook[] = lendingsData.map((lending: BorrowBook) => {
                const reader = readersData.find((r: Reader) => r._id === (typeof lending.readerId === 'object' ? lending.readerId._id : lending.readerId));
                const book = booksData.find((b: Book) => b._id === (typeof lending.bookId === 'object' ? lending.bookId._id : lending.bookId));

                if (!reader || !book) {
                    console.warn(`Missing reader or book for lending ID: ${lending._id}`);
                    setError(`Missing reader or book data for lending ID: ${lending._id}`);
                    return null;
                }

                return {
                    ...lending,
                    readerId: reader,
                    bookId: book,
                    emailSent: false,
                    lastEmailDate: undefined,
                };
            }).filter((lending): lending is ExtendedBorrowBook => lending !== null);

            if (transformedLendings.length === 0) {
                setError('No valid lendings found. Ensure reader and book data match lending records.');
                return;
            }

            setReaders(readersData);
            setBooks(booksData);
            setLendings(transformedLendings);
            console.log('Transformed Lendings:', transformedLendings);
        } catch (err: any) {
            console.error('Error loading data:', err.message);
            setError('Failed to load data. Please check your network, authentication, or backend server.');
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        console.log('Initializing data load...');
        loadData();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [loadData]);

    // Auto email checking
    useEffect(() => {
        const checkAndSendEmails = () => {
            const overdueLendings = lendings.filter(lending => !lending.returned && getDaysOverdue(lending.dueDate) > 0);
            console.log('Overdue lendings:', overdueLendings.length);
            overdueLendings.forEach(lending => {
                if (!lending.emailSent || shouldSendFollowUpEmail(lending.lastEmailDate)) {
                    sendOverdueEmail(lending);
                }
            });
        };

        const emailTimer = setInterval(checkAndSendEmails, 3600000); // Every hour
        return () => clearInterval(emailTimer);
    }, [lendings]);

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

    const formatDisplayDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getDaysOverdue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        if (isNaN(due.getTime())) {
            console.warn(`Invalid due date: ${dueDate}`);
            return 0;
        }
        const diffTime = today.getTime() - due.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const shouldSendFollowUpEmail = (lastEmailDate?: string) => {
        if (!lastEmailDate) return true;
        const lastEmail = new Date(lastEmailDate);
        if (isNaN(lastEmail.getTime())) {
            console.warn(`Invalid last email date: ${lastEmailDate}`);
            return true;
        }
        const today = new Date();
        const daysSinceLastEmail = Math.ceil((today.getTime() - lastEmail.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceLastEmail >= 7;
    };



    const sendOverdueEmail = async (lending: ExtendedBorrowBook) => {
        const notification: EmailNotification = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            readerId: lending.readerId._id,
            readerName: lending.readerId.name,
            readerEmail: lending.readerId.email,
            bookTitle: lending.bookId.title,
            dueDate: lending.dueDate,
            daysOverdue: getDaysOverdue(lending.dueDate),
            sentDate: new Date().toISOString(),
            type: 'overdue',
        };

        const emailData: Email = {
            to: lending.readerId.email,
            subject: 'Overdue Book Notification',
            body: `
Dear ${lending.readerId.name},

We hope this message finds you well. This is a friendly reminder that the book "${lending.bookId.title}" you borrowed is now overdue.

**Details:**
- **Book Title**: ${lending.bookId.title}
- **Due Date**: ${new Date(lending.dueDate).toLocaleDateString()}
- **Days Overdue**: ${getDaysOverdue(lending.dueDate)} day(s)

Please return the book to the library at your earliest convenience to avoid any additional fees. If you have already returned the book, kindly disregard this message.

For any questions or to discuss an extension, please contact us at library@support.com or visit our library during operating hours.

Thank you for your prompt attention to this matter.

Best regards,  
Your Library Team
        `,
        };

        const response = await sendOverdueNotifications(emailData);

        setEmailNotifications(prev => [...prev, notification]);
        setLendings(prev =>
            prev.map(l => l._id === lending._id ? { ...l, emailSent: true, lastEmailDate: new Date().toISOString().split('T')[0] } : l)
        );

        console.log(`Overdue email sent to ${lending.readerId.email} for book "${lending.bookId.title}"`);
    };
    const handleManualEmailSend = (lending: ExtendedBorrowBook) => {
        sendOverdueEmail(lending);
        setShowEmailModal(false);
        setSelectedOverdue(null);
    };

    const handleLendBook = async () => {
        if (!newLending.readerId || !newLending.bookId) {
            setError('Please select both a reader and a book');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const newLendingData = await lendBook(newLending.readerId, newLending.bookId);
            const reader = readers.find(r => r._id === newLendingData.readerId);
            const book = books.find(b => b._id === newLendingData.bookId);

            if (!reader || !book) {
                setError('Selected reader or book not found');
                return;
            }

            const transformedLending: ExtendedBorrowBook = {
                ...newLendingData,
                readerId: reader,
                bookId: book,
                emailSent: false,
                lastEmailDate: undefined,
            };

            setLendings([...lendings, transformedLending]);
            setBooks(prev =>
                prev.map(b => b._id === newLendingData.bookId ? { ...b, quantity: b.quantity - 1, available: b.quantity - 1 > 0 } : b)
            );
            setNewLending({ readerId: '', bookId: '' });
            setShowAddForm(false);
        } catch (err) {
            console.error('Error lending book:', err);
            setError('Failed to lend book. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReturnBook = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const returnedLending = await returnBook(id);
            setLendings(prev =>
                prev.map(lending =>
                    lending._id === id
                        ? { ...lending, returned: true, returnedDate: new Date().toISOString().split('T')[0] }
                        : lending
                )
            );
            setBooks(prev =>
                prev.map(book =>
                    book._id === returnedLending.bookId
                        ? { ...book, quantity: book.quantity + 1, available: true }
                        : book
                )
            );
        } catch (err) {
            console.error('Error returning book:', err);
            setError('Failed to return book. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredLendings = lendings.filter(lending => {
        const matchesSearch =
            lending.readerId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lending.bookId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lending.bookId.author.toLowerCase().includes(searchTerm.toLowerCase());
        if (filterType === 'active') return matchesSearch && !lending.returned;
        if (filterType === 'returned') return matchesSearch && lending.returned;
        return matchesSearch;
    });

    const overdueLendings = lendings.filter(l => !l.returned && getDaysOverdue(l.dueDate) > 0);
    const activeLendings = lendings.filter(l => !l.returned).length;

    // UI Components
    const LendingsPageContent = () => (
        <div>
            <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search lendings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as 'all' | 'active' | 'returned')}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Lendings</option>
                            <option value="active">Active Only</option>
                            <option value="returned">Returned Only</option>
                        </select>
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
                            Lend Book
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 border">
                        <div className="text-2xl font-bold text-blue-600">{lendings.length}</div>
                        <div className="text-gray-600 text-sm">Total Lendings</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border">
                        <div className="text-2xl font-bold text-green-600">{activeLendings}</div>
                        <div className="text-gray-600 text-sm">Active Lendings</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border">
                        <div className="text-2xl font-bold text-red-600">{overdueLendings.length}</div>
                        <div className="text-gray-600 text-sm">Overdue Items</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border">
                        <div className="text-2xl font-bold text-purple-600">{emailNotifications.length}</div>
                        <div className="text-gray-600 text-sm">Emails Sent</div>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="text-center p-8">
                    <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-gray-600">Loading data...</p>
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {!loading && !error && filteredLendings.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                    <p className="text-lg">No lendings found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria.</p>
                </div>
            )}

            {!loading && !error && viewMode === 'grid' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredLendings.map(lending => {
                        const isOverdue = !lending.returned && getDaysOverdue(lending.dueDate) > 0;
                        const daysOverdue = getDaysOverdue(lending.dueDate);

                        return (
                            <div key={lending._id} className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <RefreshCw size={20} className="text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">Lending #{lending._id}</h3>
                                            <p className="text-gray-500 text-sm">{formatDisplayDate(lending.borrowedDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                lending.returned ? 'bg-green-100 text-green-800' : isOverdue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                            }`}
                                        >
                                            {lending.returned ? 'Returned' : isOverdue ? `${daysOverdue} days overdue` : 'Active'}
                                        </span>
                                        {isOverdue && (
                                            <div className="flex items-center gap-1 text-xs">
                                                {lending.emailSent ? (
                                                    <div className="flex items-center gap-1 text-green-600">
                                                        <Mail size={12} />
                                                        <span>Email sent</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-orange-600">
                                                        <AlertTriangle size={12} />
                                                        <span>No email</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <User size={16} className="text-gray-400" />
                                        <div>
                                            <span className="font-medium">{lending.readerId.name}</span>
                                            <span className="text-gray-500 text-sm ml-2">({lending.readerId.id})</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <BookOpen size={16} className="text-gray-400" />
                                        <div>
                                            <span className="font-medium">{lending.bookId.title}</span>
                                            <span className="text-gray-500 text-sm block">by {lending.bookId.author}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span className="text-sm">
                                            Due: {formatDisplayDate(lending.dueDate)}
                                            {lending.returned && (
                                                <span className="text-green-600 ml-2">(Returned: {formatDisplayDate(lending.returnedDate!)})</span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {!lending.returned && (
                                        <button
                                            onClick={() => handleReturnBook(lending._id)}
                                            className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={16} />
                                            Return Book
                                        </button>
                                    )}
                                    {isOverdue && (
                                        <button
                                            onClick={() => {
                                                setSelectedOverdue(lending);
                                                setShowEmailModal(true);
                                            }}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                                        >
                                            <Mail size={16} />
                                            {lending.emailSent ? 'Resend' : 'Send'} Email
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : !loading && !error ? (
                <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left text-gray-700 font-semibold">ID</th>
                                <th className="p-4 text-left text-gray-700 font-semibold">Reader</th>
                                <th className="p-4 text-left text-gray-700 font-semibold">Book</th>
                                <th className="p-4 text-left text-gray-700 font-semibold">Borrowed</th>
                                <th className="p-4 text-left text-gray-700 font-semibold">Due Date</th>
                                <th className="p-4 text-left text-gray-700 font-semibold">Status</th>
                                <th className="p-4 text-left text-gray-700 font-semibold">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredLendings.map(lending => {
                                const isOverdue = !lending.returned && getDaysOverdue(lending.dueDate) > 0;
                                const daysOverdue = getDaysOverdue(lending.dueDate);
                                return (
                                    <tr key={lending._id} className="border-t hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-900">#{lending._id}</td>
                                        <td className="p-4">
                                            <div>
                                                <div className="text-gray-900 font-medium">{lending.readerId.name}</div>
                                                <div className="text-gray-500 text-sm">{lending.readerId.id}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <div className="text-gray-900 font-medium">{lending.bookId.title}</div>
                                                <div className="text-gray-500 text-sm">by {lending.bookId.author}</div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-700">{formatDisplayDate(lending.borrowedDate)}</td>
                                        <td className="p-4 text-gray-700">{formatDisplayDate(lending.dueDate)}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            lending.returned ? 'bg-green-100 text-green-800' : isOverdue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                                        }`}
                                                    >
                                                        {lending.returned ? 'Returned' : isOverdue ? `${daysOverdue}d overdue` : 'Active'}
                                                    </span>
                                                {isOverdue && (
                                                    <span className={`text-xs flex items-center gap-1 ${lending.emailSent ? 'text-green-600' : 'text-orange-600'}`}>
                                                            <Mail size={10} />
                                                        {lending.emailSent ? 'Email sent' : 'No email'}
                                                        </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {!lending.returned && (
                                                    <button
                                                        onClick={() => handleReturnBook(lending._id)}
                                                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                        title="Return Book"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                {isOverdue && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOverdue(lending);
                                                            setShowEmailModal(true);
                                                        }}
                                                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                        title="Send Overdue Email"
                                                    >
                                                        <Mail size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}
        </div>
    );

    const OverduePage = () => (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-red-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Overdue Books Management</h2>
                </div>
                <p className="text-gray-600">Monitor and manage overdue books with automated email notifications</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-600">{overdueLendings.length}</div>
                    <div className="text-red-700 text-sm">Total Overdue</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">{overdueLendings.filter(l => !l.emailSent).length}</div>
                    <div className="text-orange-700 text-sm">No Email Sent</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{overdueLendings.filter(l => l.emailSent).length}</div>
                    <div className="text-green-700 text-sm">Email Notifications Sent</div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md border">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Overdue Books</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left text-gray-700 font-semibold">Reader</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Book</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Due Date</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Days Overdue</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Email Status</th>
                            <th className="p-4 text-left text-gray-700 font-semibold">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {overdueLendings.map(lending => {
                            const daysOverdue = getDaysOverdue(lending.dueDate);
                            return (
                                <tr key={lending._id} className="border-t hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{lending.readerId.name}</div>
                                            <div className="text-gray-500 text-sm">{lending.readerId.email}</div>
                                            <div className="text-gray-500 text-sm">{lending.readerId.phone}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{lending.bookId.title}</div>
                                            <div className="text-gray-500 text-sm">by {lending.bookId.author}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-700">{formatDisplayDate(lending.dueDate)}</td>
                                    <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    daysOverdue > 30 ? 'bg-red-100 text-red-800' : daysOverdue > 14 ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {daysOverdue} days
                                            </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            {lending.emailSent ? (
                                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                                    <CheckCircle size={16} />
                                                    <span>Sent on {formatDisplayDate(lending.lastEmailDate!)}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                                    <AlertCircle size={16} />
                                                    <span>No email sent</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedOverdue(lending);
                                                    setShowEmailModal(true);
                                                }}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 text-sm"
                                            >
                                                <Mail size={14} />
                                                {lending.emailSent ? 'Resend' : 'Send'} Email
                                            </button>
                                            <button
                                                onClick={() => handleReturnBook(lending._id)}
                                                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2 text-sm"
                                            >
                                                <CheckCircle size={14} />
                                                Return
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    {overdueLendings.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <CheckCircle size={48} className="mx-auto mb-3 text-green-400" />
                            <p className="text-lg">No overdue books!</p>
                            <p className="text-sm">All books are returned on time.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md border mt-8">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Bell className="text-blue-600" />
                        Recent Email Notifications
                    </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {emailNotifications.slice(-10).reverse().map(notification => (
                        <div key={notification.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Mail size={16} className="text-blue-600" />
                                        <span className="font-medium text-gray-900">{notification.readerName}</span>
                                        <span className="text-gray-500 text-sm">({notification.readerEmail})</span>
                                    </div>
                                    <div className="text-gray-700 text-sm mb-1">
                                        Book: <strong>{notification.bookTitle}</strong>
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        Due: {formatDisplayDate(notification.dueDate)} • {notification.daysOverdue} days overdue
                                    </div>
                                </div>
                                <div className="text-right text-xs text-gray-500">{formatDisplayDate(notification.sentDate.split('T')[0])}</div>
                            </div>
                        </div>
                    ))}
                    {emailNotifications.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <Mail size={48} className="mx-auto mb-3 text-gray-400" />
                            <p>No email notifications sent yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
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
                        <div className="p-3 bg-orange-600 rounded-lg">
                            <RefreshCw size={32} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">Lendings Management</h1>
                    </div>
                    <p className="text-gray-600 text-lg">Track book lending, returns, and overdue items</p>
                </div>
                <div className="flex justify-center mb-8">
                    <div className="flex bg-white rounded-lg border shadow-sm p-1">
                        <button
                            onClick={() => setCurrentPage('lendings')}
                            className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
                                currentPage === 'lendings' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <RefreshCw size={18} />
                            Lendings
                        </button>
                        <button
                            onClick={() => setCurrentPage('overdue')}
                            className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 relative ${
                                currentPage === 'overdue' ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <AlertTriangle size={18} />
                            Overdue Books
                            {overdueLendings.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {overdueLendings.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                {currentPage === 'lendings' ? <LendingsPageContent /> : <OverduePage />}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                        <Plus className="text-blue-600" />
                                        Lend Book
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
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Select Reader</label>
                                        <select
                                            value={newLending.readerId}
                                            onChange={(e) => setNewLending({ ...newLending, readerId: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        <label className="block text-gray-700 font-medium mb-2">Select Book</label>
                                        <select
                                            value={newLending.bookId}
                                            onChange={(e) => setNewLending({ ...newLending, bookId: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Choose a book...</option>
                                            {books.filter(book => book.quantity > 0).map(book => (
                                                <option key={book._id} value={book._id}>
                                                    {book.title} by {book.author}
                                                </option>
                                            ))}
                                        </select>
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
                                        onClick={handleLendBook}
                                        disabled={!newLending.readerId || !newLending.bookId || loading}
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        {loading ? 'Lending...' : 'Lend Book'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showEmailModal && selectedOverdue && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-md">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                        <Mail className="text-red-600" />
                                        Send Overdue Notice
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowEmailModal(false);
                                            setSelectedOverdue(null);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="text-red-800">
                                            <p className="font-medium mb-2">Email will be sent to:</p>
                                            <p><strong>{selectedOverdue.readerId.name}</strong></p>
                                            <p className="text-sm">{selectedOverdue.readerId.email}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <p className="font-medium text-gray-900 mb-2">Book Details:</p>
                                        <p><strong>{selectedOverdue.bookId.title}</strong></p>
                                        <p className="text-sm text-gray-600">by {selectedOverdue.bookId.author}</p>
                                        <p className="text-sm text-red-600 mt-2">
                                            <strong>{getDaysOverdue(selectedOverdue.dueDate)} days overdue</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t bg-gray-50">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setShowEmailModal(false);
                                            setSelectedOverdue(null);
                                        }}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleManualEmailSend(selectedOverdue)}
                                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Mail size={18} />
                                        Send Email
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