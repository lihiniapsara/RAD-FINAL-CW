import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminRoutes from './pages/AdminRoutes';
import { useAuth } from './context/useAuth';

const Router = () => {
  const { user } = useAuth();

  return (
      <Routes>
        {user ? (
            <Route element={<Layout />}>
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Route>
        ) : (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </>
        )}
        <Route path="*" element={<LoginPage />} />
      </Routes>
  );
};

export default Router;