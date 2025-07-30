import axios from 'axios';

// Create an Axios instance. You can configure it with your base URL.
// Replace 'http://localhost:5000' with your actual backend server URL.
const API = axios.create({ baseURL: 'http://localhost:8080' });

/* This is an interceptor that adds the JWT token to the header of every request.
  This is crucial for authorizing protected routes on your backend.
*/
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

// Note: The 'email' in sendRegisterOTP(email) is a simple string, not an object.
// Axios POST requests expect an object as the second argument, so we wrap it.
export const sendRegisterOTP = (email) => API.post("/api/users/register/send-otp", { email });

export const register = (userData) => API.post('/api/users/register', userData);

export const sendLoginOTP = (userData) => API.post("/api/users/login/send-otp", userData);

export const login = (userData) => API.post('/api/users/login', userData);

export const sendForgetPasswordOTP = (email) => API.post('/api/users/send-forget-password-otp', { email });

export const changePassword = (userData) => API.post('/api/users/change-password', userData);

export const getAccounts = () => API.get('/api/account/getAccounts');

export const createAccount = (accountData) => API.post('/api/account/create', accountData);

export const getFixedDeposits = () => API.get('/api/account/fd');

export const createFixedDeposit = (fdData) => API.post('/api/account/fd/create', fdData);

export const initiateTransfer = (transferData) => API.post('/api/transaction/initiate', transferData);

export const verifyTransfer = (verificationData) => API.post('/api/transaction/verify-otp', verificationData);

export const getTransactionHistory = () => API.get('/api/transaction/history');

// You can add other API calls for your application here
// export const fetchPosts = () => API.get('/posts');
// export const createPost = (newPost) => API.post('/posts', newPost);
