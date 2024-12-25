// src/routes/Routes.jsx

import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../components/Home/Home';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import PrivateRoute from './PrivateRoute';
import VolunteerPostDetails from '../components/VolunteerPostDetails/VolunteerPostDetails';
import AddVolunteerPost from '../components/AddVolunteerPost/AddVolunteerPost';
import AllVolunteerPosts from '../components/AllVolunteerPosts/AllVolunteerPosts';
import ManagePosts from '../components/ManagePosts/ManagePosts'; // Import the ManagePosts component

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
            {
                path: "/add-volunteer-post",
                element: (
                    <PrivateRoute>
                        <AddVolunteerPost />
                    </PrivateRoute>
                )
            },
            {
                path: "/volunteer-posts/:id",
                element: (
                    <PrivateRoute>
                        <VolunteerPostDetails />
                    </PrivateRoute>
                )
            },
            {
                path: "/all-volunteer-posts",
                element: <AllVolunteerPosts />
            },
            {
                path: "/manage-my-posts", // New route for managing posts
                element: (
                    <PrivateRoute>
                        <ManagePosts />
                    </PrivateRoute>
                )
            },
        ]
    }
]);