import React from 'react';

const ReadersTable = ({ readers, onEdit, onDelete }: { readers: any[]; onEdit?: (reader: any) => void; onDelete?: (id: string) => void }) => {
    return (
        <table className="min-w-full bg-white border rounded-lg shadow-sm mt-4">
            <thead>
            <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Actions</th>
            </tr>
            </thead>
            <tbody>
            {readers.map((reader) => (
                <tr key={reader._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{reader.name}</td>
                    <td className="py-2 px-4 border-b">{reader.email}</td>
                    <td className="py-2 px-4 border-b">{reader.phone}</td>
                    <td className="py-2 px-4 border-b">
                        <button onClick={() => onEdit?.(reader)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">
                            Edit
                        </button>
                        <button onClick={() => onDelete?.(reader._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default ReadersTable;