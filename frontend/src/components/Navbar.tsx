import React from 'react';
import { useAuth } from '../../context/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Book Club Library</h1>
                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="text-sm">Welcome, {user.name}</span>
                        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;