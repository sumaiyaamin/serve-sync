
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt, FaRegClock, FaTag, FaUsers } from 'react-icons/fa';

// Create axios instance with interceptors
const axiosSecure = axios.create({
    baseURL: 'https://serve-sync-server.vercel.app',
    withCredentials: true,
    timeout: 8000
});

// Add request interceptor to include token
axiosSecure.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const VolunteerCard = ({ post }) => {
    const { _id, thumbnail, title, category, deadline, location, volunteersNeeded } = post;

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
        >
            <div className="relative">
                <img 
                    src={thumbnail} 
                    alt={title} 
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                        {category}
                    </span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        <FaUsers className="inline mr-1" />
                        {volunteersNeeded}
                    </span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 hover:text-orange-500 transition-colors duration-200">
                    {title}
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="text-orange-500 mr-2" />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <FaRegClock className="text-orange-500 mr-2" />
                        <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <FaTag className="text-orange-500 mr-2" />
                        <span>{category}</span>
                    </div>
                </div>
                <Link
                    to={`/volunteer-posts/${_id}`}
                    className="mt-6 inline-block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );
};

VolunteerCard.propTypes = {
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        deadline: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        volunteersNeeded: PropTypes.number.isRequired,
    }).isRequired,
};

export default VolunteerCard;