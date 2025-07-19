import React, { useEffect, useState } from 'react';
import ReadersTable from '../components/tables/ReadersTable';
import ReaderForm from '../forms/ReaderForm';

const ReadersPage = () => {
    const [readers, setReaders] = useState([]);
    const [selectedReader, setSelectedReader] = useState(null);

    useEffect(() => {
        fetch('/api/readers')
            .then((res) => res.json())
            .then((data) => setReaders(data));
    }, []);

    const handleSubmit = (data: any) => {
        if (selectedReader) {
            fetch(`/api/readers/${selectedReader._id}`, { method: 'PUT', body: JSON.stringify(data) })
                .then(() => setReaders(readers.map((r) => (r._id === selectedReader._id ? data : r))));
        } else {
            fetch('/api/readers', { method: 'POST', body: JSON.stringify(data) })
                .then((res) => res.json())
                .then((newReader) => setReaders([...readers, newReader]));
        }
        setSelectedReader(null);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Readers</h1>
            <ReaderForm onSubmit={handleSubmit} initialData={selectedReader} />
            <ReadersTable readers={readers} onEdit={(reader) => setSelectedReader(reader)} />
        </div>
    );
};

export default ReadersPage;