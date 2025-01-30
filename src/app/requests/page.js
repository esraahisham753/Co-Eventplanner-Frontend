'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingInvitations, updateTeam, deleteTeam } from '@/store/slices/teamSlice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiCheck, FiX } from 'react-icons/fi';

const RequestsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  const { teams, status, error } = useSelector((state) => state.teams);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    dispatch(fetchPendingInvitations());
  }, [dispatch, user, router]);

  const handleAccept = async (teamId) => {
    try {
      await dispatch(updateTeam({ 
        teamId, 
        teamData: { invitation_status: true } 
      })).unwrap();
      dispatch(fetchPendingInvitations());
    } catch (err) {
      console.error('Failed to accept invitation:', err);
    }
  };

  const handleReject = async (teamId) => {
    try {
      await dispatch(deleteTeam(teamId)).unwrap();
      dispatch(fetchPendingInvitations());
    } catch (err) {
      console.error('Failed to reject invitation:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Event Invitations</h1>

          {status === 'loading' ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : status === 'failed' ? (
            <div className="text-center py-12 text-red-500">
              Error: {error}
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No pending invitations</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div 
                  key={team.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={team.event_image || '/event-placeholder.jpg'}
                        alt={team.event_title}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {team.event_title}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        Role: {team.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleReject(team.id)}
                      className="flex items-center px-4 py-2 rounded-full border border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleAccept(team.id)}
                      className="flex items-center px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
                    >
                      <FiCheck className="w-4 h-4 mr-2" />
                      Accept
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

export default RequestsPage; 