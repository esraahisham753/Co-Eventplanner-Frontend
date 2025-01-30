'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvent, updateEvent } from '@/store/slices/eventSlice';
import { fetchTeams } from '@/store/slices/teamSlice';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiUpload, FiX } from 'react-icons/fi';

const EditEventPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const { event, status, error } = useSelector((state) => state.events);
  const { teams } = useSelector((state) => state.teams);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    price: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    dispatch(fetchEvent(id));
    dispatch(fetchTeams(id));
  }, [dispatch, id, user, router]);

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

  // Populate form with event data
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        location: event.location || '',
        date: new Date(event.date).toISOString().slice(0, 16) || '',
        price: event.price || '',
        image: null
      });
      if (event.image) {
        setImagePreview(event.image);
      }
    }
  }, [event]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required';
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size should be less than 10MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
      // Create local preview URL for new file uploads
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    // Clean up URL if it's a local preview
    if (imagePreview && !imagePreview.startsWith('http')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  // Clean up object URL on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.startsWith('http')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await dispatch(updateEvent({ eventId: id, eventData: formData })).unwrap();
      router.push(`/workspace/${id}`);
    } catch (err) {
      console.error('Failed to update event:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <Link
                href={`/workspace/${id}`}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back to Event
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Event</h1>
            <p className="text-gray-500 mb-8">Update your event details</p>

            <form onSubmit={handleSubmit} className="space-y-8">
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
                  className={`mt-1 block w-full px-4 py-3 rounded-xl shadow-sm ${
                    formErrors.description ? 'border-red-300' : 'border-gray-300'
                  } focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200`}
                />
                {formErrors.description && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-3 rounded-xl shadow-sm ${
                    formErrors.location ? 'border-red-300' : 'border-gray-300'
                  } focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200`}
                />
                {formErrors.location && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.location}</p>
                )}
              </div>

              {/* Date and Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-3 rounded-xl shadow-sm ${
                      formErrors.date ? 'border-red-300' : 'border-gray-300'
                    } focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200`}
                  />
                  {formErrors.date && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.date}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-3 rounded-xl shadow-sm ${
                      formErrors.price ? 'border-red-300' : 'border-gray-300'
                    } focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200`}
                  />
                  {formErrors.price && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary transition-colors duration-200">
                  <div className="space-y-2 text-center">
                    {imagePreview ? (
                      <div className="relative w-full h-64">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="rounded-xl object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors duration-200"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <FiUpload className="mx-auto h-12 w-12 text-primary opacity-75" />
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                          <label htmlFor="image" className="relative cursor-pointer bg-primary/10 px-4 py-2 rounded-full font-medium text-primary hover:bg-primary/20 transition-colors duration-200">
                            <span>Upload a file</span>
                            <input
                              id="image"
                              name="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="text-gray-500">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

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
                      Updating...
                    </div>
                  ) : (
                    'Update Event'
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl text-center text-red-600">
                  Error updating event: {error}
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

export default EditEventPage; 