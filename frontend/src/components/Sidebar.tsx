import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="bg-gray-800 text-white w-64 h-screen p-4 shadow-lg">
            <h2 className="text-xl font-bold mb-6">Menu</h2>
            <ul className="space-y-2">
                <li>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `block py-2 px-4 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/books" className={({ isActive }) => `block py-2 px-4 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                        Books
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/readers" className={({ isActive }) => `block py-2 px-4 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                        Readers
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/lendings" className={({ isActive }) => `block py-2 px-4 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                        Lendings
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;