'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTickets, deleteTicket } from '../../store/slices/ticketSlice';

const UserTickets = () => {
  const dispatch = useDispatch();
  const { userTickets, userTicketsStatus, error } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserTickets(user.id));
    }
  }, [dispatch, user]);

  const handleDeleteTicket = (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      dispatch(deleteTicket(ticketId)).then(() => {
        // Refresh the user tickets after deletion
        dispatch(fetchUserTickets(user.id));
      });
    }
  };

  return (
    <div className="tickets-container">
      <h1>My Tickets</h1>

      {userTicketsStatus === 'loading' && <p>Loading tickets...</p>}
      
      {userTicketsStatus === 'succeeded' && (
        <div className="tickets-grid">
          {userTickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <h3>{ticket.event_title}</h3>
                <span className="ticket-code">Code: {ticket.code}</span>
              </div>
              <div className="ticket-details">
                <p><strong>Date:</strong> {new Date(ticket.event_date).toLocaleString()}</p>
                <p><strong>Location:</strong> {ticket.event_location}</p>
                <p><strong>Price:</strong> ${ticket.event_price}</p>
              </div>
              <div className="ticket-actions">
                <button 
                  onClick={() => handleDeleteTicket(ticket.id)}
                  className="delete-button"
                >
                  Cancel Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {userTicketsStatus === 'failed' && <p className="error">Error: {error}</p>}

      <style jsx>{`
        .tickets-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .tickets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .ticket-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
          transition: transform 0.2s;
          display: flex;
          flex-direction: column;
        }

        .ticket-card:hover {
          transform: translateY(-2px);
        }

        .ticket-header {
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .ticket-header h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .ticket-code {
          display: block;
          font-family: monospace;
          color: #666;
          font-size: 0.9rem;
        }

        .ticket-details p {
          margin: 0.5rem 0;
          color: #666;
        }

        .error {
          color: #e74c3c;
        }

        .ticket-actions {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
        }

        .delete-button {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .delete-button:hover {
          background: #c0392b;
        }

        .delete-button:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .ticket-details {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
};

export default UserTickets;