'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchTask } from '../../../store/slices/taskSlice';

const FetchTask = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { task, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (id) {
      dispatch(fetchTask(id));
    }
  }, [dispatch, id]);

  return (
    <div>
      <h1>Task Details</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' && task && (
        <div>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Event ID: {task.event}</p>
          <p>User ID: {task.user}</p>
        </div>
      )}
      {status === 'failed' && <p>Error: {error}</p>}
    </div>
  );
};

export default FetchTask;