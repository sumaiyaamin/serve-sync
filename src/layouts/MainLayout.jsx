import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Navbar />
            <div className="content-wrapper">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;