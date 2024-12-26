import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { FaSearch, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa';

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

// Add response interceptor to handle unauthorized access
axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const VolunteerCard = ({ post }) => {
    const { _id, thumbnail, title, category, deadline, location, volunteersNeeded } = post;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
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
                        {volunteersNeeded} needed
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
                        <FaClock className="text-orange-500 mr-2" />
                        <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
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

const AllVolunteerPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all posts
    const fetchAllPosts = async () => {
        try {
            const response = await axiosSecure.get('/volunteer-posts');
            setPosts(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to load volunteer opportunities');
        } finally {
            setLoading(false);
        }
    };

    // Updated debounced search function to match server endpoint
    const debouncedSearch = debounce(async (term) => {
        if (!term.trim()) {
            fetchAllPosts();
            return;
        }
        
        setSearchLoading(true);
        try {
            // Using the search endpoint that filters by title and future deadlines
            const response = await axiosSecure.get('/volunteer-posts/search', {
                params: { title: term }
            });
            
            setPosts(response.data);
            setError(null);
        } catch (error) {
            console.error('Error searching posts:', error);
            setError('Failed to search posts. Please try again.');
            // If search fails, show all posts
            fetchAllPosts();
        } finally {
            setSearchLoading(false);
        }
    }, 500);

    useEffect(() => {
        fetchAllPosts();
        // Cleanup function to cancel any pending debounced searches
        return () => {
            debouncedSearch.cancel();
        };
    }, []);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        debouncedSearch(term);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 text-xl mb-4">{error}</p>
                <button 
                    onClick={fetchAllPosts}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Volunteer <span className="text-orange-500">Opportunities</span>
                    </h1>
                    
                    {/* Search Bar with helper text */}
                    <div className="max-w-xl mx-auto relative">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm transition duration-200"
                            />
                            {searchLoading && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-500"></div>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Only showing opportunities with future deadlines
                        </p>
                    </div>
                </motion.div>

                {posts.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-xl text-gray-600">No active volunteer opportunities found</p>
                        <p className="text-gray-500 mt-2">
                            {searchTerm 
                                ? "Try adjusting your search terms" 
                                : "Check back later for new opportunities"}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {posts.map((post, index) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <VolunteerCard post={post} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AllVolunteerPosts;