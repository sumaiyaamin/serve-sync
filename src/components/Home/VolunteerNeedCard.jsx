// src/components/Home/VolunteerNeedCard.jsx

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const VolunteerNeedCard = ({ post }) => {
    const { _id, thumbnail, title, category, deadline, location } = post;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <img 
                src={thumbnail} 
                alt={title} 
                className="w-full h-48 object-cover"
            />
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 truncate">{title}</h3>
                <div className="space-y-2">
                    <p className="text-gray-600">
                        <span className="font-medium">Category:</span> {category}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">Location:</span> {location}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">Deadline:</span>{' '}
                        {new Date(deadline).toLocaleDateString()}
                    </p>
                </div>
                <Link
                    to={`/volunteer-posts/${_id}`}
                    className="mt-4 inline-block w-full text-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

VolunteerNeedCard.propTypes = {
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        deadline: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
    }).isRequired,
};

export default VolunteerNeedCard;