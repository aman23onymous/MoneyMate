import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import *as api from '../../api/index';

export const getTransactions = createAsyncThunk(
    'transactions/getTransactions',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.getTransactionHistory();
            return data.transactions;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch transactions';
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    transactions: [],
    isLoading: false,
    error: null,
};

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        clearTransactionState: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTransactions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = action.payload;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;