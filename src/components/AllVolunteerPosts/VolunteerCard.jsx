import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaRegClock, FaTag, FaUsers } from 'react-icons/fa';

const VolunteerCard = ({ post }) => {
    const { _id, thumbnail, title, category, deadline, location, volunteersNeeded } = post;

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
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
                    <span className={`${
                        volunteersNeeded > 0 ? 'bg-green-500' : 'bg-red-500'
                    } text-white px-3 py-1 rounded-full text-sm`}>
                        <FaUsers className="inline mr-1" />
                        {volunteersNeeded > 0 ? `${volunteersNeeded} needed` : 'Full'}
                    </span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white hover:text-orange-500 transition-colors duration-200">
                    {title}
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <FaMapMarkerAlt className="text-orange-500 mr-2" />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <FaRegClock className="text-orange-500 mr-2" />
                        <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <FaTag className="text-orange-500 mr-2" />
                        <span>{category}</span>
                    </div>
                </div>
                {volunteersNeeded > 0 ? (
                    <Link
                        to={`/volunteer-posts/${_id}`}
                        className="mt-6 inline-block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        View Details
                    </Link>
                ) : (
                    <button
                        disabled
                        className="mt-6 w-full px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                    >
                        No Positions Available
                    </button>
                )}
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