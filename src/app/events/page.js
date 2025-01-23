'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../../store/slices/eventSlice';

const FetchEvents = () => {
  const dispatch = useDispatch();
  const { events, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div>
      <h1>Events</h1>
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
            </li>
          ))}
        </ul>
      )}
      {status === 'failed' && <p>Error: {error}</p>}
    </div>
  );
};

export default FetchEvents;