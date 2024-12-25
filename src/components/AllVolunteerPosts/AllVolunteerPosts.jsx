import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Card Component
const VolunteerCard = ({ post }) => {
    const { _id, thumbnail, title, category, deadline, location } = post;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
        >
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
    }).isRequired,
};

// Main Component
const AllVolunteerPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);

    // Debounced search function
    const debouncedSearch = debounce(async (term) => {
        if (term === '') {
            fetchAllPosts();
            return;
        }
        
        setSearchLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/volunteer-posts/search?title=${term}`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error searching posts:', error);
        } finally {
            setSearchLoading(false);
        }
    }, 500);

    // Fetch all posts
    const fetchAllPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/volunteer-posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPosts();
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        debouncedSearch(term);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        All Volunteer Opportunities
                    </h1>
                    
                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search by post title..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        {searchLoading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-teal-600"></div>
                            </div>
                        )}
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center text-gray-600">
                        <p className="text-xl">No volunteer posts found</p>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {posts.map((post) => (
                            <VolunteerCard key={post._id} post={post} />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AllVolunteerPosts;