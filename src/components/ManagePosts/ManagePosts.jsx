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
import PropTypes from 'prop-types';

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
            // Redirect to login page on unauthorized access
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

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
            const response = await axiosSecure.get(`/volunteer-posts/user/${user.email}`);
            setMyPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to load your posts');
        }
    };

    const fetchMyRequests = async () => {
        try {
            const response = await axiosSecure.get(`/volunteer-applications/user/${user.email}`);
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
                await axiosSecure.delete(`/volunteer-posts/${postId}`);
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
                await axiosSecure.delete(`/volunteer-applications/${requestId}`);
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
            await axiosSecure.patch(
                `/volunteer-posts/${selectedPost._id}`,
                updateFormData
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
                        <PostsTab 
                            myPosts={myPosts} 
                            handleUpdate={handleUpdate} 
                            handleDelete={handleDelete}
                            navigate={navigate}
                        />
                    ) : (
                        <RequestsTab 
                            myRequests={myRequests} 
                            handleCancelRequest={handleCancelRequest}
                            navigate={navigate}
                        />
                    )}
                </AnimatePresence>

                {/* Update Modal */}
                <UpdateModal 
                    showUpdateModal={showUpdateModal}
                    setShowUpdateModal={setShowUpdateModal}
                    updateFormData={updateFormData}
                    setUpdateFormData={setUpdateFormData}
                    handleUpdateSubmit={handleUpdateSubmit}
                    categories={categories}
                />
            </div>
        </motion.div>
    );
};

// Separate components for better organization
const PostsTab = ({ myPosts, handleUpdate, handleDelete, navigate }) => (
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
            <EmptyState 
                icon={<FaListAlt className="mx-auto text-4xl text-gray-400 mb-4" />}
                message="You have not created any posts yet"
                buttonText="Create Your First Post"
                onClick={() => navigate('/add-volunteer-post')}
            />
        ) : (
            <PostsTable 
                posts={myPosts} 
                handleUpdate={handleUpdate} 
                handleDelete={handleDelete} 
            />
        )}
    </motion.section>
);

const RequestsTab = ({ myRequests, handleCancelRequest, navigate }) => (
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
            <EmptyState 
                icon={<FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />}
                message="You have not made any volunteer requests yet"
                buttonText="Browse Opportunities"
                onClick={() => navigate('/all-volunteer-posts')}
            />
        ) : (
            <RequestsTable 
                requests={myRequests} 
                handleCancelRequest={handleCancelRequest} 
            />
        )}
    </motion.section>
);

const EmptyState = ({ icon, message, buttonText, onClick }) => (
    <div className="text-center py-12">
        {icon}
        <p className="text-gray-600 mb-4">{message}</p>
        <button
            onClick={onClick}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
        >
            {buttonText}
        </button>
    </div>
);

