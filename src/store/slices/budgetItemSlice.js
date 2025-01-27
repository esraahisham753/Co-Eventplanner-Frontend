import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchBudgetItems = createAsyncThunk('budgetItems/fetchAll', async (eventId, {getState}) => {
  const response = await axios.get(`${API_BASE_URL}/events/${eventId}/budgetitems/`,
    {
      headers: {
        Authorization: `Bearer ${getState().user.token}`,
      }
    }
  );
  return response.data;
});

export const fetchBudgetItem = createAsyncThunk('budgetItems/fetchById', async (budgetItemId, {getState}) => {
  const { token } = getState().user;
  const response = await axios.get(`${API_BASE_URL}/budgetitems/${budgetItemId}/`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );
  return response.data;
});

export const createBudgetItem = createAsyncThunk('budgetItems/create', async (budgetItemData, { getState }) => {
  const { token } = getState().user;
  const response = await axios.post(`${API_BASE_URL}/budgetitems/`, budgetItemData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const updateBudgetItem = createAsyncThunk(
  'budgetItems/update',
  async ({ budgetItemId, budgetItemData }, { getState }) => {
    const { token } = getState().user;
    const response = await axios.patch(`${API_BASE_URL}/budgetitems/${budgetItemId}/`, budgetItemData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const deleteBudgetItem = createAsyncThunk('budgetItems/delete', async (budgetItemId, { getState }) => {
  const { token } = getState().user;
  await axios.delete(`${API_BASE_URL}/budgetitems/${budgetItemId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return budgetItemId;
});

const budgetItemSlice = createSlice({
  name: 'budgetItems',
  initialState: {
    budgetItems: [],
    budgetItem: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgetItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBudgetItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.budgetItems = action.payload;
      })
      .addCase(fetchBudgetItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchBudgetItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBudgetItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.budgetItem = action.payload;
      })
      .addCase(fetchBudgetItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createBudgetItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBudgetItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.budgetItems.push(action.payload);
      })
      .addCase(createBudgetItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateBudgetItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateBudgetItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.budgetItems.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.budgetItems[index] = action.payload;
        }
      })
      .addCase(updateBudgetItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteBudgetItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteBudgetItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.budgetItems = state.budgetItems.filter(item => item.id !== action.payload);
      })
      .addCase(deleteBudgetItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default budgetItemSlice.reducer; 