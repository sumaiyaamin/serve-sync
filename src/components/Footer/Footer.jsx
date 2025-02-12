import { FaGithub, FaLinkedin, FaHeart, FaEnvelope, FaMapMarkerAlt, FaHandsHelping, FaSun, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { theme, toggleTheme } = useTheme();

    const footerSections = [
        {
            title: "Explore",
            links: [
                { name: "Home", path: "/" },
                { name: "Browse Opportunities", path: "/all-volunteer-posts" },
                { name: "Create Opportunity", path: "/add-volunteer-post" },
                { name: "Manage Posts", path: "/manage-my-posts" },
            ]
        },
        
        {
            title: "Connect",
            links: [
                { name: "GitHub", url: "https://github.com/sumaiyaamin" },
                { name: "LinkedIn", url: "https://www.linkedin.com/in/sumaiya-amin-prova01/" },
                { name: "Email", url: "mailto:sumaiya.prova321@gmail.com" },
            ]
        }
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-dark-800 dark:to-dark-900 text-gray-700 dark:text-dark-primary transition-colors duration-300">
            {/* Wave Separator */}
            <div className="w-full overflow-hidden">
                <svg 
                    viewBox="0 0 1200 120" 
                    preserveAspectRatio="none"
                    className="relative block w-full h-12 rotate-180"
                >
                    <path 
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                        className="fill-gray-50 dark:fill-dark-900"
                    />
                </svg>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-full mx-auto px-4 pt-8 pb-12 sm:px-6 lg:px-8">
                {/* Top Section with Logo and Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-3">
                                <FaHandsHelping className="text-4xl text-primary-500" />
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">
                                    Serve Sync
                                </h3>
                            </div>
                            
                            
                        </motion.div>
                        
                        <p className="text-gray-600 dark:text-dark-secondary max-w-md">
                            Synchronizing hearts and hands to create meaningful impact. Join us in making a difference in communities across Bangladesh.
                        </p>
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-dark-secondary">
                            <FaMapMarkerAlt className="text-primary-500" />
                            <span>Dhaka, Bangladesh</span>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {footerSections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-primary">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link, idx) => (
                                    <li key={idx}>
                                        {link.path ? (
                                            <Link 
                                                to={link.path}
                                                className="text-gray-600 dark:text-dark-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 flex items-center space-x-1"
                                            >
                                                <span className="h-1 w-1 bg-primary-500 rounded-full opacity-0 transition-opacity duration-300"></span>
                                                <span>{link.name}</span>
                                            </Link>
                                        ) : (
                                            <a 
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-600 dark:text-dark-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300"
                                            >
                                                {link.name}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-gray-300 dark:border-dark-border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        {/* Copyright */}
                        <div className="text-sm text-gray-600 dark:text-dark-secondary text-center md:text-left">
                            © {currentYear} Serve Sync. All rights reserved.
                        </div>

                        {/* Developer Credit */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center space-x-2 text-sm"
                        >
                            <span className="text-gray-600 dark:text-dark-secondary">Crafted with</span>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <FaHeart className="text-red-500" />
                            </motion.div>
                            <span className="text-gray-600 dark:text-dark-secondary">by</span>
                            <a 
                                href="https://linkedin.com/in/sumaiyaprova"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-500 hover:text-primary-400 font-medium"
                            >
                                Sumaiya Amin Prova
                            </a>
                        </motion.div>

                        {/* Social Links */}
                        <div className="flex justify-center md:justify-end space-x-6">
                            <a 
                                href="https://github.com/sumaiyaamin"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-dark-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300"
                            >
                                <FaGithub size={20} />
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/sumaiya-amin-prova01/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-dark-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300"
                            >
                                <FaLinkedin size={20} />
                            </a>
                            <a 
                                href="mailto:sumaiya.prova321@gmail.com"
                                className="text-gray-600 dark:text-dark-secondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300"
                            >
                                <FaEnvelope size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;