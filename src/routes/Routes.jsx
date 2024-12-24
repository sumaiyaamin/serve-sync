// client/src/routes/Routes.jsx

// src/routes/Routes.jsx

import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../components/Home/Home';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';


export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
           
           
            
           
        ]
    }
]);