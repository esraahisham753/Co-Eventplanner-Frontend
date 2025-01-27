import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchTickets = createAsyncThunk('tickets/fetchAll', async (eventId, {getState}) => {
  const response = await axios.get(`${API_BASE_URL}/events/${eventId}/tickets/`,
    {
      headers: {
        Authorization: `Bearer ${getState().user.token}`,
      }
    }
  );
  return response.data;
});

export const fetchTicket = createAsyncThunk('tickets/fetchById', async (ticketId, {getState}) => {
  const { token } = getState().user;
  const response = await axios.get(`${API_BASE_URL}/tickets/${ticketId}/`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );
  return response.data;
});

export const createTicket = createAsyncThunk('tickets/create', async (ticketData, { getState }) => {
  const { token } = getState().user;
  const response = await axios.post(`${API_BASE_URL}/tickets/`, ticketData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const updateTicket = createAsyncThunk(
  'tickets/update',
  async ({ ticketId, ticketData }, { getState }) => {
    const { token } = getState().user;
    const response = await axios.patch(`${API_BASE_URL}/tickets/${ticketId}/`, ticketData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const deleteTicket = createAsyncThunk('tickets/delete', async (ticketId, { getState }) => {
  const { token } = getState().user;
  await axios.delete(`${API_BASE_URL}/tickets/${ticketId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return ticketId;
});

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    ticket: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTicket.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTicket.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ticket = action.payload;
      })
      .addCase(fetchTicket.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTicket.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateTicket.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteTicket.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tickets = state.tickets.filter(ticket => ticket.id !== action.payload);
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ticketSlice.reducer; 