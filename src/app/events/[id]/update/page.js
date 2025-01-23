'use client';

import React, { use, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateEvent, deleteEvent, fetchEvent } from '../../../../store/slices/eventSlice';

const UpdateDeleteEvent = () => {
  const { id } = useParams();
  const [eventId, setEventId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const dispatch = useDispatch();
  const { status, error, event } = useSelector((state) => state.events);

  useEffect(() => {
    if (id) {
        dispatch(fetchEvent(id));
        setTitle(event.title);
    }
  }, [dispatch, id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const eventData = { title, description, image, price, location, date };
    dispatch(updateEvent({ id, eventData }));
  };

  const handleDelete = () => {
    dispatch(deleteEvent(id));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div>
      <h1>Update/Delete Event</h1>
      <form onSubmit={handleUpdate}>
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
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit">Update Event</button>
      </form>
      <button onClick={handleDelete}>Delete Event</button>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' && <p>Action completed successfully.</p>}
      {status === 'failed' && <p>Error: {error}</p>}
    </div>
  );
};

export default UpdateDeleteEvent;