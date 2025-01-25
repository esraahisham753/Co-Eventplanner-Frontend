import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (eventId, {getState}) => {
  const response = await axios.get(`${API_BASE_URL}/events/${eventId}/tasks/`,
    {
      headers: {
        Authorization: `Bearer ${getState().user.token}`,
      }
    }
  );
  return response.data;
});

export const fetchTask = createAsyncThunk('tasks/fetchById', async (taskId, {getState}) => {
  const { token } = getState().user;
  const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}/`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );
  return response.data;
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, { getState }) => {
  const { token } = getState().user;
  const response = await axios.post(`${API_BASE_URL}/tasks/`, taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const updateTask = createAsyncThunk('tasks/update', async ({ taskId, taskData }, { getState }) => {
  const { token } = getState().user;
  const response = await axios.patch(`${API_BASE_URL}/tasks/${taskId}/`, taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (taskId, { getState }) => {
  const { token } = getState().user;
  await axios.delete(`${API_BASE_URL}/tasks/${taskId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return taskId;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    task: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.task = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default taskSlice.reducer;