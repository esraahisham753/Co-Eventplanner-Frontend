'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventsByUser } from '@/store/slices/eventSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiPlus, FiUser, FiUsers } from 'react-icons/fi';

const WorkspacePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  const { events, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    dispatch(fetchEventsByUser());
  }, [dispatch, user, router]);

  const getRoleIcon = (role) => {
    return role === 'organizer' ? (
      <FiUsers className="w-5 h-5" />
    ) : (
      <FiUser className="w-5 h-5" />
    );
  };

  // Filter future events
  const futureEvents = events.filter(event => new Date(event.date) > new Date());

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
            <Link 
              href="/events/create" 
              className="btn-primary"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              New Event
            </Link>
          </div>

          {status === 'loading' ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : status === 'failed' ? (
            <div className="text-center py-12 text-red-500">
              Error: {error}
            </div>
          ) : futureEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You don't have any upcoming events.</p>
              <Link href="/events/create" className="btn-primary">
                Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {futureEvents.map((event) => (
                <Link 
                  key={event.id} 
                  href={`/events/${event.id}`}
                  className="block group"
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex items-center">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={event.image || '/event-placeholder.jpg'}
                        alt={event.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full ${
                      event.role === 'organizer' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {getRoleIcon(event.role)}
                      <span className="ml-2 text-sm font-medium capitalize">
                        {event.role}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WorkspacePage;