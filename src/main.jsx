import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './App'; // Import MainApp
import AuthProvider from './providers/AuthProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <MainApp /> {/* Render MainApp instead of App */}
        </AuthProvider>
    </React.StrictMode>
);