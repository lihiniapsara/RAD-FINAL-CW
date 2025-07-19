import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
    );
};

export default AdminRoutes;