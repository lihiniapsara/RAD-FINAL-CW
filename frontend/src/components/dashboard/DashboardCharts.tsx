import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardCharts = () => {
    const data = {
        labels: ['Books', 'Readers', 'Lendings'],
        datasets: [
            {
                label: 'Count',
                data: [150, 50, 100],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Library Statistics</h2>
            <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Library Overview' } } }} />
        </div>
    );
};

export default DashboardCharts;