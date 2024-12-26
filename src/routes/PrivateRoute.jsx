import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import PropTypes from 'prop-types';
import axiosSecure from '.././api/axiosSecure';
import { motion } from 'framer-motion';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    const [tokenVerified, setTokenVerified] = useState(false);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (token && user) {
                    // Verify token with backend
                    await axiosSecure.post('/verify-token');
                    setTokenVerified(true);
                } else {
                    setTokenVerified(false);
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                localStorage.removeItem('accessToken');
                setTokenVerified(false);
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [user]);

    if (loading || verifying) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-gray-600"
                >
                    {loading ? 'Loading...' : 'Verifying access...'}
                </motion.p>
            </div>
        );
    }

    if (!user || !tokenVerified) {
        // Store the location they tried to visit
        return (
            <Navigate 
                to="/login" 
                state={{ from: location }} 
                replace 
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {children}
        </motion.div>
    );
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default PrivateRoute;