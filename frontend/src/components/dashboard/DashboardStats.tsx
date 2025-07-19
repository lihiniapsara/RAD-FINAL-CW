import React from 'react';

const DashboardStats = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="p-4 bg-white rounded-lg text-center">
                <h3 className="text-lg font-semibold">Total Books</h3>
                <p className="text-2xl">150</p>
            </div>
            <div className="p-4 bg-white rounded-lg text-center">
                <h3 className="text-lg font-semibold">Total Readers</h3>
                <p className="text-2xl">50</p>
            </div>
            <div className="p-4 bg-white rounded-lg text-center">
                <h3 className="text-lg font-semibold">Overdue</h3>
                <p className="text-2xl text-red-500">5</p>
            </div>
        </div>
    );
};

export default DashboardStats;