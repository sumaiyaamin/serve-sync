import { FaGithub, FaLinkedin, FaHeart, FaEnvelope, FaMapMarkerAlt, FaHandsHelping } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Explore",
            links: [
                { name: "Home", path: "/" },
                { name: "Browse Opportunities", path: "/all-volunteer-posts" },
                { name: "Create Opportunity", path: "/add-volunteer-post" },
                { name: "Dashboard", path: "/manage-my-posts" },
            ]
        },
        {
            title: "Resources",
            links: [
                { name: "How It Works", path: "/how-it-works" },
                { name: "Success Stories", path: "/stories" },
                { name: "FAQs", path: "/faqs" },
                { name: "Contact Us", path: "/contact" },
            ]
        },
        {
            title: "Connect",
            links: [
                { name: "GitHub", url: "https://github.com/sumaiyaprova" },
                { name: "LinkedIn", url: "https://linkedin.com/in/sumaiyaprova" },
                { name: "Email", url: "mailto:sumaiyaprova@gmail.com" },
            ]
        }
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
            {/* Wave Separator */}
            <div className="w-full overflow-hidden">
                <svg 
                    viewBox="0 0 1200 120" 
                    preserveAspectRatio="none"
                    className="relative block w-full h-12 rotate-180"
                >
                    <path 
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                        className="fill-gray-50"
                    />
                </svg>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 pt-8 pb-12 sm:px-6 lg:px-8">
                {/* Top Section with Logo and Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center space-x-3"
                        >
                            <FaHandsHelping className="text-4xl text-orange-500" />
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                                Serve Sync
                            </h3>
                        </motion.div>
                        <p className="text-gray-400 max-w-md">
                            Synchronizing hearts and hands to create meaningful impact. Join us in making a difference in communities across Bangladesh.
                        </p>
                        <div className="flex items-center space-x-2 text-gray-400">
                            <FaMapMarkerAlt className="text-orange-500" />
                            <span>Dhaka, Bangladesh</span>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {footerSections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link, idx) => (
                                    <li key={idx}>
                                        {link.path ? (
                                            <Link 
                                                to={link.path}
                                                className="text-gray-400 hover:text-orange-500 transition-colors duration-300 flex items-center space-x-1"
                                            >
                                                <span className="h-1 w-1 bg-orange-500 rounded-full opacity-0 transition-opacity duration-300"></span>
                                                <span>{link.name}</span>
                                            </Link>
                                        ) : (
                                            <a 
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
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
                <div className="pt-8 border-t border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        {/* Copyright */}
                        <div className="text-sm text-gray-400 text-center md:text-left">
                            © {currentYear} Serve Sync. All rights reserved.
                        </div>

                        {/* Developer Credit */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center space-x-2 text-sm"
                        >
                            <span className="text-gray-400">Crafted with</span>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <FaHeart className="text-red-500" />
                            </motion.div>
                            <span className="text-gray-400">by</span>
                            <a 
                                href="https://linkedin.com/in/sumaiyaprova"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 hover:text-orange-400 font-medium"
                            >
                                Sumaiya Amin Prova
                            </a>
                        </motion.div>

                        {/* Social Links */}
                        <div className="flex justify-center md:justify-end space-x-6">
                            <a 
                                href="https://github.com/sumaiyaprova"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                            >
                                <FaGithub size={20} />
                            </a>
                            <a 
                                href="https://linkedin.com/in/sumaiyaprova"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                            >
                                <FaLinkedin size={20} />
                            </a>
                            <a 
                                href="mailto:sumaiyaprova@gmail.com"
                                className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
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