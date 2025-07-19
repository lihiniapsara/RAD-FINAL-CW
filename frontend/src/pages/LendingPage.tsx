import React, { useEffect, useState } from 'react';
import LandingTable from '../components/tables/LandingTable';
import LandingForm from '../forms/LandingForm';

const LendingPage = () => {
    const [lendings, setLendings] = useState([]);
    const [selectedLending, setSelectedLending] = useState(null);

    useEffect(() => {
        fetch('/api/lendings')
            .then((res) => res.json())
            .then((data) => setLendings(data));
    }, []);

    const handleSubmit = (data: any) => {
        if (selectedLending) {
            fetch(`/api/lendings/${selectedLending._id}`, { method: 'PUT', body: JSON.stringify(data) })
                .then(() => setLendings(lendings.map((l) => (l._id === selectedLending._id ? data : l))));
        } else {
            fetch('/api/lendings', { method: 'POST', body: JSON.stringify(data) })
                .then((res) => res.json())
                .then((newLending) => setLendings([...lendings, newLending]));
        }
        setSelectedLending(null);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Lendings</h1>
            <LandingForm onSubmit={handleSubmit} initialData={selectedLending} />
            <LandingTable lendings={lendings} onEdit={(lending) => setSelectedLending(lending)} />
        </div>
    );
};

export default LendingPage;