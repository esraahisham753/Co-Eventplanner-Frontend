import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchMessages = createAsyncThunk('messages/fetchAll', async (eventId, {getState}) => {
  const response = await axios.get(`${API_BASE_URL}/events/${eventId}/messages/`,
    {
      headers: {
        Authorization: `Bearer ${getState().user.token}`,
      }
    }
  );
  return response.data;
});

export const fetchMessage = createAsyncThunk('messages/fetchById', async (messageId, {getState}) => {
  const { token } = getState().user;
  const response = await axios.get(`${API_BASE_URL}/messages/${messageId}/`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );
  return response.data;
});

export const createMessage = createAsyncThunk('messages/create', async (messageData, { getState }) => {
  const { token } = getState().user;
  const response = await axios.post(`${API_BASE_URL}/messages/`, messageData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Added for image upload support
    },
  });
  return response.data;
});

export const updateMessage = createAsyncThunk(
  'messages/update',
  async ({ messageId, messageData }, { getState }) => {
    const { token } = getState().user;
    const response = await axios.patch(`${API_BASE_URL}/messages/${messageId}/`, messageData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Added for image upload support
      },
    });
    return response.data;
  }
);

export const deleteMessage = createAsyncThunk('messages/delete', async (messageId, { getState }) => {
  const { token } = getState().user;
  await axios.delete(`${API_BASE_URL}/messages/${messageId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return messageId;
});

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    message: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    addLocalMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateLocalMessage: (state, action) => {
      const index = state.messages.findIndex(msg => msg.id === action.payload.id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    removeLocalMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload;
      })
      .addCase(fetchMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.push(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.messages.findIndex(msg => msg.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(updateMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = state.messages.filter(msg => msg.id !== action.payload);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addLocalMessage, updateLocalMessage, removeLocalMessage } = messageSlice.actions;
export default messageSlice.reducer; 