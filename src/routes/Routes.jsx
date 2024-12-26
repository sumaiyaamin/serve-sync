import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../components/Home/Home';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import PrivateRoute from './PrivateRoute';
import VolunteerPostDetails from '../components/VolunteerPostDetails/VolunteerPostDetails';
import AddVolunteerPost from '../components/AddVolunteerPost/AddVolunteerPost';
import AllVolunteerPosts from '../components/AllVolunteerPosts/AllVolunteerPosts';
import ManagePosts from '../components/ManagePosts/ManagePosts';
import NotFound from '../components/NotFound/NotFound';

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
                path: "/manage-my-posts", 
                element: (
                    <PrivateRoute>
                        <ManagePosts />
                    </PrivateRoute>
                )
            },
        ],
        // Add error element for the main layout
        errorElement: <NotFound />
    },
    // Catch all other routes that don't match
    {
        path: "/*",
        element: <NotFound />
    }
]);

export default router;