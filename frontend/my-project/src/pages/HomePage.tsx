import React, { useState, useEffect } from 'react';
import { BookOpen, Users, RefreshCw, Calendar, Clock } from 'lucide-react';

const SimpleHomePage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

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

    const cardData = [
        {
            to: "/books",
            icon: BookOpen,
            title: "Books",
            description: "Manage book catalog",
            color: "bg-blue-600 hover:bg-blue-700",
            textColor: "text-blue-600"
        },
        {
            to: "/readers",
            icon: Users,
            title: "Readers",
            description: "Manage reader information",
            color: "bg-green-600 hover:bg-green-700",
            textColor: "text-green-600"
        },
        {
            to: "/lendings",
            icon: RefreshCw,
            title: "Lendings",
            description: "Manage book lending and returns",
            color: "bg-purple-600 hover:bg-purple-700",
            textColor: "text-purple-600"
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header with Date/Time */}
                <div className="text-center mb-12">
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

                    <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
                        Book Club
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-600">
                        Library Management
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Experience seamless library management with our modern, intuitive platform designed for efficiency and elegance.
                    </p>
                </div>

                {/* Centered Navigation Cards */}
                <div className="flex justify-center items-center mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl">
                        {cardData.map((card) => {
                            const IconComponent = card.icon;
                            return (
                                <a
                                    key={card.to}
                                    href={card.to}
                                    className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
                                >
                                    <div className="p-8 text-center">
                                        <div className={`inline-flex p-4 rounded-full ${card.color} mb-6 transition-all duration-300 group-hover:scale-110`}>
                                            <IconComponent size={32} className="text-white" />
                                        </div>
                                        <h3 className={`text-2xl font-bold mb-3 ${card.textColor} transition-colors duration-300`}>
                                            {card.title}
                                        </h3>
                                        <p className="text-gray-600 text-base leading-relaxed">
                                            {card.description}
                                        </p>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
                        <div className="text-gray-600">Total Books</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">342</div>
                        <div className="text-gray-600">Active Readers</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">85</div>
                        <div className="text-gray-600">Books on Loan</div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 py-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    "The Great Gatsby" was borrowed by John Smith
                                </span>
                                <span className="text-xs text-gray-400 ml-auto">2 minutes ago</span>
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    New reader "Alice Johnson" registered
                                </span>
                                <span className="text-xs text-gray-400 ml-auto">15 minutes ago</span>
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    "To Kill a Mockingbird" is overdue (Reader: Mike Wilson)
                                </span>
                                <span className="text-xs text-gray-400 ml-auto">1 hour ago</span>
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    "1984" was returned by Sarah Davis
                                </span>
                                <span className="text-xs text-gray-400 ml-auto">3 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">System Online & Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleHomePage;