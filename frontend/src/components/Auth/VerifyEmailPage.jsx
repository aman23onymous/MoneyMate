import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import AuthCard from './AuthCard';
import { register, sendRegisterOTP, clearState } from '../../features/auth/authSlice'; // Adjust path

const VerifyEmailPage = ({ setPage, email }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState('');

  useEffect(() => {
    dispatch(clearState());
  }, [dispatch]);

  const handleVerifyAndRegister = () => {
    // This assumes your register thunk now takes the full user object including OTP.
    // You might need to adjust this based on your `register` thunk implementation.
    // For this example, let's assume we need to pass the full original form data again.
    // A better approach would be to store the partial user data in redux state.
    const userData = { ...JSON.parse(sessionStorage.getItem('partial_user')), otp };
    dispatch(register({ userData, navigate }));
  };

  const handleResendOTP = () => {
      dispatch(sendRegisterOTP(email));
  }

  return (
    <AuthCard title="Verify Your Email" description={`We've sent a verification code to ${email}.`}>
      <div className="space-y-4">
        <Input
          name="otp"
          type="text"
          placeholder="Verification Code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      <Button onClick={handleVerifyAndRegister} disabled={isLoading || !otp} className="w-full mt-6 bg-black text-white hover:bg-gray-800">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit & Register'}
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-4 text-center">
            {error}{' '}
            <span onClick={handleResendOTP} className="text-blue-600 cursor-pointer hover:underline">
                Resend
            </span>
        </p>
      )}
      <p className="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => setPage('register')}>
        Wrong Email?
      </p>
    </AuthCard>
  );
};

export default VerifyEmailPage;
