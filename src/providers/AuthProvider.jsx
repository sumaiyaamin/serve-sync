import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    updateProfile 
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

// axios instance with credentials
const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    
    const createUser = async (email, password) => {
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // Get token and set cookie
            await axiosSecure.post('/jwt', { email: result.user.email });
            return result;
        } catch (err) {
            toast.error(err.message.replace('Firebase:', ''));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateUserProfile = async (name, photo) => {
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: photo,
            });
            setUser((prev) => ({
                ...prev,
                displayName: name,
                photoURL: photo,
            }));
        } catch (err) {
            toast.error(err.message.replace('Firebase:', ''));
            throw err;
        } finally {
            setLoading(false);
        }
    };

 
    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            // Get token and set cookie
            await axiosSecure.post('/jwt', { email: result.user.email });
            return result;
        } catch (err) {
            if (err.code === 'auth/invalid-credential') {
                toast.error('Invalid email or password');
            } else {
                toast.error(err.message.replace('Firebase:', ''));
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    
    const googleSignIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            
            // Save or update user in database
            if (result.user) {
                try {
                    await axiosSecure.post('/users', {
                        name: result.user.displayName,
                        email: result.user.email,
                        photo: result.user.photoURL,
                        role: 'user',
                        createdAt: new Date(),
                    });
                    // Get token and set cookie
                    await axiosSecure.post('/jwt', { email: result.user.email });
                } catch (err) {
                    
                    if (!err.response?.data?.message?.includes('already exists')) {
                        console.error('Error saving user:', err);
                    }
                }
            }
            
            return result;
        } catch (err) {
            toast.error(err.message.replace('Firebase:', ''));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Sign out
    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            // Clear the cookie
            await axiosSecure.post('/logout');
        } catch (err) {
            toast.error(err.message.replace('Firebase:', ''));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Observer for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            // If we have a user, get a token and set cookie
            if (currentUser) {
                try {
                    await axiosSecure.post('/jwt', {
                        email: currentUser.email
                    });
                } catch (err) {
                    console.error('Error setting JWT cookie:', err);
                }
            } else {
                // Clear the cookie on logout
                try {
                    await axiosSecure.post('/logout');
                } catch (err) {
                    console.error('Error clearing cookie:', err);
                }
            }
            
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Create loading component
    const LoadingSpinner = () => (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
    );

    // Auth values to be provided
    const authInfo = {
        user,
        loading,
        createUser,
        updateUserProfile,
        signIn,
        googleSignIn,
        logOut,
        LoadingSpinner
    };

    // Show loading spinner while initial auth state is being determined
    if (loading && !user) {
        return <LoadingSpinner />;
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

// Add prop types validation
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthProvider;