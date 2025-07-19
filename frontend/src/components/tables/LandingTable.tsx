import React from 'react';

const LandingTable = ({ lendings, onEdit, onDelete }: { lendings: any[]; onEdit?: (lending: any) => void; onDelete?: (id: string) => void }) => {
    return (
        <table className="min-w-full bg-white border rounded-lg shadow-sm mt-4">
            <thead>
            <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Reader</th>
                <th className="py-2 px-4 border-b">Book</th>
                <th className="py-2 px-4 border-b">Due Date</th>
                <th className="py-2 px-4 border-b">Actions</th>
            </tr>
            </thead>
            <tbody>
            {lendings.map((lending) => (
                <tr key={lending._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{lending.readerId?.name || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{lending.bookId?.title || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{new Date(lending.dueDate).toDateString()}</td>
                    <td className="py-2 px-4 border-b">
                        <button onClick={() => onEdit?.(lending)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">
                            Edit
                        </button>
                        <button onClick={() => onDelete?.(lending._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default LandingTable;