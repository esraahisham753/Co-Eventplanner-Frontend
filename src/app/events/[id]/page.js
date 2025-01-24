'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchEvent } from '../../../store/slices/eventSlice';
import { fetchTasks } from '../../../store/slices/taskSlice';

const EventDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { event, status, error } = useSelector((state) => state.events);
  const { tasks, status: taskStatus, error: taskError } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (id) {
      dispatch(fetchEvent(id));
      dispatch(fetchTasks(id));
    }
  }, [dispatch, id]);

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
    </div>
  );
};

export default EventDetails;