const UpdateModal = ({ 
    showUpdateModal, 
    setShowUpdateModal, 
    updateFormData, 
    setUpdateFormData, 
    handleUpdateSubmit,
    categories 
}) => (
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
                    <UpdateModalContent 
                        setShowUpdateModal={setShowUpdateModal}
                        updateFormData={updateFormData}
                        setUpdateFormData={setUpdateFormData}
                        handleUpdateSubmit={handleUpdateSubmit}
                        categories={categories}
                    />
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const UpdateModalContent = ({
    setShowUpdateModal,
    updateFormData,
    setUpdateFormData,
    handleUpdateSubmit,
    categories
}) => (
    <>
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
            {/* Form fields */}
            <FormField
                icon={<FaImage className="mr-2 text-orange-500" />}
                label="Thumbnail URL"
                type="url"
                value={updateFormData.thumbnail}
                onChange={(e) => setUpdateFormData({...updateFormData, thumbnail: e.target.value})}
                placeholder="Enter image URL"
            />

            <FormField
                icon={<FaListAlt className="mr-2 text-orange-500" />}
                label="Title"
                type="text"
                value={updateFormData.title}
                onChange={(e) => setUpdateFormData({...updateFormData, title: e.target.value})}
                placeholder="Enter post title"
            />

            <FormField
                icon={<FaUserEdit className="mr-2 text-orange-500" />}
                label="Description"
                isTextarea={true}
                value={updateFormData.description}
                onChange={(e) => setUpdateFormData({...updateFormData, description: e.target.value})}
                placeholder="Describe the volunteer opportunity"
            />

            <FormField
                icon={<FaTag className="mr-2 text-orange-500" />}
                label="Category"
                isSelect={true}
                value={updateFormData.category}
                onChange={(e) => setUpdateFormData({...updateFormData, category: e.target.value})}
                options={categories}
            />

            <FormField
                icon={<FaMapMarkerAlt className="mr-2 text-orange-500" />}
                label="Location"
                type="text"
                value={updateFormData.location}
                onChange={(e) => setUpdateFormData({...updateFormData, location: e.target.value})}
                placeholder="Enter location"
            />

            <FormField
                icon={<FaUsers className="mr-2 text-orange-500" />}
                label="Volunteers Needed"
                type="number"
                value={updateFormData.volunteersNeeded}
                onChange={(e) => setUpdateFormData({...updateFormData, volunteersNeeded: parseInt(e.target.value)})}
                min="1"
                placeholder="Enter number of volunteers needed"
            />

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
    </>
);

const FormField = ({ 
    icon, 
    label, 
    isTextarea, 
    isSelect, 
    options, 
    ...props 
}) => (
    <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            {icon}
            {label}
        </label>
        {isTextarea ? (
            <textarea
                {...props}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="4"
                required
            />
        ) : isSelect ? (
            <select
                {...props}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        ) : (
            <input
                {...props}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
            />
        )}
    </div>
);

// Add PostsTable component that was used but not defined
const PostsTable = ({ posts, handleUpdate, handleDelete }) => (
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
                {posts.map((post) => (
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
);

// Add RequestsTable component that was used but not defined
const RequestsTable = ({ requests, handleCancelRequest }) => (
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
                {requests.map((request) => (
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
);

// Add PropTypes for all components
PostsTable.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        deadline: PropTypes.string.isRequired
    })).isRequired,
    handleUpdate: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired
};

RequestsTable.propTypes = {
    requests: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        postTitle: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        appliedAt: PropTypes.string.isRequired
    })).isRequired,
    handleCancelRequest: PropTypes.func.isRequired
};

PostsTab.propTypes = {
    myPosts: PropTypes.array.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired
};

RequestsTab.propTypes = {
    myRequests: PropTypes.array.isRequired,
    handleCancelRequest: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired
};

EmptyState.propTypes = {
    icon: PropTypes.node.isRequired,
    message: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

UpdateModal.propTypes = {
    showUpdateModal: PropTypes.bool.isRequired,
    setShowUpdateModal: PropTypes.func.isRequired,
    updateFormData: PropTypes.shape({
        thumbnail: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        volunteersNeeded: PropTypes.number.isRequired,
        deadline: PropTypes.instanceOf(Date).isRequired
    }).isRequired,
    setUpdateFormData: PropTypes.func.isRequired,
    handleUpdateSubmit: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired
};

UpdateModalContent.propTypes = {
    setShowUpdateModal: PropTypes.func.isRequired,
    updateFormData: PropTypes.shape({
        thumbnail: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        volunteersNeeded: PropTypes.number.isRequired,
        deadline: PropTypes.instanceOf(Date).isRequired
    }).isRequired,
    setUpdateFormData: PropTypes.func.isRequired,
    handleUpdateSubmit: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired
};

FormField.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    isTextarea: PropTypes.bool,
    isSelect: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    min: PropTypes.string
};

FormField.defaultProps = {
    isTextarea: false,
    isSelect: false,
    type: 'text',
    placeholder: '',
    min: null
};

export default ManagePosts;