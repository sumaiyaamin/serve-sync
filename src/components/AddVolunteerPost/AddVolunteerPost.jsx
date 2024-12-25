import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from '../../providers/AuthProvider';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Create Volunteer Opportunity
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
                    {/* Thumbnail URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="thumbnail">
                            Thumbnail URL
                        </label>
                        <input
                            type="url"
                            name="thumbnail"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            aria-required="true"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="title">
                            Post Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            aria-required="true"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            aria-required="true"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="category">
                            Category
                        </label>
                        <select
                            name="category"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            aria-required="true"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="location">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            aria-required="true"
                        />
                    </div>

                    {/* Volunteers Needed */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="volunteersNeeded">
                            Number of Volunteers Needed
                        </label>
                        <input
                            type="number"
                            name="volunteersNeeded"
                            min="1"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            aria-required="true"
                        />
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="deadline">
                            Deadline
                        </label>
                        <DatePicker
                            selected={deadline}
                            onChange={(date) => setDeadline(date)}
                            minDate={new Date()}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            aria-required="true"
                        />
                    </div>

                    {/* Organizer Info (Read-only) */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Organizer Name
                            </label>
                            <input
                                type="text"
                                value={user.displayName}
                                readOnly
                                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Organizer Email
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                readOnly
                                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Creating...' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default AddVolunteerPost;