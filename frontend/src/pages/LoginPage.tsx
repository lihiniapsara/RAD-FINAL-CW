import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IReader } from '../types/Book';

const LoginPage: React.FC = () => {
  const [readers, setReaders] = useState<IReader[]>([]);
  const [newReader, setNewReader] = useState({ name: '', email: '', phone: '', address: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReaders();
  }, []);

  const fetchReaders = async () => {
    const res = await axios.get('/api/readers', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setReaders(res.data);
  };

  const addReader = async () => {
    await axios.post('/api/readers', newReader, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    fetchReaders();
    setNewReader({ name: '', email: '', phone: '', address: '' });
  };

  const filteredReaders = readers.filter(reader => reader.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Readers</h1>
      <input
        type="text"
        placeholder="Search readers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <div className="mb-4">
        <input type="text" placeholder="Name" value={newReader.name} onChange={(e) => setNewReader({ ...newReader, name: e.target.value })} className="border p-2 mr-2" />
        <input type="email" placeholder="Email" value={newReader.email} onChange={(e) => setNewReader({ ...newReader, email: e.target.value })} className="border p-2 mr-2" />
        <input type="text" placeholder="Phone" value={newReader.phone} onChange={(e) => setNewReader({ ...newReader, phone: e.target.value })} className="border p-2 mr-2" />
        <input type="text" placeholder="Address" value={newReader.address} onChange={(e) => setNewReader({ ...newReader, address: e.target.value })} className="border p-2 mr-2" />
        <button onClick={addReader} className="bg-blue-500 text-white p-2 rounded">Add</button>
      </div>
      <table className="w-full border">
        <thead><tr><th className="border p-2">Name</th><th className="border p-2">Email</th><th className="border p-2">Phone</th><th className="border p-2">Address</th><th className="border p-2">Actions</th></tr></thead>
        <tbody>{filteredReaders.map(reader => <tr key={reader._id}><td className="border p-2">{reader.name}</td><td className="border p-2">{reader.email}</td><td className="border p-2">{reader.phone}</td><td className="border p-2">{reader.address}</td><td className="border p-2"><button className="bg-yellow-500 text-white p-1 mr-2">Edit</button><button className="bg-red-500 text-white p-1">Delete</button></td></tr>)}</tbody>
      </table>
    </div>
  );
};

export default LoginPage;
