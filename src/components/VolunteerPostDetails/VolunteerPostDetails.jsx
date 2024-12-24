// src/pages/VolunteerPostDetails.jsx

import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const VolunteerPostDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/volunteer-posts/${id}`, {
                    withCredentials: true
                });
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
                toast.error('Failed to load post details');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleVolunteer = async () => {
        setApplying(true);
        try {
            await axios.post(`http://localhost:5000/volunteer-applications`, {
                postId: id,
                volunteerId: user.uid,
                volunteerName: user.displayName,
                volunteerEmail: user.email,
                status: 'pending',
                appliedAt: new Date().toISOString()
            }, {
                withCredentials: true
            });
            toast.success('Application submitted successfully!');
            navigate('/my-applications');
        } catch (error) {
            console.error('Error applying:', error);
            toast.error('Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-xl text-gray-600">Post not found</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-64 object-cover"
                />
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Category:</span> {post.category}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Location:</span> {post.location}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Volunteers Needed:</span> {post.volunteersNeeded}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Deadline:</span>{' '}
                                {new Date(post.deadline).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Organizer:</span> {post.organizerName}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Contact:</span> {post.organizerEmail}
                            </p>
                        </div>
                    </div>

                    <div className="prose max-w-none mb-8">
                        <h2 className="text-xl font-semibold mb-4">Description</h2>
                        <p className="text-gray-700">{post.description}</p>
                    </div>

                    {user?.email !== post.organizerEmail && (
                        <button
                            onClick={handleVolunteer}
                            disabled={applying}
                            className={`w-full md:w-auto px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 ${
                                applying ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {applying ? 'Applying...' : 'Be a Volunteer'}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default VolunteerPostDetails;