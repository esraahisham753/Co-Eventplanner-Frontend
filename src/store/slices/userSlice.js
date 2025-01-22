import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCSRFToken = async () => {
    const response = await axios.get(`${API_BASE_URL}/csrf/`);
    return response.data.csrfToken;
};

export const loginUser = createAsyncThunk('user/login', async (credentials) => {
    const csrfToken = await getCSRFToken();
    axios.defaults.headers.post['X-CSRFToken'] = csrfToken;
    const response = await axios.post(`${API_BASE_URL}/token/`, credentials);
    return {
        token: response.data.access,
        username: credentials.username,
    };
});

export const registerUser = createAsyncThunk('user/register', async (userData) => {
    const csrfToken = await getCSRFToken();
    axios.defaults.headers.post['X-CSRFToken'] = csrfToken;
    const response = await axios.post(`${API_BASE_URL}/users/`, userData);
    return response.data;
});

export const retrieveUser = createAsyncThunk('user/retrieve', async (userId, { getState }) => {
  const { token } = getState().user;
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const updateUser = createAsyncThunk('user/update', async ({ userId, userData }, { getState }) => {
  const { token } = getState().user;
  const response = await axios.put(`${API_BASE_URL}/users/${userId}/`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const deleteUser = createAsyncThunk('user/delete', async (userId, { getState }) => {
  const { token } = getState().user;
  await axios.delete(`${API_BASE_URL}/users/${userId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return userId;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.username;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(retrieveUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(retrieveUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(retrieveUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = null;
        state.token = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;