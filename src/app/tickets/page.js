'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTickets, deleteTicket } from '@/store/slices/ticketSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiTrash2, FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi';

const TicketsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userTickets, userTicketsStatus, error } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    dispatch(fetchUserTickets(user.id));
  }, [dispatch, user, router]);

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to cancel this ticket?')) {
      try {
        await dispatch(deleteTicket(ticketId)).unwrap();
        dispatch(fetchUserTickets(user.id));
      } catch (err) {
        console.error('Failed to delete ticket:', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Tickets</h1>

          {userTicketsStatus === 'loading' ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : userTicketsStatus === 'failed' ? (
            <div className="text-center py-12 text-red-500">
              Error: {error}
            </div>
          ) : userTickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You don't have any tickets yet.</p>
              <Link href="/events" className="btn-primary">
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6"
                >
                  <div className="border-b pb-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {ticket.event_title}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                      Ticket ID: {ticket.code}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="w-5 h-5 mr-3" />
                      <span>{new Date(ticket.event_date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="w-5 h-5 mr-3" />
                      <span>{ticket.event_location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiDollarSign className="w-5 h-5 mr-3" />
                      <span>${ticket.event_price}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="w-full flex items-center justify-center px-4 py-2 rounded-full border border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      Cancel Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TicketsPage;