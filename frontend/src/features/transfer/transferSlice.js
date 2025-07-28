import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/index';

export const initiateTransfer = createAsyncThunk(
  'transfer/initiateTransfer',
  async (transferData, { rejectWithValue }) => {
    try {
      const { data } = await api.initiateTransfer(transferData);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to initiate transfer';
      return rejectWithValue(message);
    }
  }
);

export const verifyTransfer = createAsyncThunk(
  'transfer/verifyTransfer',
  async (verificationData, { rejectWithValue }) => {
    try {
      // The API call returns { message, transaction }
      const { data } = await api.verifyTransfer(verificationData);
      return data; // Return the entire object
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to verify transfer';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  transactionId: null,
  isLoading: false,
  error: null,
  message: null,
  status: 'idle', // idle | pending | succeeded | failed
  completedTransaction: null,
};

const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    clearTransferState: (state) => {
      state.transactionId = null;
      state.isLoading = false;
      state.error = null;
      state.message = null;
      state.status = 'idle';
      state.completedTransaction = null; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateTransfer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(initiateTransfer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactionId = action.payload.transactionId;
        state.message = action.payload.message;
        state.status = 'succeeded';
      })
      .addCase(initiateTransfer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(verifyTransfer.pending, (state) => {
        state.isLoading = true;
        state.completedTransaction = null; // Clear old data
      })
      .addCase(verifyTransfer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        // The magic happens here: store the transaction object
        state.completedTransaction = action.payload.transaction;
        state.status = 'succeeded';
      })
      .addCase(verifyTransfer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export const { clearTransferState } = transferSlice.actions;

export default transferSlice.reducer;