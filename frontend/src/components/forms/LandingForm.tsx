import React, { useState } from 'react';

const LandingForm = ({ onSubmit, initialData }: { onSubmit: (data: any) => void; initialData?: any }) => {
    const [formData, setFormData] = useState(initialData || { readerId: '', bookId: '', dueDate: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg space-y-4">
            <input
                type="text"
                placeholder="Reader ID"
                value={formData.readerId}
                onChange={(e) => setFormData({ ...formData, readerId: e.target.value })}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="text"
                placeholder="Book ID"
                value={formData.bookId}
                onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full p-2 border rounded"
                required
            />
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
                {initialData ? 'Update' : 'Lend'} Book
            </button>
        </form>
    );
};

export default LandingForm;