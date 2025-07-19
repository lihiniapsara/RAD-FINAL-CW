import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';

const SignUpPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '', name: '' });
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate signup and login (replace with API call)
        login('user123', credentials.name);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg space-y-4 w-96">
                <h1 className="text-2xl font-bold text-center">Sign Up</h1>
                <input
                    type="text"
                    placeholder="Name"
                    value={credentials.name}
                    onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUpPage;