import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import validator from 'email-validator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Fingerprint, Loader2 } from 'lucide-react';
import AuthCard from './AuthCard';
import { sendLoginOTP, clearState } from '../../features/auth/authSlice'; // Adjust path

const LoginPage = ({ setPage }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, message, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validationMsg, setValidationMsg] = useState({ email: '', password: '' });

  const loginValidated = formData.email && formData.password && !validationMsg.email && !validationMsg.password;

  useEffect(() => {
    // Check for the specific success message from your backend
    if (message?.includes('OTP sent to your email for login.')) {
      // Store form data to use on the next page
      sessionStorage.setItem('login_user_credentials', JSON.stringify(formData));
      // Switch to the OTP verification page
      console.log("LoginPage: Stored in sessionStorage:", JSON.parse(sessionStorage.getItem('login_user_credentials')));
      console.log("LoginPage: formData email:", formData.email);
      setPage('login_otp');
      // Clear the message so this doesn't run again
      dispatch(clearState());
    }
  }, [message, dispatch, navigate, formData, setPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const emailBlur = () => {
    if (!formData.email) {
      setValidationMsg(prev => ({ ...prev, email: 'Email is required.' }));
    } else if (!validator.validate(formData.email)) {
      setValidationMsg(prev => ({ ...prev, email: 'Please enter a valid email.' }));
    } else {
      setValidationMsg(prev => ({ ...prev, email: '' }));
    }
  };

  const passwordBlur = () => {
    if (!formData.password) {
      setValidationMsg(prev => ({ ...prev, password: 'Password is required.' }));
    } else {
      setValidationMsg(prev => ({ ...prev, password: '' }));
    }
  };

  const handleSendOtp = () => {
    if (!loginValidated) return;
    dispatch(sendLoginOTP(formData)); // Dispatch the new action
  };

  return (
    <AuthCard title="Login" description="Welcome back! Please enter your details.">
      <div className="space-y-4">
        <div>
          <Input name="email" type="email" placeholder="Email or phone number" value={formData.email} onChange={handleInputChange} onBlur={emailBlur} />
          {validationMsg.email && <p className="text-red-500 text-xs pt-1">{validationMsg.email}</p>}
        </div>
        <div>
          <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} onBlur={passwordBlur} />
          {validationMsg.password && <p className="text-red-500 text-xs pt-1">{validationMsg.password}</p>}
        </div>
      </div>
      <p onClick={() => setPage('forget_password_email')} className="text-sm text-blue-600 cursor-pointer hover:underline text-right mt-2">
        Forgot Password?
      </p>
      <Button onClick={handleSendOtp} disabled={isLoading || !loginValidated} className="w-full mt-6 bg-black text-white hover:bg-gray-800">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Log in'}
      </Button>
      <Button variant="outline" disabled={isLoading} className="w-full mt-2">
        <Fingerprint className="mr-2 h-4 w-4" /> Log in with biometrics
      </Button>
      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      <p className="mt-6 text-center text-sm">
        New here?{' '}
        <span onClick={() => setPage('register')} className="font-semibold text-blue-600 cursor-pointer hover:underline">
          Sign up
        </span>
      </p>
    </AuthCard>
  );
};

export default LoginPage;
