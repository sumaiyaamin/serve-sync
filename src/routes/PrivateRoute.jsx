import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import PropTypes from 'prop-types';
import axiosSecure from '../api/axiosSecure';

const PrivateRoute = ({ children }) => {
    const { user, loading, logOut } = useContext(AuthContext);
    const [tokenVerified, setTokenVerified] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const verifyToken = async () => {
            if (user) {
                try {
                    // Verify token with backend
                    const response = await axiosSecure.get('/verify-token');
                    setTokenVerified(response.data.valid);
                } catch (error) {
                    console.error('Token verification failed:', error);
                    // If token is invalid, log out the user
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        await logOut();
                        setTokenVerified(false);
                    }
                }
            }
            setVerifying(false);
        };

        verifyToken();
    }, [user, logOut]);

    if (loading || verifying) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="relative">
                    {/* Main spinner */}
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
                    {/* Inner spinner */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="animate-ping h-4 w-4 rounded-full bg-orange-500 opacity-75"></div>
                    </div>
                </div>
                <p className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                    Verifying access...
                </p>
            </div>
        );
    }

    if (!user || !tokenVerified) {
        // Store the attempted location for redirect after login
        return <Navigate 
            to="/login" 
            state={{ from: location }} 
            replace 
        />;
    }

    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default PrivateRoute;