import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow container mx-auto p-4">
                <Outlet />
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Layout;