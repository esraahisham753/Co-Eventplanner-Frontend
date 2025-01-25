'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchEvent } from '../../../store/slices/eventSlice';
import { fetchTasks } from '../../../store/slices/taskSlice';
import { createTeam, fetchTeams } from '../../../store/slices/teamSlice';

const EventDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { event, status, error } = useSelector((state) => state.events);
  const { tasks, status: taskStatus, error: taskError } = useSelector((state) => state.tasks);
  const { teams, status: teamStatus, error: teamError } = useSelector((state) => state.teams);

  const [username, setUsername] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchEvent(id));
      dispatch(fetchTasks(id));
      dispatch(fetchTeams(id));
    }
  }, [dispatch, id]);

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    const teamData = { username, event: id };
    dispatch(createTeam(teamData));
  };

  return (
    <div>
      <h1>Event Details</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' && event && (
        <div>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          {event.image && <img src={event.image} alt={event.title} />}
          <p>Price: ${event.price}</p>
          <p>Location: {event.location}</p>
          <p>Date: {new Date(event.date).toLocaleString()}</p>
        </div>
      )}
      {status === 'failed' && <p>Error: {error}</p>}

      <h2>Tasks</h2>
      {taskStatus === 'loading' && <p>Loading tasks...</p>}
      {taskStatus === 'succeeded' && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
            </li>
          ))}
        </ul>
      )}
      {taskStatus === 'failed' && <p>Error: {taskError}</p>}

      <h2>Invite Team Member</h2>
      <form onSubmit={handleInviteSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <input type="hidden" name="event" value={id} />
        <button type="submit">Invite</button>
      </form>
      {teamStatus === 'loading' && <p>Inviting...</p>}
      {teamStatus === 'succeeded' && <p>Team member invited successfully.</p>}
      {teamStatus === 'failed' && <p>Error: {teamError}</p>}

      <h2>Teams</h2>
      {teamStatus === 'loading' && <p>Loading teams...</p>}
      {teamStatus === 'succeeded' && (
        <ul>
          {teams.map((team) => (
            <li key={team.id}>
              <h3>{team.username}</h3>
              {team.image && <img src={team.image} alt={team.username} />}
              <p>Role: {team.role}</p>
            </li>
          ))}
        </ul>
      )}
      {teamStatus === 'failed' && <p>Error: {teamError}</p>}
    </div>
  );
};

export default EventDetails;