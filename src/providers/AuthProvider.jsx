import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    updateProfile, 
    
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";
import toast from "react-hot-toast";


export const AuthContext = createContext(null);

const axiosSecure = axios.create({
    baseURL: 'https://serve-sync-server.vercel.app',
    withCredentials: true,
    timeout: 8000
});

// Add interceptors to handle requests and responses
axiosSecure.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Handle unauthorized access
            await auth.signOut();
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Export axiosSecure for use in other components
export { axiosSecure };

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = async (email, password) => {
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const response = await axiosSecure.post('/jwt', { email: result.user.email });
            localStorage.setItem('accessToken', response.data.token);
            return result;
        } catch (error) {
            toast.error(error.message.replace('Firebase:', ''));
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfile = async (name, photo) => {
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: photo,
            });
            setUser(prev => ({
                ...prev,
                displayName: name,
                photoURL: photo,
            }));
        } catch (error) {
            toast.error(error.message.replace('Firebase:', ''));
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const response = await axiosSecure.post('/jwt', { email: result.user.email });
            localStorage.setItem('accessToken', response.data.token);
            return result;
        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                toast.error('Invalid email or password');
            } else {
                toast.error(error.message.replace('Firebase:', ''));
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const googleSignIn = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            
            // Get JWT token
            const response = await axiosSecure.post('/jwt', { 
                email: result.user.email 
            });
            localStorage.setItem('accessToken', response.data.token);
            
            // Save user data
            try {
                await axiosSecure.post('/users', {
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                    role: 'user',
                    createdAt: new Date()
                });
            } catch (error) {
                if (!error.response?.data?.message?.includes('already exists')) {
                    console.error('Error saving user:', error);
                }
            }
            
            return result;
        } catch (error) {
            console.error('Google Sign In Error:', error);
            toast.error('Failed to sign in with Google');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            // First clear the cookie from server
            try {
                await axiosSecure.post('/logout');
            } catch (error) {
                console.warn('Server logout failed:', error.message);
                // Continue with logout even if server fails
            }

            // Then sign out from Firebase
            await signOut(auth);
            
            // Clear any local storage
            localStorage.removeItem('accessToken');
            
            // Clear user state
            setUser(null);
            
            // Show success message
            toast.success('Logged out successfully');
            
            // Optional: Redirect to home or login page
            window.location.href = '/';
            
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Error during logout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                setUser(currentUser);
                if (currentUser?.email) {
                    const response = await axiosSecure.post('/jwt', {
                        email: currentUser.email
                    });
                    localStorage.setItem('accessToken', response.data.token);
                } else {
                    localStorage.removeItem('accessToken');
                    try {
                        await axiosSecure.post('/logout');
                    } catch (error) {
                        console.warn('Logout failed:', error.message);
                    }
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                toast.error('Authentication error. Please try logging in again.');
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        updateUserProfile,
        signIn,
        googleSignIn,
        logOut
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthProvider;