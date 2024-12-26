import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../providers/AuthProvider';
import { useTheme } from '../../context/ThemeContext';
import { RiMenu4Line, RiCloseLine } from 'react-icons/ri';
import { FaHandsHelping, FaChevronDown, FaSun, FaMoon } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axiosSecure from '../../api/axiosSecure';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/all-volunteer-posts', label: 'Volunteer Posts' },
    { to: '/add-volunteer-post', label: 'Add Post', private: true },
    { to: '/manage-my-posts', label: 'Manage Posts', private: true },
];

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle logout
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
            if (!event.target.closest('.mobile-menu')) {
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
                    ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-sm' 
                    : 'bg-white dark:bg-gray-900'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <FaHandsHelping className="h-8 w-8 text-orange-500" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Serve Sync
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            (!link.private || user) && (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) => `
                                        text-base font-medium transition-colors duration-200
                                        ${isActive 
                                            ? 'text-orange-500' 
                                            : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500'
                                        }
                                    `}
                                >
                                    {link.label}
                                </NavLink>
                            )
                        ))}

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <FaSun className="w-5 h-5 text-yellow-400" />
                            ) : (
                                <FaMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            )}
                        </button>

                        {/* User Profile/Auth Buttons */}
                        {user ? (
                            <div className="relative profile-dropdown">
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center space-x-2 focus:outline-none"
                                >
                                    <img
                                        src={user.photoURL || '/default-avatar.png'}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover border-2 border-orange-500"
                                    />
                                    <FaChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${
                                        isProfileDropdownOpen ? 'rotate-180' : ''
                                    }`} />
                                </button>

                                <AnimatePresence>
                                    {isProfileDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.displayName}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Link
                                                to="/add-volunteer-post"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Add Post
                                            </Link>
                                            <Link
                                                to="/manage-my-posts"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Manage Posts
                                            </Link>
                                            <button
                                                onClick={handleLogOut}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                Sign out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-500"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <FaSun className="w-5 h-5 text-yellow-400" />
                            ) : (
                                <FaMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            )}
                        </button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                        className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800"
                    >
                        <div className="px-4 py-3 space-y-3">
                            {navLinks.map((link) => (
                                (!link.private || user) && (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) => `
                                            block text-base font-medium
                                            ${isActive 
                                                ? 'text-orange-500' 
                                                : 'text-gray-600 dark:text-gray-300'
                                            }
                                        `}
                                    >
                                        {link.label}
                                    </NavLink>
                                )
                            ))}

                            {user ? (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <img
                                            src={user.photoURL || '/default-avatar.png'}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user.displayName}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-2 text-red-600"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block py-2 text-gray-600 dark:text-gray-300"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block py-2 text-orange-500"
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