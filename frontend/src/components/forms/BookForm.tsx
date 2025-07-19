import React, { useState } from 'react';

const BookForm = ({ onSubmit, initialData }: { onSubmit: (data: any) => void; initialData?: any }) => {
    const [formData, setFormData] = useState(initialData || { title: '', author: '', isbn: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg space-y-4">
            <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="text"
                placeholder="Author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="text"
                placeholder="ISBN"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full p-2 border rounded"
                required
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                {initialData ? 'Update' : 'Add'} Book
            </button>
        </form>
    );
};

export default BookForm;