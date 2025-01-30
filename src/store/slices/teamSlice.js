import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchTeams = createAsyncThunk('teams/fetchAll', async (eventId, {getState}) => {
  const { token } = getState().user;
  const response = await axios.get(`${API_BASE_URL}/events/${eventId}/teams/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
});

export const fetchTeam = createAsyncThunk('teams/fetchById', async (teamId, { getState }) => {
  const { token } = getState().user;
  const response = await axios.get(`${API_BASE_URL}/teams/${teamId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const createTeam = createAsyncThunk('teams/create', async (teamData, { getState }) => {
  const { token } = getState().user;
  const response = await axios.post(`${API_BASE_URL}/teams/`, teamData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const updateTeam = createAsyncThunk('teams/update', async ({ teamId, teamData }, { getState }) => {
  const { token } = getState().user;
  const response = await axios.patch(`${API_BASE_URL}/teams/${teamId}/`, teamData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const deleteTeam = createAsyncThunk('teams/delete', async (teamId, { getState }) => {
  const { token } = getState().user;
  await axios.delete(`${API_BASE_URL}/teams/${teamId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return teamId;
});

export const fetchPendingInvitations = createAsyncThunk(
  'teams/fetchPendingInvitations',
  async (_, { getState }) => {
    const { token } = getState().user;
    const response = await axios.get(
      `${API_BASE_URL}/me/teams/pending/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

const teamSlice = createSlice({
  name: 'teams',
  initialState: {
    teams: [],
    team: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTeam.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.team = action.payload;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTeam.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teams.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateTeam.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.teams.findIndex(team => team.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteTeam.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teams = state.teams.filter(team => team.id !== action.payload);
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPendingInvitations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPendingInvitations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teams = action.payload;
      })
      .addCase(fetchPendingInvitations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default teamSlice.reducer;