'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/slices/userSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, error: authError } = useSelector((state) => state.user);

  useEffect(() => {
    if (status === 'succeeded') {
      router.push('/');
    }
    if (authError) {
      setError('Invalid username or password');
    }
  }, [status, authError, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/logo.webp" 
                alt="CoEventPlanner Logo" 
                width={40} 
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-primary">CoEventPlanner</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:text-primary-dark font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-sm text-center md:text-left">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="text-primary hover:text-primary-dark">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/login-bg.jpg')" }}>
        <div className="h-full bg-primary bg-opacity-75 flex items-center justify-center">
          <div className="max-w-md text-center text-white p-8">
            <h2 className="text-3xl font-bold mb-4">Plan Amazing Events Together</h2>
            <p className="text-lg">
              Join our platform and start collaborating with your team to create unforgettable events.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;