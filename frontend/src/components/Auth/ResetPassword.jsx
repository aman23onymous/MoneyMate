import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import AuthCard from './AuthCard';
import { changePassword, sendForgetPasswordOTP, clearState } from '../../features/auth/authSlice'; // Adjust path

const ResetPasswordPage = ({ setPage, email }) => {
  const dispatch = useDispatch();
  const { isLoading, error, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ otp: '', password: '' });
  const [validationMsg, setValidationMsg] = useState('');

  const formValidated = formData.otp && formData.password && !validationMsg;

  // Effect to clear previous errors when the component loads
  useEffect(() => {
    dispatch(clearState());
  }, [dispatch]);

  // Effect to automatically move to the login page upon success
  useEffect(() => {
    if (message?.includes('Password changed')) {
      setPage('login');
      dispatch(clearState());
    }
  }, [message, setPage, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const passwordBlur = () => {
    if (!formData.password) {
      setValidationMsg('New password is required.');
    } else if (formData.password.length < 5) {
      setValidationMsg('Password must be at least 5 characters.');
    } else {
      setValidationMsg('');
    }
  };

  const handleSubmit = () => {
    if (!formValidated) return;
    const userData = { email, otp: formData.otp, password: formData.password };
    dispatch(changePassword(userData));
  };

  const handleResendOTP = () => {
      dispatch(sendForgetPasswordOTP(email));
  }

  return (
    <AuthCard title="Reset Password" description={`Enter the code sent to ${email} and your new password.`}>
      <div className="space-y-4">
        <Input
          name="otp"
          type="text"
          placeholder="Verification Code"
          value={formData.otp}
          onChange={handleInputChange}
        />
        <div>
          <Input
            name="password"
            type="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={passwordBlur}
          />
          {validationMsg && <p className="text-red-500 text-xs pt-1">{validationMsg}</p>}
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={isLoading || !formValidated} className="w-full mt-6 bg-black text-white hover:bg-gray-800">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Reset Password'}
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-4 text-center">
            {error}{' '}
            <span onClick={handleResendOTP} className="text-blue-600 cursor-pointer hover:underline">
                Resend Code
            </span>
        </p>
      )}
      <p className="mt-6 text-center text-sm">
        <span onClick={() => setPage('login')} className="font-semibold text-blue-600 cursor-pointer hover:underline">
          Back to Log in
        </span>
      </p>
    </AuthCard>
  );
};

export default ResetPasswordPage;
