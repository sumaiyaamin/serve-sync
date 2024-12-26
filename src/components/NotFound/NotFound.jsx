import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const NotFound = () => {
    const { theme } = useTheme();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 px-4 transition-colors duration-300">
            <div className="max-w-3xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl dark:shadow-dark text-center relative overflow-hidden"
                >
                    {/* Background Hands Animation */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-[0.03]">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-4xl"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    y: [0, -20, 0],
                                    x: [0, 10, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                            >
                                🤝
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10">
                        {/* 404 Text */}
                        <motion.h1
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-9xl font-bold text-primary-500 mb-4"
                        >
                            404
                        </motion.h1>

                        {/* Helping Hands Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-6xl mb-8 flex justify-center"
                        >
                            🤝
                        </motion.div>

                        {/* Message */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-primary mb-2">
                                Page Not Found
                            </h2>
                            <p className="text-gray-600 dark:text-dark-secondary mb-8">
                                The page you are looking for does not exist, but there are plenty of opportunities to help others!
                            </p>
                        </motion.div>

                        {/* Action Button */}
                        <Link to="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-primary-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors duration-300 shadow-lg hover:shadow-xl dark:shadow-dark"
                            >
                                Return Home
                            </motion.button>
                        </Link>
                    </div>

                    {/* Bottom Decoration */}
                    <motion.div 
                        className="mt-8 flex justify-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {[...Array(3)].map((_, i) => (
                            <motion.span
                                key={i}
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, -5, 5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.3
                                }}
                                className="text-2xl opacity-90 dark:opacity-75"
                            >
                                ❤
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;