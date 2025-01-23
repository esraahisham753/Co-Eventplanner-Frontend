import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchEvents = createAsyncThunk('events/fetchAll', async () => {
  const response = await axios.get(`${API_BASE_URL}/events/`);
  return response.data;
});

export const fetchEvent = createAsyncThunk('events/fetchById', async (eventId) => {
  const response = await axios.get(`${API_BASE_URL}/events/${eventId}/`);
  return response.data;
});

export const createEvent = createAsyncThunk('events/create', async (eventData, { getState }) => {
  const { token } = getState().user;
  const formData = new FormData();

  for (const key in eventData) {
    formData.append(key, eventData[key]);
  }

  const response = await axios.post(`${API_BASE_URL}/events/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const updateEvent = createAsyncThunk('events/update', async ({ eventId, eventData }, { getState }) => {
  const { token } = getState().user;
  const response = await axios.put(`${API_BASE_URL}/events/${eventId}/`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const deleteEvent = createAsyncThunk('events/delete', async (eventId, { getState }) => {
  const { token } = getState().user;
  await axios.delete(`${API_BASE_URL}/events/${eventId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return eventId;
});

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    event: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.event = action.payload;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = state.events.filter(event => event.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default eventSlice.reducer;