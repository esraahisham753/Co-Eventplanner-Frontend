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
    const userData = await axios.get(`${API_BASE_URL}/users/username/${credentials.username}/`, {
        headers: {
            Authorization: `Bearer ${response.data.access}`,
        },
      });
    
    console.log(userData.data);

    return {
        token: response.data.access,
        user: userData.data[0]
    };
});

export const registerUser = createAsyncThunk('user/register', async (userData) => {
    const csrfToken = await getCSRFToken();
    axios.defaults.headers.post['X-CSRFToken'] = csrfToken;
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    formData.append('email', userData.email);
    
    if (userData.image) {
        formData.append('image', userData.image);
    }

    const response = await axios.post(`${API_BASE_URL}/users/`, userData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
});

export const updateUser = createAsyncThunk('user/update', async ({ user, userData }, { getState }) => {
  const { token } = getState().user;
  const formData = new FormData();
  formData.append('username', userData.username);
  formData.append('email', userData.email);

  if (userData.image) {
    formData.append('image', userData.image);
  }

  const response = await axios.patch(`${API_BASE_URL}/users/${user.id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const deleteUser = createAsyncThunk('user/delete', async (_, { getState }) => {
  const { token, user } = getState().user;
  await axios.delete(`${API_BASE_URL}/users/${user.id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return user.id;
});

export const logoutUser = createAsyncThunk('user/logout', async (_, { dispatch }) => {
  dispatch(logout());
  return null;
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
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
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
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;