import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { motion } from 'framer-motion';
import Footer from '../components/Footer/Footer';

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
                <div className="max-w-full mx-auto pt-10 ">
                    <Outlet />
                </div>
            </motion.main>

          
            <div className="h-16">
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;