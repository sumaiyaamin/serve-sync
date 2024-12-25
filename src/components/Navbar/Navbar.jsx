import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../providers/AuthProvider';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiChevronDown } from 'react-icons/fi';
import { RiMenu4Line, RiCloseLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import axiosSecure from '../../api/axiosSecure';

// Move navLinks outside component
const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/all-volunteer-posts', label: 'Volunteer Posts' },
    
];

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogOut = async () => {
        try {
            await logOut();
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
                isScrolled 
                    ? (isDarkMode 
                        ? 'bg-gray-900/95 shadow-lg backdrop-blur-sm' 
                        : 'bg-white/95 shadow-lg backdrop-blur-sm')
                    : 'bg-transparent'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <img 
                            src="/logo.png" 
                            alt="Serve Sync" 
                            className="h-12 w-auto"
                        />
                        <span className={`text-2xl font-bold hidden sm:block ${
                            isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                            Serve Sync
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink 
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `
                                    text-base font-medium transition-colors duration-200
                                    ${isActive 
                                        ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') 
                                        : (isDarkMode 
                                            ? 'text-gray-300 hover:text-white' 
                                            : 'text-gray-600 hover:text-gray-900')
                                    }
                                `}
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                                isDarkMode 
                                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="relative profile-dropdown flex items-center space-x-4">
                                <div 
                                    className="flex items-center space-x-2 cursor-pointer"
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                >
                                    <div className="relative group">
                                        <img 
                                            src={user.photoURL || '/default-avatar.png'} 
                                            alt={user.displayName}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                                        />
                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 
                                            bg-gray-900 text-white px-2 py-1 text-xs rounded opacity-0 
                                            group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                            {user.displayName || 'User'}
                                        </span>
                                    </div>
                                    <FiChevronDown className={`transition-transform duration-200 ${
                                        isProfileDropdownOpen ? 'rotate-180' : ''
                                    } ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
                                </div>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {isProfileDropdownOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                                                isDarkMode ? 'bg-gray-800' : 'bg-white'
                                            }`}
                                        >
                                            {/* Dropdown Items */}
                                            <Link 
                                                to="/profile"
                                                className={`block px-4 py-2 text-sm ${
                                                    isDarkMode 
                                                        ? 'text-gray-300 hover:bg-gray-700' 
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                Your Profile
                                            </Link>
                                            <Link 
                                                to="/add-volunteer-post"
                                                className={`block px-4 py-2 text-sm ${
                                                    isDarkMode 
                                                        ? 'text-gray-300 hover:bg-gray-700' 
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                Add Post
                                            </Link>
                                            <Link 
                                                to="/manage-my-posts"
                                                className={`block px-4 py-2 text-sm ${
                                                    isDarkMode 
                                                        ? 'text-gray-300 hover:bg-gray-700' 
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                Manage Posts
                                            </Link>
                                            <button
                                                onClick={handleLogOut}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                                isDarkMode 
                                    ? 'bg-gray-800 text-yellow-400' 
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`mobile-menu-button p-2 rounded-md ${
                                isDarkMode ? 'text-white' : 'text-gray-600'
                            }`}
                        >
                            {isMobileMenuOpen ? (
                                <RiCloseLine size={24} />
                            ) : (
                                <RiMenu4Line size={24} />
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
                        className={`md:hidden ${
                            isDarkMode ? 'bg-gray-900' : 'bg-white'
                        }`}
                    >
                        <div className="px-4 pt-2 pb-3 space-y-1">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) => `
                                        block px-3 py-2 rounded-md text-base font-medium
                                        ${isActive 
                                            ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') 
                                            : (isDarkMode 
                                                ? 'text-gray-300 hover:text-white' 
                                                : 'text-gray-600 hover:text-gray-900')
                                        }
                                    `}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                            
                            {user ? (
                                <>
                                    <div className="pt-4 pb-3 border-t border-gray-200">
                                        <div className="flex items-center px-3">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="h-10 w-10 rounded-full"
                                                    src={user.photoURL || '/default-avatar.png'}
                                                    alt={user.displayName}
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <div className={`text-base font-medium ${
                                                    isDarkMode ? 'text-white' : 'text-gray-800'
                                                }`}>
                                                    {user.displayName}
                                                </div>
                                                <div className={`text-sm font-medium ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 space-y-1">
                                            <Link
                                                to="/profile"
                                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                                    isDarkMode 
                                                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Your Profile
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogOut();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="pt-4 pb-3 border-t border-gray-200">
                                    <Link
                                        to="/login"
                                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                                            isDarkMode 
                                                ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 mt-2"
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