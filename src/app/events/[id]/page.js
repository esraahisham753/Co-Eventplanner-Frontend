'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { fetchEvent } from '../../../store/slices/eventSlice';
import { createTicket } from '../../../store/slices/ticketSlice';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi';

const EventPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { event, status, error } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchEvent(id));
    }
  }, [dispatch, id]);

  const isEventOpen = event ? new Date(event.date) > new Date() : false;

  const handleBuyTicket = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    const ticketData = {
      event: id,
      user: user.id,
      code: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    };

    try {
      await dispatch(createTicket(ticketData)).unwrap();
      router.push('/tickets');
    } catch (error) {
      console.error('Failed to purchase ticket:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Image Section */}
              <div className="md:w-1/2">
                <div className="relative h-64 md:h-full min-h-[400px]">
                  <Image
                    src={event.image || '/event-placeholder.jpg'}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isEventOpen 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isEventOpen ? 'Open' : 'Closed'}
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="w-5 h-5 mr-2" />
                    <span>{new Date(event.date).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="w-5 h-5 mr-2" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FiDollarSign className="w-5 h-5 mr-2" />
                    <span>${event.price}</span>
                  </div>
                </div>

                <div className="prose prose-blue max-w-none mb-8 flex-grow">
                  <h2 className="text-xl font-semibold mb-2">Details</h2>
                  <p className="text-gray-600">{event.description}</p>
                </div>

                {isEventOpen ? (
                  user ? (
                    <button
                      onClick={handleBuyTicket}
                      className="w-full btn-primary justify-center"
                    >
                      Buy Ticket
                    </button>
                  ) : (
                    <Link href="/login" className="w-full btn-primary justify-center text-center">
                      Sign in to Buy Ticket
                    </Link>
                  )
                ) : (
                  <button
                    disabled
                    className="w-full px-6 py-3 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    Event Closed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventPage;