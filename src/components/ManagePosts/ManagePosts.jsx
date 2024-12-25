import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';

const ManagePosts = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [myPosts, setMyPosts] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
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
            setLoading(false); // Ensure loading is set to false here
        }
    };

    const handleDelete = async (postId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
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
            text: "Are you sure you want to cancel this volunteer request?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
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
            await axios.patch(`http://localhost:5000/volunteer-posts/${selectedPost._id}`, 
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* My Volunteer Need Posts Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">My Volunteer Need Posts</h2>
                    {myPosts.length === 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow text-center">
                            <p className="text-gray-600">You have not created any volunteer need posts yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow rounded-lg">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {myPosts.map((post) => (
                                        <tr key={post._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{post.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(post.deadline).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                <button
                                                    onClick={() => handleUpdate(post)}
                                                    className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

               {/* My Volunteer Requests Section */}
<section>
    <h2 className="text-2xl font-bold mb-6">My Volunteer Requests</h2>
    {myRequests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-600">You have not made any volunteer requests yet.</p>
        </div>
    ) : (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {console.log('My Requests:', myRequests)} {/* Debugger: Log myRequests */}
                    {myRequests.map((request) => (
                        <tr key={request._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{request.postTitle}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs ${
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
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )}
</section>

                {/* Update Modal */}
                {showUpdateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6">Update Volunteer Need Post</h2>
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                                        <input
                                            type="text"
                                            value={updateFormData.thumbnail}
                                            onChange={(e) => setUpdateFormData({...updateFormData, thumbnail: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            value={updateFormData.title}
                                            onChange={(e) => setUpdateFormData({...updateFormData, title: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={updateFormData.description}
                                            onChange={(e) => setUpdateFormData({...updateFormData, description: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            rows="4"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            value={updateFormData.category}
                                            onChange={(e) => setUpdateFormData({...updateFormData, category: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            <option value="healthcare">Healthcare</option>
                                            <option value="education">Education</option>
                                            <option value="social service">Social Service</option>
                                            <option value="animal welfare">Animal Welfare</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Location</label>
                                        <input
                                            type="text"
                                            value={updateFormData.location}
                                            onChange={(e) => setUpdateFormData({...updateFormData, location: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Volunteers Needed</label>
                                        <input
                                            type="number"
                                            value={updateFormData.volunteersNeeded}
                                            onChange={(e) => setUpdateFormData({...updateFormData, volunteersNeeded: parseInt(e.target.value)})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Deadline</label>
                                        <DatePicker
                                            selected={updateFormData.deadline}
                                            onChange={(date) => setUpdateFormData({...updateFormData, deadline: date})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                            required
                                            dateFormat="yyyy/MM/dd"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowUpdateModal(false)}
                                        className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                                    >
                                        Update Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
        

    );
    

};

export default ManagePosts;