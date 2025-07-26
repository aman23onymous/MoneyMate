import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/index'; // Adjust path as needed

// --- Async Thunks ---

export const getFixedDeposits = createAsyncThunk(
  'fixedDeposits/getFixedDeposits',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getFixedDeposits();
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch fixed deposits';
      return rejectWithValue(message);
    }
  }
);

export const createFixedDeposit = createAsyncThunk(
  'fixedDeposits/createFixedDeposit',
  async (fdData, { rejectWithValue }) => {
    try {
      // Your backend returns an object like { message: '...', fd: newFd }
      const { data } = await api.createFixedDeposit(fdData);
      
      // FIX: We now return the new FD object directly from the API response.
      // This becomes the 'fulfilled' action's payload. This is more efficient than re-fetching.
      return data.fd; 
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create fixed deposit';
      return rejectWithValue(message);
    }
  }
);

// --- Slice Definition ---

const initialState = {
  fixedDeposits: [],
  isLoading: false,
  error: null,
  message: null,
};

const fixedDepositSlice = createSlice({
  name: 'fixedDeposits',
  initialState,
  reducers: {
    clearFdState: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith('fixedDeposits/') && action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
          state.message = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('fixedDeposits/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )
      // This matcher handles the successful fetching of the FD list.
      .addMatcher(
        (action) => action.type === 'fixedDeposits/getFixedDeposits/fulfilled',
        (state, action) => {
          state.isLoading = false;
          state.fixedDeposits = action.payload;
        }
      )
      // FIX: This matcher now specifically handles the successful creation of a new FD.
      .addMatcher(
        (action) => action.type === 'fixedDeposits/createFixedDeposit/fulfilled',
        (state, action) => {
          state.isLoading = false;
          // It adds the new FD (from the action.payload) to the start of the existing list.
          state.fixedDeposits.unshift(action.payload);
          state.message = "Fixed Deposit created successfully!";
        }
      );
  },
});

export const { clearFdState } = fixedDepositSlice.actions;
export default fixedDepositSlice.reducer;
