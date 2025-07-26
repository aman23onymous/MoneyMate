// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import  accountsReducer from '../features/accounts/accountsSlice';
import fixedDepositReducer from '../features/fixedDeposits/fixedDepositSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    fixedDeposits: fixedDepositReducer,
  },
});