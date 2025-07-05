import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import validator from 'email-validator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import AuthCard from './AuthCard';
import { sendForgetPasswordOTP, clearState } from '../../features/auth/authSlice'; // Adjust path

const ForgotPasswordPage = ({ setPage, setEmailForVerification }) => {
  const dispatch = useDispatch();
  const { isLoading, error, message } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [validationMsg, setValidationMsg] = useState('');

  const emailValidated = email && !validationMsg;

  // Effect to clear previous errors when the component loads
  useEffect(() => {
    dispatch(clearState());
  }, [dispatch]);

  // Effect to automatically move to the next page upon success
  useEffect(() => {
    if (message?.includes('verifiction code')) {
      setPage('forget_password_otp');
      dispatch(clearState()); // Clear message to prevent re-triggering
    }
  }, [message, setPage, dispatch]);

  const emailBlur = () => {
    if (!email) {
      setValidationMsg('Email is required.');
    } else if (!validator.validate(email)) {
      setValidationMsg('Please enter a valid email address.');
    } else {
      setValidationMsg('');
    }
  };

  const handleSubmit = () => {
    if (!emailValidated) return;
    setEmailForVerification(email); // Pass email to parent for the next step
    dispatch(sendForgetPasswordOTP(email));
  };

  return (
    <AuthCard title="Forgot Password" description="Enter your registered email to receive a verification code.">
      <div className="space-y-4">
        <div>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={emailBlur}
          />
          {validationMsg && <p className="text-red-500 text-xs pt-1">{validationMsg}</p>}
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={isLoading || !emailValidated} className="w-full mt-6 bg-black text-white hover:bg-gray-800">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Code'}
      </Button>
      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      <p className="mt-6 text-center text-sm">
        <span onClick={() => setPage('login')} className="font-semibold text-blue-600 cursor-pointer hover:underline">
          Back to Log in
        </span>
      </p>
    </AuthCard>
  );
};

export default ForgotPasswordPage;
