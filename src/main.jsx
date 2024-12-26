import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './App'; 
import AuthProvider from './providers/AuthProvider';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    </React.StrictMode>
);