import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-teal-600 animate-spin"></div>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <img
                            src="/src/assets/Brand-logo.png"
                            alt="Serve Sync"
                            className="h-12 w-12 object-contain"
                        />
                    </motion.div>
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-gray-600 font-medium"
                >
                    Loading Serve Sync...
                </motion.p>
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;