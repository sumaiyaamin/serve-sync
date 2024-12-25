import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from '../../providers/AuthProvider';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaImage } from 'react-icons/fa';

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

const AddVolunteerPost = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [deadline, setDeadline] = useState(new Date());

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const postData = {
            thumbnail: form.thumbnail.value,
            title: form.title.value,
            description: form.description.value,
            category: form.category.value,
            location: form.location.value,
            volunteersNeeded: parseInt(form.volunteersNeeded.value),
            deadline: deadline,
            organizerName: user.displayName,
            organizerEmail: user.email,
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        try {
            await axios.post('http://localhost:5000/volunteer-posts', postData, {
                withCredentials: true
            });
            toast.success('Volunteer post created successfully!');
            navigate('/all-volunteer-posts');
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Create a Volunteer <span className="text-orange-500">Opportunity</span>
                    </h1>
                    <p className="text-gray-600">Fill in the details below to create a new volunteer opportunity</p>
                </div>

                <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-8 bg-white p-8 rounded-xl shadow-lg"
                >
                    {/* Thumbnail URL */}
                    <div className="form-group">
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                            <FaImage className="mr-2 text-orange-500" />
                            Thumbnail URL
                        </label>
                        <input
                            type="url"
                            name="thumbnail"
                            required
                            placeholder="Enter image URL"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Post Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="Enter post title"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            required
                            placeholder="Describe the volunteer opportunity"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                        />
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div className="form-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location */}
                        <div className="form-group">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <FaMapMarkerAlt className="mr-2 text-orange-500" />
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                required
                                placeholder="Enter location"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                            />
                        </div>

                        {/* Volunteers Needed */}
                        <div className="form-group">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <FaUsers className="mr-2 text-orange-500" />
                                Volunteers Needed
                            </label>
                            <input
                                type="number"
                                name="volunteersNeeded"
                                min="1"
                                required
                                placeholder="Enter number of volunteers"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                            />
                        </div>

                        {/* Deadline */}
                        <div className="form-group">
                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <FaCalendar className="mr-2 text-orange-500" />
                                Deadline
                            </label>
                            <DatePicker
                                selected={deadline}
                                onChange={(date) => setDeadline(date)}
                                minDate={new Date()}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                            />
                        </div>
                    </div>

                    {/* Organizer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                        <div className="form-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Organizer Name
                            </label>
                            <input
                                type="text"
                                value={user.displayName}
                                readOnly
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-100"
                            />
                        </div>
                        <div className="form-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Organizer Email
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                readOnly
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Post...
                            </span>
                        ) : (
                            'Create Volunteer Opportunity'
                        )}
                    </motion.button>
                </motion.form>
            </div>
        </motion.div>
    );
};

export default AddVolunteerPost;