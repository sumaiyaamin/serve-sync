import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaEdit, 
    FaTrash, 
    FaTimes, 
    FaCalendar, 
    FaUsers, 
    FaMapMarkerAlt, 
    FaImage, 
    FaListAlt,
    FaTag,
    FaUserEdit
} from 'react-icons/fa';

const categories = [
    'Healthcare',
    'Education',
    'Social Service',
    'Animal Welfare',
    'Environmental',
    'Community Development',
    'Youth Empowerment',
    'Elderly Care'
];

const ManagePosts = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [myPosts, setMyPosts] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [activeTab, setActiveTab] = useState('posts'); 

    const [updateFormData, setUpdateFormData] = useState({
        thumbnail: '',
        title: '',
        description: '',
        category: '',
        location: '',
        volunteersNeeded: 0,
        deadline: new Date()
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchMyPosts();
        fetchMyRequests();
    }, [user, navigate]);

    const fetchMyPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/volunteer-posts/user/${user.email}`, {
                withCredentials: true
            });
            setMyPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to load your posts');
        }
    };

    const fetchMyRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/volunteer-applications/user/${user.email}`, {
                withCredentials: true
            });
            setMyRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load your requests');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            background: '#ffffff',
            borderRadius: '12px',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/volunteer-posts/${postId}`, {
                    withCredentials: true
                });
                toast.success('Post deleted successfully');
                fetchMyPosts();
            } catch (error) {
                console.error('Error deleting post:', error);
                toast.error('Failed to delete post');
            }
        }
    };

    const handleCancelRequest = async (requestId) => {
        const result = await Swal.fire({
            title: 'Cancel Request?',
            text: "Are you sure you want to cancel this request?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, cancel it!',
            background: '#ffffff',
            borderRadius: '12px',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/volunteer-applications/${requestId}`, {
                    withCredentials: true
                });
                toast.success('Request cancelled successfully');
                fetchMyRequests();
            } catch (error) {
                console.error('Error cancelling request:', error);
                toast.error('Failed to cancel request');
            }
        }
    };

    const handleUpdate = (post) => {
        setSelectedPost(post);
        setUpdateFormData({
            thumbnail: post.thumbnail,
            title: post.title,
            description: post.description,
            category: post.category,
            location: post.location,
            volunteersNeeded: post.volunteersNeeded,
            deadline: new Date(post.deadline)
        });
        setShowUpdateModal(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(
                `http://localhost:5000/volunteer-posts/${selectedPost._id}`,
                updateFormData,
                { withCredentials: true }
            );
            toast.success('Post updated successfully');
            setShowUpdateModal(false);
            fetchMyPosts();
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error('Failed to update post');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
        >
            <div className="max-w-7xl mx-auto">
                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-1">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                                activeTab === 'posts'
                                    ? 'bg-orange-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            My Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                                activeTab === 'requests'
                                    ? 'bg-orange-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            My Requests
                        </button>
                    </div>
                </div>

                <AnimatePresence mode='wait'>
                    {activeTab === 'posts' ? (
                        <motion.section
                            key="posts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">
                                    My <span className="text-orange-500">Posts</span>
                                </h2>
                                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                                    Total Posts: {myPosts.length}
                                </span>
                            </div>

                            {myPosts.length === 0 ? (
                                <div className="text-center py-12">
                                    <FaListAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                                    <p className="text-gray-600 mb-4">You have not created any posts yet</p>
                                    <button
                                        onClick={() => navigate('/add-volunteer-post')}
                                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
                                    >
                                        Create Your First Post
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {myPosts.map((post) => (
                                                <tr key={post._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                                            {post.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {new Date(post.deadline).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                        <button
                                                            onClick={() => handleUpdate(post)}
                                                            className="p-2 text-blue-600 hover:text-blue-800"
                                                        >
                                                            <FaEdit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(post._id)}
                                                            className="p-2 text-red-600 hover:text-red-800"
                                                        >
                                                            <FaTrash size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.section>
                    ) : (
                        <motion.section
                            key="requests"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">
                                    My <span className="text-orange-500">Requests</span>
                                </h2>
                                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                                    Total Requests: {myRequests.length}
                                </span>
                            </div>

                            {myRequests.length === 0 ? (
                                <div className="text-center py-12">
                                    <FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />
                                    <p className="text-gray-600 mb-4">You have not made any volunteer requests yet</p>
                                    <button
                                        onClick={() => navigate('/all-volunteer-posts')}
                                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
                                    >
                                        Browse Opportunities
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {myRequests.map((request) => (
                                                <tr key={request._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">{request.postTitle}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                                            request.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                                                            request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {request.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {new Date(request.appliedAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleCancelRequest(request._id)}
                                                            className="p-2 text-red-600 hover:text-red-800"
                                                        >
                                                            <FaTrash size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Update Modal */}
                <AnimatePresence>
                    {showUpdateModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Update Post</h2>
                                    <button
                                        onClick={() => setShowUpdateModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateSubmit} className="space-y-6">
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <FaImage className="mr-2 text-orange-500" />
                                            Thumbnail URL
                                        </label>
                                        <input
                                            type="url"
                                            value={updateFormData.thumbnail}
                                            onChange={(e) => setUpdateFormData({...updateFormData, thumbnail: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            required
                                            placeholder="Enter image URL"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <FaListAlt className="mr-2 text-orange-500" />
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={updateFormData.title}
                                            onChange={(e) => setUpdateFormData({...updateFormData, title: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            required
                                            placeholder="Enter post title"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <FaUserEdit className="mr-2 text-orange-500" />
                                            Description
                                        </label>
                                        <textarea
                                            value={updateFormData.description}
                                            onChange={(e) => setUpdateFormData({...updateFormData, description: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            rows="4"
                                            required
                                            placeholder="Describe the volunteer opportunity"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <FaTag className="mr-2 text-orange-500" />
                                            Category
                                        </label>
                                        <select
                                            value={updateFormData.category}
                                            onChange={(e) => setUpdateFormData({...updateFormData, category: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            required
                                        >
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <FaMapMarkerAlt className="mr-2 text-orange-500" />
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={updateFormData.location}
                                            onChange={(e) => setUpdateFormData({...updateFormData, location: e.target.value})}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            required
                                            placeholder="Enter location"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <FaUsers className="mr-2 text-orange-500" />
                                            Volunteers Needed
                                        </label>
                                        <input
                                            type="number"
                                            value={updateFormData.volunteersNeeded}
                                            onChange={(e) => setUpdateFormData({...updateFormData, volunteersNeeded: parseInt(e.target.value)})}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            min="1"
                                            required
                                            placeholder="Enter number of volunteers needed"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <FaCalendar className="mr-2 text-orange-500" />
                                            Deadline
                                        </label>
                                        <DatePicker
                                            selected={updateFormData.deadline}
                                            onChange={(date) => setUpdateFormData({...updateFormData, deadline: date})}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            minDate={new Date()}
                                            dateFormat="MMMM d, yyyy"
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowUpdateModal(false)}
                                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
                                        >
                                            Update Post
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ManagePosts;