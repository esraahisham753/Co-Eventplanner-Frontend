'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '@/store/slices/eventSlice';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiSearch, FiCalendar, FiDollarSign } from 'react-icons/fi';

const EventsPage = () => {
  const dispatch = useDispatch();
  const { events, status, error } = useSelector((state) => state.events);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState({ type: 'date', ascending: false });
  const eventsPerPage = 10;

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Filter and sort events
  const filteredAndSortedEvents = events
    .filter(event => {
      // Filter out past events
      const eventDate = new Date(event.date);
      const now = new Date();
      return eventDate >= now && event.title.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOrder.type === 'date') {
        return sortOrder.ascending 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else {
        return sortOrder.ascending 
          ? parseFloat(a.price) - parseFloat(b.price)
          : parseFloat(b.price) - parseFloat(a.price);
      }
    });

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredAndSortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredAndSortedEvents.length / eventsPerPage);

  const handleSort = (type) => {
    setSortOrder(prev => ({
      type,
      ascending: prev.type === type ? !prev.ascending : false
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Sort Section */}
          <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
            <div className="relative flex-grow max-w-lg">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => handleSort('date')}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  sortOrder.type === 'date' ? 'bg-primary text-white' : 'border-gray-300 text-gray-700'
                }`}
              >
                <FiCalendar className="mr-2" />
                Date {sortOrder.type === 'date' && (sortOrder.ascending ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('price')}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  sortOrder.type === 'price' ? 'bg-primary text-white' : 'border-gray-300 text-gray-700'
                }`}
              >
                <FiDollarSign className="mr-2" />
                Price {sortOrder.type === 'price' && (sortOrder.ascending ? '↑' : '↓')}
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {status === 'loading' ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : status === 'failed' ? (
            <div className="text-center py-12 text-red-500">
              Error: {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEvents.map((event) => (
                  <Link 
                    href={`/events/${event.id}`} 
                    key={event.id}
                    className="group h-full"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 h-full flex flex-col">
                      <div className="relative h-48 flex-shrink-0">
                        <Image
                          src={event.image || '/event-placeholder.jpg'}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-primary">
                          {event.role}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2 flex-grow">
                          {event.description}
                        </p>
                        <div className="mt-4 flex justify-between items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span>${event.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredAndSortedEvents.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No upcoming events found
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-primary text-white'
                          : 'border border-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventsPage;