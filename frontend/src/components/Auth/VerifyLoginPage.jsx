import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import AuthCard from './AuthCard';
import { login, sendLoginOTP, clearState } from '../../features/auth/authSlice'; // Adjust path as needed

const VerifyLoginPage = ({ setPage }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState('');
  
  // Retrieve the stored credentials from sessionStorage
  const userCredentials = JSON.parse(sessionStorage.getItem('login_user_credentials'));
  const email = userCredentials?.email;

  // Clear any previous errors when the component loads
  useEffect(() => {
    dispatch(clearState());
  }, [dispatch]);

  // This function is called when the user submits the OTP
  const handleVerifyAndLogin = () => {
    // Ensure OTP and credentials exist before dispatching
    if (!otp || !userCredentials) {
        console.error("OTP or user credentials not found.");
        return;
    };
    
    // Combine the stored credentials (email, password) with the new OTP
    const userData = { ...userCredentials, otp };
    
    // Dispatch the final login action
    dispatch(login({ userData, navigate }));
  };

  // This function is called when the user clicks "Resend"
  const handleResendOTP = () => {
    if (!userCredentials) {
        console.error("User credentials not found for resending OTP.");
        return;
    }
    // Dispatch the action to send a new login OTP
    dispatch(sendLoginOTP(userCredentials));
  }

  // Fallback UI in case the user lands here directly without credentials
  if (!email) {
    return (
        <AuthCard title="Error" description="Something went wrong.">
            <p className="text-center text-sm">
                No user information was found. Please return to the login page.
            </p>
            <Button onClick={() => setPage('login')} className="w-full mt-4">
                Go to Login
            </Button>
        </AuthCard>
    );
  }

  return (
    <AuthCard title="Verify Your Identity" description={`We've sent a verification code to ${email}.`}>
      <div className="space-y-4">
        <Input
          name="otp"
          type="text"
          placeholder="Verification Code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      <Button onClick={handleVerifyAndLogin} disabled={isLoading || !otp} className="w-full mt-6 bg-black text-white hover:bg-gray-800">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify & Log In'}
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-4 text-center">
            {error}{' '}
            <span onClick={handleResendOTP} className="text-blue-600 cursor-pointer hover:underline">
                Resend
            </span>
        </p>
      )}
      <p className="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => setPage('login')}>
        Go Back to Login
      </p>
    </AuthCard>
  );
};

export default VerifyLoginPage;
