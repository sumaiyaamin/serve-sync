import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { motion } from 'framer-motion';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            
            <Navbar />
            
            
            <motion.main 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-grow " 
            >
                <div className="max-w-7xl mx-auto pt-10 ">
                    <Outlet />
                </div>
            </motion.main>

            {/* Footer space if needed */}
            <div className="h-16">
                {/* Footer content */}
            </div>
        </div>
    );
};

export default MainLayout;