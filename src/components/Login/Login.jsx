import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { AuthContext } from '../../providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosSecure from '../../api/axiosSecure';
import { useTheme } from '../../context/ThemeContext';

const Login = () => {
    const { signIn, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const { theme } = useTheme();
    
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        exit: { 
            opacity: 0,
            y: -50,
            transition: {
                duration: 0.4
            }
        }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.02,
            transition: {
                duration: 0.2
            }
        },
        tap: { scale: 0.98 }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Firebase authentication
            const result = await signIn(formData.email, formData.password);
            
            // Get JWT token
            const response = await axiosSecure.post('/jwt', {
                email: result.user.email
            });
            
            if (response.data?.token) {
                localStorage.setItem('accessToken', response.data.token);
                toast.success('Welcome back! 👋', {
                    style: {
                        background: theme === 'dark' ? '#1e293b' : '#fff',
                        color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                    }
                });
                navigate('/', { replace: true });
            }
        } catch (err) {
            setError(err.message);
            if (err.code === 'auth/invalid-credential') {
                toast.error('Invalid email or password', {
                    style: {
                        background: theme === 'dark' ? '#1e293b' : '#fff',
                        color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                    }
                });
            } else {
                toast.error('An error occurred during login', {
                    style: {
                        background: theme === 'dark' ? '#1e293b' : '#fff',
                        color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                    }
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Google authentication
            const result = await googleSignIn();
            
            // Get JWT token
            const response = await axiosSecure.post('/jwt', {
                email: result.user.email
            });
            
            if (response.data?.token) {
                localStorage.setItem('accessToken', response.data.token);
                
                // Save user to database
                await axiosSecure.post('/users', {
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                    role: 'user',
                    createdAt: new Date()
                });

                toast.success('Successfully logged in! 🎉', {
                    style: {
                        background: theme === 'dark' ? '#1e293b' : '#fff',
                        color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                    }
                });
                navigate('/', { replace: true });
            }
        } catch (err) {
            setError(err.message);
            toast.error('Failed to sign in with Google', {
                style: {
                    background: theme === 'dark' ? '#1e293b' : '#fff',
                    color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-md w-full space-y-8"
            >
                <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl dark:shadow-dark space-y-6">
                    <div className="text-center">
                        <motion.h2 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-3xl font-bold text-gray-900 dark:text-dark-primary mb-2"
                        >
                            Welcome Back
                        </motion.h2>
                        <p className="text-gray-600 dark:text-dark-secondary">
                            New here?{' '}
                            <Link 
                                to="/register" 
                                className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 p-4 rounded-md"
                            >
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400 dark:text-dark-500" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg placeholder-gray-400 dark:placeholder-dark-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-dark-primary mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400 dark:text-dark-500" />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-dark-border rounded-lg placeholder-gray-400 dark:placeholder-dark-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="h-5 w-5 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-400" />
                                    ) : (
                                        <FaEye className="h-5 w-5 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm dark:shadow-dark text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : 'Sign in'}
                        </motion.button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-dark-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-dark-card text-gray-500 dark:text-dark-secondary">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className={`w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm dark:shadow-dark text-sm font-medium text-gray-700 dark:text-dark-primary bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        <FaGoogle className="w-5 h-5 text-primary-500 mr-2" />
                        Sign in with Google
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;