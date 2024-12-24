import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/all-volunteer-posts', label: 'Volunteer Posts' },
        { path: '/my-profile', label: 'My Profile' },
    ];

    return (
        <motion.nav 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-orange-500/95 backdrop-blur-md shadow-md' : 'bg-transparent'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-3">
                        <img 
                            src="/src/assets/Brand-logo.png" 
                            alt="Support Humanity" 
                            className="h-24 w-auto" 
                        />
                        <span className="text-2xl font-bold text-teal-600 hidden sm:block">
                            Serve Sync
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    text-lg font-semibold px-3 py-2 rounded-md transition-all duration-300
                                    ${isActive 
                                        ? 'text-orange-500 bg-teal-50/10' 
                                        : 'text-teal-600 hover:text-yellow-500'
                                    }
                                `}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-teal-600 hover:text-orange-500 focus:outline-none"
                        >
                            <span className="sr-only">Open menu</span>
                            <div className="w-6 h-6 flex flex-col justify-between">
                                <span className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <motion.div 
                className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
                transition={{ duration: 0.3 }}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 bg-orange-500/95 backdrop-blur-md">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `
                                block px-3 py-2 rounded-md text-base font-medium transition-all duration-300
                                ${isActive 
                                    ? 'text-white bg-teal-600/20' 
                                    : 'text-teal-800 hover:bg-teal-600/10 hover:text-white'
                                }
                            `}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </motion.div>
        </motion.nav>
    );
};

export default Navbar;