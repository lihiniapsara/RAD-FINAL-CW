import { createBrowserRouter, Navigate, Link } from 'react-router-dom';
import AuthForms from './components/LoginForm.tsx';
import BooksPage from './pages/BooksPage.tsx';
import ReadersPage from './pages/ReadersPage.tsx';
import SimpleHomePage from './pages/HomePage.tsx';
import LendingsPage from './pages/LendingsPage.tsx'; // Fixed from LendingsPage.tsx to LendingsPage.tsx

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
        element: <SimpleHomePage />,
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
        element: <LendingsPage />,
    }
]);