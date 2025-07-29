import { createBrowserRouter, Navigate, Link } from 'react-router-dom';
import AuthForms from "./components/LoginForm.tsx";
import HomePage from "./pages/HomePage.tsx";
import BooksPage from "./pages/BooksPage.tsx";
import ReadersPage from "./pages/ReadersPage.tsx";
import LendingPage from "./pages/OverduePage.tsx";
import * as path from "path";
import OverduePage from "./pages/OverduePage.tsx"; // If you meant OverduePage, otherwise use LendingPage.tsx if it exists

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/login',
        element: <AuthForms />,
    },
    {
        path: '/home',
        element: <HomePage />,
    },
    {
      path: '/books',
      element: <BooksPage />,
    },
    {
      path: '/readers',
      element: <ReadersPage />,
    },
    {
      path: '/lendings',
      element: <LendingPage />,
    },
    {
        path: '/overdue',
        element: <OverduePage/>,
    }
]);