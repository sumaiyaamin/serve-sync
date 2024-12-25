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
    const [showModal, setShowModal] = useState(false);
    const [suggestion, setSuggestion] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

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
    }, [id, user, navigate]);

    const handleVolunteer = () => {
        setShowModal(true);
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        setApplying(true);
        try {
            // Submit the application
            await axios.post(
                'http://localhost:5000/volunteer-applications',
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

            // Decrement the volunteers needed count
            await axios.patch(
                `http://localhost:5000/volunteer-posts/${id}/decrement`,
                {},
                { withCredentials: true }
            );

            toast.success('Application submitted successfully!');
            setShowModal(false);
            setSuggestion(''); 
        } catch (error) {
            console.error('Error applying:', error);
            toast.error(error.response?.data?.message || 'Failed to submit application');
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

                    {user?.email !== post.organizerEmail && post.volunteersNeeded > 0 && (
                        <button
                            onClick={handleVolunteer}
                            className="w-full md:w-auto px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200"
                        >
                            Be a Volunteer
                        </button>
                    )}
                </div>
            </div>

            {/* Volunteer Application Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h2 className="text-2xl font-bold mb-6">Volunteer Application</h2>
                                <form onSubmit={handleSubmitApplication}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        {/* Read-only fields */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Post Title</label>
                                            <input type="text" value={post.title} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Category</label>
                                            <input type="text" value={post.category} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Location</label>
                                            <input type="text" value={post.location} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Volunteers Needed</label>
                                            <input type="text" value={post.volunteersNeeded} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Deadline</label>
                                            <input type="text" value={new Date(post.deadline).toLocaleDateString()} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Organizer Name</label>
                                            <input type="text" value={post.organizerName} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Volunteer Name</label>
                                            <input type="text" value={user.displayName} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Volunteer Email</label>
                                            <input type="email" value={user.email} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" />
                                        </div>
                                    </div>

                                    {/* Editable suggestion field */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Suggestion</label>
                                        <textarea
                                            value={suggestion}
                                            onChange={(e) => setSuggestion(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            rows="4"
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={applying}
                                            className={`px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 ${
                                                applying ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {applying ? 'Submitting...' : 'Submit Request'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default VolunteerPostDetails;