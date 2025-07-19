import React from 'react';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentActivity from '../components/dashboard/RecentActivity';

const Dashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardStats />
                <DashboardCharts />
                <RecentActivity />
            </div>
        </div>
    );
};

export default Dashboard;