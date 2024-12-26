import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDarkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center"
            >
                {isDarkMode ? (
                    <FaMoon className="text-yellow-300 text-xl" />
                ) : (
                    <FaSun className="text-yellow-500 text-xl" />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;