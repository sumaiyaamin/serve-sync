import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsGrid, BsListUl } from 'react-icons/bs'; // Import icons
import axios from 'axios';
import VolunteerNeedCard from './VolunteerNeedCard';

const VolunteerNeeds = () => {
    const [volunteerPosts, setVolunteerPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [layout, setLayout] = useState('grid');

    useEffect(() => {
        const fetchVolunteerPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/volunteer-posts/upcoming', {
                    params: { limit: 6 },
                    withCredentials: true
                });
                setVolunteerPosts(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching volunteer posts:', error);
                setError('Failed to load volunteer opportunities. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchVolunteerPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="py-16 bg-gray-50"
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <motion.h2 
                        initial={{ y: -20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold text-gray-800"
                    >
                        Volunteer <span className="text-orange-500">Opportunities</span>
                    </motion.h2>

                    {/* Layout Toggle Icons */}
                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setLayout('grid')}
                            className={`p-2 rounded-md transition-colors duration-200 ${
                                layout === 'grid' 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                            aria-label="Grid View"
                        >
                            <BsGrid size={20} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setLayout('table')}
                            className={`p-2 rounded-md transition-colors duration-200 ${
                                layout === 'table' 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                            aria-label="List View"
                        >
                            <BsListUl size={20} />
                        </motion.button>
                    </div>
                </div>

                {volunteerPosts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-xl text-gray-600">No volunteer opportunities available at the moment.</p>
                        <p className="text-gray-500 mt-2">Please check back later!</p>
                    </motion.div>
                ) : layout === 'grid' ? (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {volunteerPosts.map((post, index) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <VolunteerNeedCard post={post} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="overflow-x-auto bg-white rounded-lg shadow-md"
                    >
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Title</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Category</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Location</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Deadline</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {volunteerPosts.map((post) => (
                                    <tr key={post._id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="py-4 px-6 text-sm text-gray-800">{post.title}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{post.category}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{post.location}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(post.deadline).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <Link
                                                to={'/volunteer-posts/${post._id}'}
                                                className="text-orange-500 hover:text-orange-600 font-medium"
                                            >
                                                View Details →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}

                {volunteerPosts.length > 0 && (
                    <div className="text-center mt-12">
                        <Link
                            to="/all-volunteer-posts"
                            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            View All Opportunities
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </motion.section>
    );
};

export default VolunteerNeeds;