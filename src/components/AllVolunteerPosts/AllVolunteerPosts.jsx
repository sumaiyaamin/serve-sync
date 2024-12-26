import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import VolunteerCard from './VolunteerCard';
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


const AllVolunteerPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all posts
    const fetchAllPosts = async () => {
        setLoading(true);
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

    // Debounced search function
    const debouncedSearch = debounce(async (term) => {
        if (term === '') {
            fetchAllPosts();
            return;
        }
        
        setSearchLoading(true);
        try {
            const response = await axiosSecure.get(`/volunteer-posts/search?q=${term}`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error searching posts:', error);
        } finally {
            setSearchLoading(false);
        }
    }, 500);

    useEffect(() => {
        fetchAllPosts();
        return () => {
            debouncedSearch.cancel();
        };
    }, []);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setSearchLoading(true);
        debouncedSearch(term);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Volunteer <span className="text-orange-500">Opportunities</span>
                    </h1>
                    
                    {/* Enhanced Search Bar */}
                    <div className="max-w-xl mx-auto relative">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title, category, or location..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm transition duration-200"
                            />
                            {searchLoading && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-500"></div>
                                </div>
                            )}
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    </div>
                </motion.div>

                {posts.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            {searchTerm 
                                ? "No matching volunteer opportunities found" 
                                : "No active volunteer opportunities available"
                            }
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            {searchTerm && "Try adjusting your search terms"}
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