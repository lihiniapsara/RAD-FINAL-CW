// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './index.css'; // index.css src ෆෝල්ඩරයේ තිබෙනවා යැයි උපකල්පනය කරමින්
import { router } from './router.tsx'; // path එක නිවැරදි කළා
import store from './store/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);