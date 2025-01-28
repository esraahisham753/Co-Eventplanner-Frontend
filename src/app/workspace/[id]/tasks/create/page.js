'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '@/store/slices/taskSlice';
import { useParams, useRouter } from 'next/navigation';
import { fetchTeams } from '@/store/slices/teamSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CreateTaskPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams(); // event id from URL
  const { user } = useSelector((state) => state.user);
  const { teams } = useSelector((state) => state.teams);
  const { status, error } = useSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event: id,
    user: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch teams to check if user is organizer
    dispatch(fetchTeams(id));
  }, [user, router, id, dispatch]);

  // Check if the logged-in user is an organizer
  const isOrganizer = teams?.some(team => 
    team.user === user?.id && 
    team.role === 'organizer'
  );

  useEffect(() => {
    if (!isOrganizer) {
      router.push(`/workspace/${id}`);
    }
  }, [isOrganizer, router, id]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.user) errors.user = 'Team member is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        event: parseInt(id),
        status: 'not_started',
        user: parseInt(formData.user)
      };

      await dispatch(createTask(taskData)).unwrap();
      router.push(`/workspace/${id}`);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Task</h1>
            <p className="text-gray-500 mb-8">Add a new task to your event</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className={`mt-1 block w-full px-4 py-3 rounded-xl shadow-sm ${
                    formErrors.title ? 'border-red-300' : 'border-gray-300'
                  } focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200`}
                />
                {formErrors.title && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the task"
                  className={`mt-1 block w-full px-4 py-3 rounded-xl shadow-sm ${
                    formErrors.description ? 'border-red-300' : 'border-gray-300'
                  } focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200`}
                />
                {formErrors.description && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>

              {/* Team Member Selection */}
              <div>
                <label htmlFor="user" className="block text-sm font-semibold text-gray-700 mb-2">
                  Assign To
                </label>
                <select
                  id="user"
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-3 rounded-xl shadow-sm ${
                    formErrors.user ? 'border-red-300' : 'border-gray-300'
                  } focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200`}
                >
                  <option value="">Select team member</option>
                  {teams?.map((team) => (
                    <option key={team.id} value={team.user}>
                      {team.username} ({team.role})
                    </option>
                  ))}
                </select>
                {formErrors.user && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.user}</p>
                )}
              </div>

              {/* Hidden Event ID */}
              <input type="hidden" name="event" value={id} />

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full md:w-auto px-8 py-3 text-base rounded-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {status === 'loading' ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Task'
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl text-center text-red-600">
                  Error creating task: {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateTaskPage;