// src/components/Home/VolunteerNeeds.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import VolunteerNeedCard from './VolunteerNeedCard';

const VolunteerNeeds = () => {
    const [volunteerPosts, setVolunteerPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVolunteerPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/volunteer-posts/upcoming', {
                    params: {
                        limit: 6
                    },
                    withCredentials: true
                });
                console.log('Fetched posts:', response.data); // Debug log
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200"
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
                <motion.h2 
                    initial={{ y: -20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-3xl font-bold text-center mb-12"
                >
                    Volunteer Needs Now
                </motion.h2>
                
                {volunteerPosts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-600"
                    >
                        <p className="text-lg">No volunteer opportunities available at the moment.</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
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
                )}

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center mt-12"
                >
                    <Link
                        to="/all-volunteer-posts"
                        className="inline-block px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200"
                    >
                        See All Opportunities
                    </Link>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default VolunteerNeeds;