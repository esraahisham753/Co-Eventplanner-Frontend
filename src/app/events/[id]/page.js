'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchEvent } from '../../../../store/slices/eventSlice';
import { createTask } from '../../../../store/slices/taskSlice';

const EventDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { event, status, error } = useSelector((state) => state.events);
  const taskStatus = useSelector((state) => state.tasks.status);
  const taskError = useSelector((state) => state.tasks.error);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchEvent(id));
    }
  }, [dispatch, id]);

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const taskData = { title, description, event: id };
    dispatch(createTask(taskData));
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

      <h2>Add Task</h2>
      <form onSubmit={handleTaskSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <input type="hidden" name="event" value={id} />
        <button type="submit">Add Task</button>
      </form>
      {taskStatus === 'loading' && <p>Adding task...</p>}
      {taskStatus === 'succeeded' && <p>Task added successfully.</p>}
      {taskStatus === 'failed' && <p>Error: {taskError}</p>}
    </div>
  );
};

export default EventDetails;