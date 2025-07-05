// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/index'; // Adjust the import path as needed

// Helper to get user from localStorage
const user = JSON.parse(localStorage.getItem('profile'));

const initialState = {
  user: user ? user : null,
  isLoading: false,
  error: null,
  // 'message' can be used for non-error feedback, like "OTP sent!"
  message: null, 
};

//== Async Thunks (Replaces your action functions) ==//

export const sendRegisterOTP = createAsyncThunk(
  'auth/sendRegisterOTP',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.sendRegisterOTP(email);
      if (data.success) {
        return data.message; // Return success message
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'An error occurred');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ userData, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await api.register(userData);
      if (data.success) {
        navigate('/'); // Perform navigation on success
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'An error occurred');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ userData, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await api.login(userData);
      if (data.success) {
        navigate('/'); // Perform navigation on success
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'An error occurred');
    }
  }
);

export const sendForgetPasswordOTP = createAsyncThunk(
  'auth/sendForgetPasswordOTP',
  async (email, { rejectWithValue }) => {
    try {
        const { data } = await api.sendForgetPasswordOTP(email)
        if (data.success) {
            return data.message;
        }
        else {
            return rejectWithValue(data.message)
        }
    } catch (error) {
        return rejectWithValue(error.response.data.message || 'An error occurred')
    }
  }
)

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await api.changePassword(userData)
            if (data.success) {
                return data.message;
            } else {
                return rejectWithValue(data.message)
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'An error occurred')
        }
    }
)


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Sync reducer to clear errors or messages
    clearState: (state) => {
      state.error = null;
      state.message = null;
    },
    // Sync reducer for logout
    logout: (state) => {
      localStorage.removeItem('profile');
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generic pending state
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
          state.message = null;
        }
      )
      // Generic rejected state
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload; // payload is the rejected value
        }
      )
      // Handle Login/Register success
      .addMatcher(
        (action) => action.type === 'auth/login/fulfilled' || action.type === 'auth/register/fulfilled',
        (state, action) => {
          state.isLoading = false;
          localStorage.setItem('profile', JSON.stringify(action.payload));
          state.user = action.payload;
        }
      )
      // Handle OTP and Password Change success
      .addMatcher(
        (action) => action.type === 'auth/sendRegisterOTP/fulfilled' || action.type === 'auth/sendForgetPasswordOTP/fulfilled' || action.type === 'auth/changePassword/fulfilled',
        (state, action) => {
          state.isLoading = false;
          state.message = action.payload; // Set the success message
        }
      );
  },
});

export const { clearState, logout } = authSlice.actions;

export default authSlice.reducer;