import React from 'react';

const RecentActivity = () => {
    const activities = [
        { id: 1, action: 'Book lent to John', date: '07/15/2025' },
        { id: 2, action: 'Book returned by Jane', date: '07/14/2025' },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <ul className="space-y-2">
                {activities.map((activity) => (
                    <li key={activity.id} className="flex justify-between text-sm text-gray-600">
                        <span>{activity.action}</span>
                        <span>{activity.date}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentActivity;