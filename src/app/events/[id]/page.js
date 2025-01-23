'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchEvent } from '../../../store/slices/eventSlice';

const FetchEvent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { event, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    if (id) {
      dispatch(fetchEvent(id));
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
    </div>
  );
};

export default FetchEvent;