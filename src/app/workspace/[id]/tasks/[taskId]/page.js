'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { fetchTasks, updateTask, deleteTask } from '@/store/slices/taskSlice';
import { fetchTeams } from '@/store/slices/teamSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import Link from 'next/link';

const TaskDetailsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id: eventId, taskId } = useParams();
  const { user } = useSelector((state) => state.user);
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const { teams } = useSelector((state) => state.teams);
  const [isEditing, setIsEditing] = useState(false);

  const task = tasks?.find(t => t.id === parseInt(taskId));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    user: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    dispatch(fetchTasks(eventId));
    dispatch(fetchTeams(eventId));
  }, [dispatch, eventId, user, router]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        user: task.user
      });
    }
  }, [task]);

  // Check if the logged-in user is an organizer
  const isOrganizer = teams?.some(team => 
    team.user === user?.id && 
    team.role === 'organizer'
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOrganizer) return;

    try {
      await dispatch(updateTask({ 
        taskId, 
        taskData: {
          ...formData,
          event: parseInt(eventId)
        }
      })).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDelete = async () => {
    if (!isOrganizer) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
        router.push(`/workspace/${eventId}`);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {/* Header with back button */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href={`/workspace/${eventId}`}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back to Tasks
              </Link>
              {isOrganizer && !isEditing && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary flex items-center"
                  >
                    <FiEdit2 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn-secondary text-red-600 border-red-600 hover:bg-red-50 flex items-center"
                  >
                    <FiTrash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned To
                  </label>
                  <select
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary"
                  >
                    {teams?.map((team) => (
                      <option key={team.id} value={team.user}>
                        {team.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary flex items-center"
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                  >
                    <FiCheck className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                  <div className="mt-4 flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className="text-gray-500">
                      Assigned to: {task.username}
                    </span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-600">{task.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TaskDetailsPage; 