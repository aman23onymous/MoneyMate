import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api/v1' });

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('profile');
  if (profile) {
    const token = JSON.parse(profile).token;
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});

// === AUTHENTICATION API CALLS ===
export const sendRegisterOTP = (email) => API.post("/users/register/send-otp", { email });
export const register = (userData) => API.post('/users/register', userData);
export const sendLoginOTP = (userData) => API.post("/users/login/send-otp", userData);
export const login = (userData) => API.post('/users/login', userData);
export const sendForgetPasswordOTP = (email) => API.post('/users/send-forget-password-otp', { email });
export const changePassword = (userData) => API.post('/users/change-password', userData);

// === ACCOUNT API CALLS ===
export const getAccounts = () => API.get('/account/getAccounts');
export const createAccount = (accountData) => API.post('/account/create', accountData);
export const getFixedDeposits = () => API.get('/account/fd');
export const createFixedDeposit = (fdData) => API.post('/account/fd/create', fdData);

// === TRANSACTION API CALLS ===
export const initiateTransfer = (transferData) => API.post('/transaction/initiate', transferData);
export const verifyTransfer = (verificationData) => API.post('/transaction/verify-otp', verificationData);
export const getTransactionHistory = () => API.get('/transaction/history');