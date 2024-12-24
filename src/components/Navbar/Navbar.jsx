import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../providers/AuthProvider';
import toast from 'react-hot-toast';
import axios from 'axios';

// axios instance with credentials
const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
});

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    // Fetch user role
    useEffect(() => {
        const fetchUserRole = async () => {
            if (user?.email) {
                try {
                    const response = await axiosSecure.get(`/users/${user.email}`);
                    setUserRole(response.data?.role);
                } catch (error) {
                    console.error('Error fetching user role:', error);
                }
            }
        };
        fetchUserRole();
    }, [user]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle logout
    const handleLogOut = async () => {
        try {
            await logOut();
            // Clear cookie
            await axiosSecure.post('/logout');
            toast.success('Successfully logged out!');
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
            toast.error('Failed to logout');
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.profile-dropdown')) {
                setIsProfileDropdownOpen(false);
            }
            if (!event.target.closest('.mobile-menu-button')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <motion.nav 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-orange-500/95 backdrop-blur-md shadow-md' : 'bg-transparent'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-3">
                        <img 
                            src="/logo.png" 
                            alt="Serve Sync" 
                            className="h-16 w-auto"
                        />
                        <span className="text-2xl font-bold text-white hidden sm:block">
                            Serve Sync
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink 
                            to="/"
                            className={({ isActive }) => 
                                `text-lg font-semibold transition-colors duration-200 
                                ${isActive ? 'text-yellow-400' : 'text-white hover:text-yellow-200'}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink 
                            to="/all-volunteer-posts"
                            className={({ isActive }) => 
                                `text-lg font-semibold transition-colors duration-200 
                                ${isActive ? 'text-yellow-400' : 'text-white hover:text-yellow-200'}`
                            }
                        >
                            Volunteer Posts
                        </NavLink>

                        {/* User Profile Section */}
                        {user ? (
                            <div className="relative profile-dropdown">
                                <div className="flex items-center space-x-4">
                                    <div 
                                        className="flex items-center space-x-2 cursor-pointer"
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    >
                                        <div className="relative group">
                                            <img 
                                                src={user.photoURL || 'https://i.ibb.co/G2jM3r0/default-user.png'} 
                                                alt={user.displayName}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                            />
                                            <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
                                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                                {user.displayName || 'User'}
                                            </span>
                                        </div>
                                        <svg 
                                            className={`text-white w-5 h-5 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                    <button 
                                        onClick={handleLogOut}
                                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                    >
                                        Logout
                                    </button>
                                </div>

                                {/* Profile Dropdown Menu */}
                                <AnimatePresence>
                                    {isProfileDropdownOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                        >
                                            <Link 
                                                to="/add-volunteer-post"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors duration-200"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                Add Volunteer Post
                                            </Link>
                                            <Link 
                                                to="/manage-my-posts"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors duration-200"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                Manage My Posts
                                            </Link>
                                            {userRole === 'admin' && (
                                                <>
                                                    <Link 
                                                        to="/admin/dashboard"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors duration-200"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                    >
                                                        Admin Dashboard
                                                    </Link>
                                                    <Link 
                                                        to="/admin/manage-users"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors duration-200"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                    >
                                                        Manage Users
                                                    </Link>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/login"
                                    className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register"
                                    className="px-6 py-2 border-2 border-white text-white rounded-md hover:bg-white hover:text-orange-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="mobile-menu-button p-2 rounded-md text-white hover:bg-orange-600/50 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            {isMobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-orange-500/95 backdrop-blur-md"
                    >
                        <div className="px-4 pt-2 pb-3 space-y-1">
                            <NavLink
                                to="/"
                                className={({ isActive }) => 
                                    `block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive ? 'text-yellow-400' : 'text-white hover:text-yellow-200'
                                    }`
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/all-volunteer-posts"
                                className={({ isActive }) => 
                                    `block px-3 py-2 rounded-md text-base font-medium ${
                                        isActive ? 'text-yellow-400' : 'text-white hover:text-yellow-200'
                                    }`
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Volunteer Posts
                            </NavLink>
                            {user ? (
                                <>
                                    <Link
                                        to="/add-volunteer-post"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Add Volunteer Post
                                    </Link>
                                    <Link
                                        to="/manage-my-posts"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Manage My Posts
                                    </Link>
                                    {userRole === 'admin' && (
                                        <>
                                            <Link
                                                to="/admin/dashboard"
                                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-200"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Admin Dashboard
                                            </Link>
                                            <Link
                                                to="/admin/manage-users"
                                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-200"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Manage Users
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleLogOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-200 hover:text-red-100"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        to="/login"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;