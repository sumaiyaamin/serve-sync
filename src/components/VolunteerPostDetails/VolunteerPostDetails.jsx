import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { 
    FaMapMarkerAlt, 
    FaUsers, 
    FaCalendar, 
    FaEnvelope, 
    FaUser, 
    FaTags, 
    FaTimes,
    FaPaperPlane,
    FaRegCommentDots,
    FaSpinner
} from 'react-icons/fa';

const VolunteerPostDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [applying, setApplying] = useState(false);
    const [suggestion, setSuggestion] = useState('');

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const modalVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/volunteer-posts/${id}`, {
                    withCredentials: true
                });
                setPost(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching post:', error);
                setError('Failed to load post details');
                toast.error('Failed to load post details');
            } finally {
                setLoading(false);
            }
        };

            fetchPost();
    }, [id, user, navigate]);

    // Loading state component
    const LoadingSpinner = () => (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <FaSpinner className="animate-spin text-4xl text-orange-500 mb-4" />
            <p className="text-gray-600">Loading details...</p>
        </div>
    );

    // Error state component
    const ErrorState = () => (
        <motion.div 
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="min-h-screen flex flex-col justify-center items-center p-4"
        >
            <FaTimes className="text-6xl text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
                {error || 'Something went wrong'}
            </h2>
            <button
                onClick={() => navigate('/all-volunteer-posts')}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300"
            >
                Go Back to Listings
            </button>
        </motion.div>
    );

    const handleVolunteer = () => {
        if (!user) {
            toast.error('Please login to volunteer');
            navigate('/login');
            return;
        }
        if (post.volunteersNeeded <= 0) {
            toast.error('No more volunteers needed for this opportunity');
            return;
        }
        if (user.email === post.organizerEmail) {
            toast.error('You cannot volunteer for your own post');
            return;
        }
        setShowModal(true);
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        setApplying(true);

        try {
            await axios.post(
                `http://localhost:5000/volunteer-applications`,
                {
                    postId: id,
                    volunteerId: user.uid,
                    volunteerName: user.displayName,
                    volunteerEmail: user.email,
                    suggestion,
                    status: 'requested',
                    thumbnail: post.thumbnail,
                    postTitle: post.title,
                    description: post.description,
                    category: post.category,
                    location: post.location,
                    volunteersNeeded: post.volunteersNeeded,
                    deadline: post.deadline,
                    organizerName: post.organizerName,
                    organizerEmail: post.organizerEmail,
                    appliedAt: new Date().toISOString()
                },
                { withCredentials: true }
            );

            await axios.patch(
                `http://localhost:5000/volunteer-posts/${id}/decrement`,
                {},
                { withCredentials: true }
            );

            toast.success('Application submitted successfully!');
            setShowModal(false);
            setSuggestion('');
            
            // Refresh post data to update volunteers needed count
            const updatedPost = await axios.get(`http://localhost:5000/volunteer-posts/${id}`, {
                withCredentials: true
            });
            setPost(updatedPost.data);
        } catch (error) {
            console.error('Error applying:', error);
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorState />;
    if (!post) {
        return (
            <motion.div 
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                className="min-h-screen flex flex-col justify-center items-center p-4"
            >
                <FaTimes className="text-6xl text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Post Not Found</h2>
                <p className="text-gray-600 mb-4">The volunteer opportunity you are looking for does not exist.</p>
                <button
                    onClick={() => navigate('/all-volunteer-posts')}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 flex items-center"
                >
                    <FaUsers className="mr-2" />
                    Browse Other Opportunities
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
        >
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <motion.div 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                    <div className="relative">
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-80 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-bold text-white mb-2"
                            >
                                {post.title}
                            </motion.h1>
                            <div className="flex items-center text-white/90">
                                <FaMapMarkerAlt className="mr-2" />
                                {post.location}
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="flex items-center space-x-3 bg-orange-50 p-4 rounded-lg">
                                <FaTags className="text-2xl text-orange-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="font-semibold text-gray-800">{post.category}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 bg-orange-50 p-4 rounded-lg">
                                <FaUsers className="text-2xl text-orange-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Volunteers Needed</p>
                                    <p className="font-semibold text-gray-800">{post.volunteersNeeded}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 bg-orange-50 p-4 rounded-lg">
                                <FaCalendar className="text-2xl text-orange-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Deadline</p>
                                    <p className="font-semibold text-gray-800">
                                        {new Date(post.deadline).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">About This Opportunity</h2>
                            <p className="text-gray-700 leading-relaxed">{post.description}</p>
                        </div>

                        {/* Organizer Info */}
                        <div className="bg-gray-50 p-6 rounded-lg mb-8">
                            <h3 className="text-lg font-semibold mb-4">Organizer Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <FaUser className="text-orange-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{post.organizerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaEnvelope className="text-orange-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{post.organizerEmail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        {user?.email !== post.organizerEmail && post.volunteersNeeded > 0 && (
                            <motion.button
                                onClick={handleVolunteer}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full md:w-auto px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                            >
                                <FaUsers className="mr-2" />
                                Be a Volunteer
                                <span className="ml-2 bg-white text-orange-500 px-2 py-1 rounded-full text-sm">
                                    {post.volunteersNeeded} spots left
                                </span>
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
                    >
                        <motion.div 
                            variants={modalVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Volunteer Application</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                >
                                    <FaTimes className="text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitApplication} className="space-y-6">
                                {/* Post Information */}
                                <div className="bg-orange-50 p-4 rounded-lg mb-6">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Post Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Title</label>
                                            <p className="text-gray-800">{post.title}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Category</label>
                                            <p className="text-gray-800">{post.category}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Location</label>
                                            <p className="text-gray-800">{post.location}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Deadline</label>
                                            <p className="text-gray-800">
                                                {new Date(post.deadline).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Applicant Information */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Name</label>
                                            <p className="text-gray-800">{user.displayName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Email</label>
                                            <p className="text-gray-800">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Suggestion Field */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <FaRegCommentDots className="mr-2 text-orange-500" />
                                        Your Message
                                    </label>
                                    <textarea
                                        value={suggestion}
                                        onChange={(e) => setSuggestion(e.target.value)}
                                        placeholder="Share why you'd like to volunteer and any relevant experience..."
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                        rows="4"
                                        required
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        type="submit"
                                        disabled={applying}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex items-center px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 ${
                                            applying ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {applying ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane className="mr-2" />
                                                Submit Application
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default VolunteerPostDetails;