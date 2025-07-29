import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, User, BookOpen, Send, AlertTriangle } from 'lucide-react';

interface Lending {
    _id: string;
    readerId: { name: string };
    bookId: { title: string };
    dueDate: string;
    returned: boolean;
}

const mockOverdueLendings: Lending[] = [
    { _id: '1', readerId: { name: 'Kasun Perera' }, bookId: { title: 'JavaScript: The Good Parts' }, dueDate: '2024-01-15', returned: false },
    { _id: '2', readerId: { name: 'Nimali Silva' }, bookId: { title: 'Clean Code' }, dueDate: '2024-01-10', returned: false },
    { _id: '3', readerId: { name: 'Rohan Fernando' }, bookId: { title: 'Design Patterns' }, dueDate: '2024-01-08', returned: false },
];

const OverduePage: React.FC = () => {
    const [overdueLendings, setOverdueLendings] = useState<Lending[]>([]);
    const [loading, setLoading] = useState(false);
    const [notificationSent, setNotificationSent] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchOverdueLendings = async () => {
            try {
                setLoading(true);
                // Simulate API call (replace with real API)
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (isMounted) {
                    setOverdueLendings(mockOverdueLendings);
                    setIsVisible(true);
                }
            } catch (err) {
                if (isMounted) setError('Failed to load overdue lendings');
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchOverdueLendings();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleSendNotifications = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setNotificationSent(true);
        setLoading(false);
        setTimeout(() => setNotificationSent(false), 3000);
    };

    const calculateOverdueDays = (dueDate: string) => {
        const due = new Date(dueDate);
        const today = new Date();
        return Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    };

    const getOverdueSeverity = (days: number) => {
        if (days <= 7) return 'low';
        if (days <= 14) return 'medium';
        return 'high';
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'medium': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
            case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    if (loading && overdueLendings.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-40 left-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                </div>
                <div className="relative z-10 container mx-auto px-6 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
                <div className="relative z-10 container mx-auto px-6 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-red-400">Error: {error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 left-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-8">
                <div className={`mb-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg">
                                <AlertTriangle className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                                    Overdue Books
                                </h1>
                                <p className="text-gray-300 mt-2 text-lg">Manage and track overdue book returns</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className={`bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Total Overdue</p>
                                    <p className="text-3xl font-bold text-white">{overdueLendings.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className={`bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '350ms' }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Avg Overdue Days</p>
                                    <p className="text-3xl font-bold text-white">
                                        {overdueLendings.length > 0
                                            ? Math.round(overdueLendings.reduce((acc, lending) => acc + calculateOverdueDays(lending.dueDate), 0) / overdueLendings.length)
                                            : 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={`bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Affected Readers</p>
                                    <p className="text-3xl font-bold text-white">{new Set(overdueLendings.map(l => l.readerId.name)).size}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`flex justify-between items-center bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '650ms' }}>
                        <div className="flex items-center gap-3">
                            <Bell className="h-5 w-5 text-purple-400" />
                            <span className="text-gray-300">Send reminders to overdue readers</span>
                        </div>
                        <button
                            onClick={handleSendNotifications}
                            disabled={loading || overdueLendings.length === 0}
                            aria-label="Send overdue notifications"
                            className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-500 transform hover:scale-105 ${
                                notificationSent
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-red-600 shadow-lg shadow-purple-500/25'
                            } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Sending...
                                </>
                            ) : notificationSent ? (
                                <>
                                    <div className="h-4 w-4 bg-white rounded-full flex items-center justify-center">
                                        <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                                    </div>
                                    Notifications Sent!
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Send Notifications
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className={`bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '800ms' }}>
                    <div className="overflow-x-auto">
                        {overdueLendings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
                                    <BookOpen className="h-12 w-12 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-2">No Overdue Books!</h3>
                                <p className="text-gray-400">All books have been returned on time.</p>
                            </div>
                        ) : (
                            <table className="w-full" role="table">
                                <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="text-left py-6 px-6 font-semibold text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Reader
                                        </div>
                                    </th>
                                    <th className="text-left py-6 px-6 font-semibold text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" />
                                            Book Title
                                        </div>
                                    </th>
                                    <th className="text-left py-6 px-6 font-semibold text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Due Date
                                        </div>
                                    </th>
                                    <th className="text-left py-6 px-6 font-semibold text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Overdue Days
                                        </div>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {overdueLendings.map((lending, index) => {
                                    const dueDate = new Date(lending.dueDate);
                                    const overdueDays = calculateOverdueDays(lending.dueDate);
                                    const severity = getOverdueSeverity(overdueDays);

                                    return (
                                        <tr
                                            key={lending._id}
                                            className="border-b border-white/10 hover:bg-white/5 transition-all duration-300"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <td className="py-6 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                                        {lending.readerId.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white text-lg">{lending.readerId.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-10 bg-gradient-to-b from-slate-600 to-slate-800 rounded-sm flex items-center justify-center shadow-lg">
                                                        <BookOpen className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="font-medium text-white text-lg">{lending.bookId.title}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="text-gray-300">{dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6">
                                                    <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-lg ${getSeverityColor(severity)}`}>
                                                        <Clock className="h-3 w-3" />
                                                        {overdueDays} days
                                                    </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {notificationSent && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    Notifications sent successfully!
                </div>
            )}
        </div>
    );
};

export default OverduePage;