import React, { useState, useEffect } from 'react';
import { BookOpen, Users, RefreshCw, Calendar, Clock } from 'lucide-react';

const HomePage: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Update time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Trigger entrance animation
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

    const cardData = [
        {
            to: "/books",
            icon: BookOpen,
            title: "Books",
            description: "Manage book catalog",
            gradient: "from-green-400 via-teal-500 to-blue-500",
            hoverGradient: "from-green-500 via-teal-600 to-blue-600",
            delay: "300ms",
        },
        {
            to: "/readers",
            icon: Users,
            title: "Readers",
            description: "Manage reader information",
            gradient: "from-blue-400 via-purple-500 to-pink-500",
            hoverGradient: "from-blue-500 via-purple-600 to-pink-600",
            delay: "150ms",
        },

        {
            to: "/lendings",
            icon: RefreshCw,
            title: "Lendings",
            description: "Manage book lending and returns",
            gradient: "from-orange-400 via-red-500 to-pink-500",
            hoverGradient: "from-orange-500 via-red-600 to-pink-600",
            delay: "0ms",
        },
        {
            to: "/overdue",
            icon: Calendar,
            title: "Overdue",
            description: "View overdue lendings",
            gradient: "from-yellow-400 via-orange-500 to-amber-500",
            hoverGradient: "from-yellow-500 via-orange-600 to-amber-600",
            delay: "450ms",
        },
    ];

    // Split cardData into two rows
    const firstRow = cardData.slice(0, 2); // Lendings, Readers
    const secondRow = cardData.slice(2, 4); // Books, Overdue

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 left-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-8">
                {/* Header with Date/Time */}
                <div
                    className={`text-center mb-12 transition-all duration-1000 transform ${
                        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
                    }`}
                >
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

                    <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Book Club
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-300">
                        Library Management
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Experience seamless library management with our modern, intuitive platform designed for efficiency and elegance.
                    </p>
                </div>

                {/* Navigation Cards - First Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
                    {firstRow.map((card, index) => {
                        const IconComponent = card.icon;
                        return (
                            <a
                                key={card.to}
                                href={card.to}
                                className={`group relative block transition-all duration-700 transform ${
                                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                                style={{
                                    transitionDelay: isVisible ? card.delay : '0ms',
                                }}
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 h-64 transition-all duration-500 group-hover:scale-105 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
                                    {/* Gradient background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                    {/* Animated border */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                                    {/* Content */}
                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <div>
                                            <div
                                                className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${card.gradient} mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                                            >
                                                <IconComponent size={32} className="text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                                                {card.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                                            {card.description}
                                        </p>
                                    </div>

                                    {/* Hover effect particles */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                                        <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                                        <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>

                {/* Navigation Cards - Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {secondRow.map((card, index) => {
                        const IconComponent = card.icon;
                        return (
                            <a
                                key={card.to}
                                href={card.to}
                                className={`group relative block transition-all duration-700 transform ${
                                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                                style={{
                                    transitionDelay: isVisible ? card.delay : '0ms',
                                }}
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 h-64 transition-all duration-500 group-hover:scale-105 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
                                    {/* Gradient background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                    {/* Animated border */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                                    {/* Content */}
                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <div>
                                            <div
                                                className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${card.gradient} mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                                            >
                                                <IconComponent size={32} className="text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                                                {card.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                                            {card.description}
                                        </p>
                                    </div>

                                    {/* Hover effect particles */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                                        <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                                        <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>

                {/* Footer */}
                <div
                    className={`text-center mt-16 transition-all duration-1000 transform ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                    style={{ transitionDelay: isVisible ? '600ms' : '0ms' }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg rounded-full border border-white/10">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-400">System Online & Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;