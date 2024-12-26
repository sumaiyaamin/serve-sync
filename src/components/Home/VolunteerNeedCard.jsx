import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosSecure from '../../api/axiosSecure';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaRegClock, FaTag } from 'react-icons/fa';

const VolunteerNeedCard = () => {
    const [upcomingPosts, setUpcomingPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpcomingPosts = async () => {
            try {
                setLoading(true);
                const response = await axiosSecure.get('/volunteer-posts/upcoming?limit=6');
                setUpcomingPosts(response.data);
            } catch (error) {
                console.error('Error fetching upcoming posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingPosts();
    }, []);

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
        >
            <div className="relative">
                <img 
                    src={upcomingPosts[0]?.thumbnail} 
                    alt={upcomingPosts[0]?.title} 
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full">
                        {upcomingPosts[0]?.category}
                    </span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 hover:text-orange-500 transition-colors duration-200">
                    {upcomingPosts[0]?.title}
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="text-orange-500 mr-2" />
                        <span>{upcomingPosts[0]?.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <FaRegClock className="text-orange-500 mr-2" />
                        <span>Deadline: {new Date(upcomingPosts[0]?.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <FaTag className="text-orange-500 mr-2" />
                        <span>{upcomingPosts[0]?.category}</span>
                    </div>
                </div>
                <Link
                    to={`/volunteer-posts/${upcomingPosts[0]?._id}`}
                    className="mt-6 inline-block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );
};

VolunteerNeedCard.propTypes = {
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        deadline: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date)
        ]).isRequired,
        location: PropTypes.string.isRequired,
    }).isRequired,
};

export default VolunteerNeedCard;