'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventsByUser } from '../../store/slices/eventSlice';

const FetchUserEvents = () => {
  const dispatch = useDispatch();
  const { events, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEventsByUser());
  }, [dispatch]);

  return (
    <div>
      <h1>User Events</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' && (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              {event.image && <img src={event.image} alt={event.title} />}
              <p>Price: ${event.price}</p>
              <p>Location: {event.location}</p>
              <p>Date: {new Date(event.date).toLocaleString()}</p>
              <p>Role: {event.role}</p>
            </li>
          ))}
        </ul>
      )}
      {status === 'failed' && <p>Error: {error}</p>}
    </div>
  );
};

export default FetchUserEvents;