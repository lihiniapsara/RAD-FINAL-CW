import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit3, Trash2, X, Save, Calendar, Clock, Grid, List, Mail, Phone, MapPin, User } from 'lucide-react';
import { getReaders, addReader, updateReader, deleteReader } from '../service/readerService';
import type { Reader } from '@/types/Readers';

const ReadersPage: React.FC = () => {
    const [readers, setReaders] = useState<Reader[]>([]);
    const [newReader, setNewReader] = useState<Omit<Reader, '_id'>>({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [editingReader, setEditingReader] = useState<Reader | null>(null);
    const [search, setSearch] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        const fetchReaders = async () => {
            try {
                const fetchedReaders = await getReaders();
                setReaders(fetchedReaders);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch readers');
                console.error(err);
            }
        };

        if (token) {
            fetchReaders();
        }

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [token]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Colombo',
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Colombo',
        });
    };

    const handleAddReader = async () => {
        try {
            if (!newReader.id || !newReader.name || !newReader.email || !newReader.phone || !newReader.address) {
                setError('All fields are required');
                return;
            }
            const readerWithId = await addReader(newReader);
            setReaders([...readers, readerWithId]);
            setNewReader({ id: '', name: '', email: '', phone: '', address: '' });
            setShowAddForm(false);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add reader');
            console.error(err);
        }
    };

    const handleEditReader = async () => {
        if (!editingReader || !editingReader._id || !editingReader.id || !editingReader.name || !editingReader.email || !editingReader.phone || !editingReader.address) {
            setError('All reader fields are required');
            return;
        }
        try {
            const updatedReader = await updateReader(editingReader._id, editingReader);
            setReaders(readers.map(reader => (reader._id === editingReader._id ? updatedReader : reader)));
            setEditingReader(null);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update reader');
            console.error(err);
        }
    };

    const handleDeleteReader = async (id: string) => {
        try {
            await deleteReader(id);
            setReaders(readers.filter(reader => reader._id !== id));
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete reader');
            console.error(err);
        }
    };

    const filteredReaders = readers.filter(
        reader =>
            reader.name.toLowerCase().includes(search.toLowerCase()) ||
            reader.email.toLowerCase().includes(search.toLowerCase()) ||
            reader.phone.toLowerCase().includes(search.toLowerCase())
    );

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
                    <p className="text-gray-600">You need to be logged in to access the Readers Management page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-4 mb-6 px-6 py-3 bg-white rounded-full shadow-sm border">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Calendar size={18} />
                            <span className="text-sm font-medium">{formatDate(currentTime)}</span>
                        </div>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <div className="flex items-center gap-2 text-green-600">
                            <Clock size={18} />
                            <span className="text-sm font-mono font-bold">{formatTime(currentTime)}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="p-3 bg-blue-600 rounded-lg">
                            <Users size={32} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">Readers Management</h1>
                    </div>
                    <p className="text-gray-600 text-lg">Manage your library members and their information</p>
                </div>

                {/* Controls */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search readers, emails, phones..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                {viewMode === 'grid' ? <List size={18} /> : <Grid size={18} />}
                                {viewMode === 'grid' ? 'Table' : 'Grid'}
                            </button>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add Reader
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-4 border">
                            <div className="text-2xl font-bold text-blue-600">{readers.length}</div>
                            <div className="text-gray-600 text-sm">Total Readers</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border">
                            <div className="text-2xl font-bold text-green-600">{readers.length}</div>
                            <div className="text-gray-600 text-sm">Active Members</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border">
                            <div className="text-2xl font-bold text-orange-600">
                                {filteredReaders.length}
                            </div>
                            <div className="text-gray-600 text-sm">Search Results</div>
                        </div>
                    </div>
                </div>

                {/* Readers Display */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredReaders.map(reader => (
                            <div key={reader._id} className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <User size={20} className="text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{reader.name}</h3>
                                            <p className="text-gray-500 text-sm">ID: {reader.id}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Mail size={16} className="text-gray-400" />
                                        <span className="text-sm truncate">{reader.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Phone size={16} className="text-gray-400" />
                                        <span className="text-sm">{reader.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-700">
                                        <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm leading-relaxed">{reader.address}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            console.log('Editing reader:', reader); // Debug
                                            setEditingReader(reader);
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit3 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReader(reader._id)}
                                        className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-left text-gray-700 font-semibold">ID</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Name</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Email</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Phone</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Address</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Status</th>
                                    <th className="p-4 text-left text-gray-700 font-semibold">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredReaders.map(reader => (
                                    <tr key={reader._id} className="border-t hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-900">{reader.id}</td>
                                        <td className="p-4 text-gray-900 font-medium">{reader.name}</td>
                                        <td className="p-4 text-gray-700">{reader.email}</td>
                                        <td className="p-4 text-gray-700">{reader.phone}</td>
                                        <td className="p-4 text-gray-700 max-w-xs truncate">{reader.address}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        console.log('Editing reader:', reader); // Debug
                                                        setEditingReader(reader);
                                                    }}
                                                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReader(reader._id)}
                                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Add Reader Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                        <Plus className="text-blue-600" />
                                        Add New Reader
                                    </h3>
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Reader ID</label>
                                            <input
                                                type="text"
                                                value={newReader.id}
                                                onChange={e => setNewReader({ ...newReader, id: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter reader ID"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={newReader.name}
                                                onChange={e => setNewReader({ ...newReader, name: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={newReader.email}
                                                onChange={e => setNewReader({ ...newReader, email: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                                            <input
                                                type="text"
                                                value={newReader.phone}
                                                onChange={e => setNewReader({ ...newReader, phone: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Address</label>
                                        <textarea
                                            value={newReader.address}
                                            onChange={e => setNewReader({ ...newReader, address: e.target.value })}
                                            rows={3}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            placeholder="Enter full address"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t bg-gray-50">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddReader}
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} />
                                        Add Reader
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Reader Modal */}
                {editingReader && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                        <Edit3 className="text-blue-600" />
                                        Edit Reader
                                    </h3>
                                    <button
                                        onClick={() => setEditingReader(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Reader ID</label>
                                            <input
                                                type="text"
                                                value={editingReader.id}
                                                onChange={e => setEditingReader({ ...editingReader, id: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={editingReader.name}
                                                onChange={e => setEditingReader({ ...editingReader, name: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={editingReader.email}
                                                onChange={e => setEditingReader({ ...editingReader, email: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                                            <input
                                                type="text"
                                                value={editingReader.phone}
                                                onChange={e => setEditingReader({ ...editingReader, phone: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Address</label>
                                        <textarea
                                            value={editingReader.address}
                                            onChange={e => setEditingReader({ ...editingReader, address: e.target.value })}
                                            rows={3}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t bg-gray-50">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setEditingReader(null)}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEditReader}
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadersPage;