'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchTask, updateTask, deleteTask } from '../../../../store/slices/taskSlice';

const UpdateDeleteTask = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { task, status, error } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchTask(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setTaskStatus(task.status || 'not_started');
    }
  }, [task]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const taskData = { title, description, status: taskStatus };
    dispatch(updateTask({ taskId: id, taskData }));
  };

  const handleDelete = () => {
    dispatch(deleteTask(id));
  };

  return (
    <div>
      <h1>Update/Delete Task</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' && task && (
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
            <label>Status:</label>
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit">Update Task</button>
        </form>
      )}
      {status === 'failed' && <p>Error: {error}</p>}
      <button onClick={handleDelete}>Delete Task</button>
    </div>
  );
};

export default UpdateDeleteTask;