'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchEvent } from '../../../store/slices/eventSlice';
import { fetchTasks } from '../../../store/slices/taskSlice';
import { createTeam, fetchTeams } from '../../../store/slices/teamSlice';
import { 
  createBudgetItem, 
  fetchBudgetItems, 
  updateBudgetItem, 
  deleteBudgetItem 
} from '../../../store/slices/budgetItemSlice';
import { createTicket, fetchTickets } from '../../../store/slices/ticketSlice';

const EventDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { event, status, error } = useSelector((state) => state.events);
  const { tasks, status: taskStatus, error: taskError } = useSelector((state) => state.tasks);
  const { teams, status: teamStatus, error: teamError } = useSelector((state) => state.teams);
  const { budgetItems, status: budgetStatus, error: budgetError } = useSelector((state) => state.budgetItems);
  const { tickets, status: ticketStatus, error: ticketError } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.user);

  const [username, setUsername] = useState('');
  const [budgetItemForm, setBudgetItemForm] = useState({
    title: '',
    description: '',
    amount: '',
  });
  const [editingBudgetItem, setEditingBudgetItem] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchEvent(id));
      dispatch(fetchTasks(id));
      dispatch(fetchTeams(id));
      dispatch(fetchBudgetItems(id));
      dispatch(fetchTickets(id));
    }
  }, [dispatch, id]);

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    const teamData = { username, event: id };
    dispatch(createTeam(teamData));
  };

  const handleBudgetItemSubmit = (e) => {
    e.preventDefault();
    const budgetItemData = {
      ...budgetItemForm,
      event: id,
      amount: parseFloat(budgetItemForm.amount)
    };

    if (editingBudgetItem) {
      dispatch(updateBudgetItem({ 
        budgetItemId: editingBudgetItem.id, 
        budgetItemData 
      }));
      setEditingBudgetItem(null);
    } else {
      dispatch(createBudgetItem(budgetItemData));
    }
    setBudgetItemForm({ title: '', description: '', amount: '' });
  };

  const handleBudgetItemEdit = (item) => {
    setEditingBudgetItem(item);
    setBudgetItemForm({
      title: item.title,
      description: item.description,
      amount: item.amount.toString(),
    });
  };

  const handleBudgetItemDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this budget item?')) {
      dispatch(deleteBudgetItem(itemId));
    }
  };

  const handleBudgetItemChange = (e) => {
    setBudgetItemForm({
      ...budgetItemForm,
      [e.target.name]: e.target.value
    });
  };

  const handleBuyTicket = () => {
    const ticketData = {
      event: id,
      user: user.id,
      code: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    };
    dispatch(createTicket(ticketData));
  };

  return (
    <div className="event-details-container">
      <div className="event-header">
        <h1>Event Details</h1>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'succeeded' && event && (
          <div className="event-info">
            <h2>{event.title}</h2>
            <div className="event-meta">
              <p><strong>Price:</strong> ${event.price}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
            </div>
            
            <div className="ticket-stats">
              <div className="stat-box">
                <h4>Total Tickets Sold</h4>
                {ticketStatus === 'loading' ? (
                  <p>Loading...</p>
                ) : ticketStatus === 'succeeded' ? (
                  <p className="stat-number">{tickets.length}</p>
                ) : null}
              </div>
              <div className="stat-box">
                <h4>Your Tickets</h4>
                {ticketStatus === 'loading' ? (
                  <p>Loading...</p>
                ) : ticketStatus === 'succeeded' ? (
                  <p className="stat-number">
                    {tickets.filter(ticket => ticket.user === user.id).length}
                  </p>
                ) : null}
              </div>
            </div>

            <p className="event-description">{event.description}</p>
            {event.image && <img src={event.image} alt={event.title} className="event-image" />}
            
            <div className="ticket-section">
              <div className="ticket-info">
                <h3>Your Tickets</h3>
                {ticketStatus === 'loading' && <p>Loading tickets...</p>}
                {ticketStatus === 'succeeded' && (
                  <>
                    <p>You have {tickets.filter(ticket => ticket.user === user.id).length} ticket(s) for this event</p>
                    <ul className="tickets-list">
                      {tickets
                        .filter(ticket => ticket.user === user.id)
                        .map(ticket => (
                          <li key={ticket.id} className="ticket-item">
                            <span>Ticket Code: {ticket.code}</span>
                          </li>
                        ))}
                    </ul>
                  </>
                )}
                {ticketStatus === 'failed' && <p className="error">Error: {ticketError}</p>}
              </div>
              <button 
                onClick={handleBuyTicket} 
                className="buy-ticket-button"
                disabled={ticketStatus === 'loading'}
              >
                {ticketStatus === 'loading' ? 'Processing...' : 'Buy Ticket'}
              </button>
            </div>
          </div>
        )}
        {status === 'failed' && <p className="error">Error: {error}</p>}
      </div>

      <div className="content-grid">
        <div className="budget-section">
          <h2>Budget Management</h2>
          <div className="budget-container">
            <div className="budget-form">
              <h3>{editingBudgetItem ? 'Edit Budget Item' : 'Add New Budget Item'}</h3>
              <form onSubmit={handleBudgetItemSubmit}>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={budgetItemForm.title}
                    onChange={handleBudgetItemChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={budgetItemForm.description}
                    onChange={handleBudgetItemChange}
                    required
                    className="form-textarea"
                  />
                </div>
                <div className="form-group">
                  <label>Amount:</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    value={budgetItemForm.amount}
                    onChange={handleBudgetItemChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    {editingBudgetItem ? 'Update Budget Item' : 'Add Budget Item'}
                  </button>
                  {editingBudgetItem && (
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setEditingBudgetItem(null);
                        setBudgetItemForm({ title: '', description: '', amount: '' });
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="budget-list">
              <h3>Budget Items List</h3>
              {budgetStatus === 'loading' && <p>Loading budget items...</p>}
              {budgetStatus === 'succeeded' && (
                <>
                  <div className="budget-summary">
                    <p>Total Budget: ${budgetItems.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)}</p>
                  </div>
                  <ul className="budget-items">
                    {budgetItems.map((item) => (
                      <li key={item.id} className="budget-item">
                        <div className="budget-item-header">
                          <h4>{item.title}</h4>
                          <span className="amount">${parseFloat(item.amount).toFixed(2)}</span>
                        </div>
                        <p className="description">{item.description}</p>
                        <div className="item-actions">
                          <button
                            onClick={() => handleBudgetItemEdit(item)}
                            className="edit-button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleBudgetItemDelete(item.id)}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {budgetStatus === 'failed' && <p className="error">Error: {budgetError}</p>}
            </div>
          </div>
        </div>

        <div className="tasks-section">
          <h2>Tasks</h2>
          {taskStatus === 'loading' && <p>Loading tasks...</p>}
          {taskStatus === 'succeeded' && (
            <ul className="tasks-list">
              {tasks.map((task) => (
                <li key={task.id} className="task-item">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p className="task-status">Status: {task.status}</p>
                </li>
              ))}
            </ul>
          )}
          {taskStatus === 'failed' && <p className="error">Error: {taskError}</p>}
        </div>

        <div className="team-section">
          <div className="team-invite">
            <h2>Invite Team Member</h2>
            <form onSubmit={handleInviteSubmit} className="invite-form">
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                />
              </div>
              <button type="submit" className="submit-button">Invite</button>
            </form>
            {teamStatus === 'loading' && <p>Inviting...</p>}
            {teamStatus === 'succeeded' && <p className="success">Team member invited successfully.</p>}
            {teamStatus === 'failed' && <p className="error">Error: {teamError}</p>}
          </div>

          <div className="team-list">
            <h2>Team Members</h2>
            {teamStatus === 'loading' && <p>Loading teams...</p>}
            {teamStatus === 'succeeded' && (
              <ul className="teams-list">
                {teams.map((team) => (
                  <li key={team.id} className="team-item">
                    <h3>{team.username}</h3>
                    {team.image && <img src={team.image} alt={team.username} className="team-image" />}
                    <p className="team-role">Role: {team.role}</p>
                  </li>
                ))}
              </ul>
            )}
            {teamStatus === 'failed' && <p className="error">Error: {teamError}</p>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .event-details-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .event-header {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .event-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .budget-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .budget-form, .budget-list, .tasks-section, .team-section {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .submit-button, .edit-button, .delete-button, .cancel-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .submit-button {
          background: #0070f3;
          color: white;
        }

        .submit-button:hover {
          background: #0051a2;
        }

        .edit-button {
          background: #2ecc71;
          color: white;
        }

        .delete-button {
          background: #e74c3c;
          color: white;
        }

        .cancel-button {
          background: #95a5a6;
          color: white;
        }

        .budget-items, .tasks-list, .teams-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .budget-item, .task-item, .team-item {
          background: white;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .budget-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .item-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .amount {
          font-weight: bold;
          color: #0070f3;
        }

        .description {
          color: #666;
          margin: 0.5rem 0;
        }

        .budget-summary {
          background: #f8f9fa;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
          text-align: right;
          font-weight: bold;
        }

        .error {
          color: #e74c3c;
        }

        .success {
          color: #2ecc71;
        }

        .team-image {
          width: 50px;
          height: 50px;
          border-radius: 25px;
          object-fit: cover;
        }

        .event-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .ticket-section {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .ticket-info {
          margin-bottom: 1rem;
        }

        .tickets-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }

        .ticket-item {
          background: white;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .buy-ticket-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .buy-ticket-button:hover {
          background: #218838;
        }

        .buy-ticket-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .ticket-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .stat-box {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-box h4 {
          margin: 0 0 0.5rem 0;
          color: #666;
          font-size: 0.9rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #0070f3;
          margin: 0;
        }

        @media (min-width: 768px) {
          .content-grid {
            grid-template-columns: 2fr 1fr;
          }
          
          .budget-section {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </div>
  );
};

export default EventDetails;