import { motion } from 'framer-motion';
import { FaHandsHelping } from 'react-icons/fa';

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="relative">
                    <div className="h-32 w-32 rounded-full border-t-4 border-b-4 border-orange-500 animate-spin"></div>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <FaHandsHelping className="h-24 w-24 text-orange-500" />
                    </motion.div>
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-gray-600 dark:text-gray-300 font-medium"
                >
                    Loading Serve Sync...
                </motion.p>
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;