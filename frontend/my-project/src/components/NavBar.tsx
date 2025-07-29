import React from 'react';

import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { logout as logoutAction } from '../store/slice/AuthSlice';
import { logout as logoutService } from '../service/userService';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logoutService();
      dispatch(logoutAction());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Book Club Library</h1>
        <div className="space-x-4">
          <NavLink to="/dashboard" className="hover:underline">Dashboard</NavLink>
          <NavLink to="/readers" className="hover:underline">Readers</NavLink>
          <NavLink to="/books" className="hover:underline">Books</NavLink>
          <NavLink to="/lendings" className="hover:underline">Lendings</NavLink>
          <NavLink to="/overdue" className="hover:underline">Overdue</NavLink>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;