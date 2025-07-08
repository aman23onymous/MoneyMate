import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import validator from 'email-validator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import AuthCard from './AuthCard';
import { sendRegisterOTP, clearState } from '../../features/auth/authSlice'; // Adjust path

const RegisterPage = ({ setPage, setEmailForVerification }) => {
  const dispatch = useDispatch();
  const { isLoading, error, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [validationMsg, setValidationMsg] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const registerValidated =
    formData.name && formData.email && formData.password && formData.confirmPassword &&
    !validationMsg.name && !validationMsg.email && !validationMsg.password && !validationMsg.confirmPassword;

  useEffect(() => {
    dispatch(clearState());
  }, [dispatch]);
  
  useEffect(() => {
    console.log("RegisterPage useEffect - Current message:", message);
    if (message?.includes('OTP sent to your email for registration.')) {
        console.log("RegisterPage useEffect - Message matches! Setting page to 'register_otp'.");
        sessionStorage.setItem('partial_user', JSON.stringify({
        fullName: formData.name, // Assuming 'name' maps to 'fullName' in your backend
        email: formData.email,
        password: formData.password,
        phone: "9999999999",
      }));
        setPage('register_otp');
        dispatch(clearState());
    }
    else if(message){
      console.log("RegisterPage useEffect - Message exists but does not match expected string:", message);
    }
  }, [message, setPage, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nameBlur = () => {
    if (!formData.name) setValidationMsg(p => ({ ...p, name: 'Name is required.' }));
    else if (formData.name.length < 3) setValidationMsg(p => ({ ...p, name: 'Name must be at least 3 characters.' }));
    else setValidationMsg(p => ({ ...p, name: '' }));
  };

  const emailBlur = () => {
    if (!formData.email) setValidationMsg(p => ({ ...p, email: 'Email is required.' }));
    else if (!validator.validate(formData.email)) setValidationMsg(p => ({ ...p, email: 'Please enter a valid email.' }));
    else setValidationMsg(p => ({ ...p, email: '' }));
  };

  const passwordBlur = () => {
    if (!formData.password) setValidationMsg(p => ({ ...p, password: 'Password is required.' }));
    else if (formData.password.length < 5) setValidationMsg(p => ({ ...p, password: 'Password must be at least 5 characters.' }));
    else setValidationMsg(p => ({ ...p, password: '' }));
  };

  const confirmPasswordBlur = () => {
    if (!formData.confirmPassword) setValidationMsg(p => ({ ...p, confirmPassword: 'Please confirm your password.' }));
    else if (formData.password !== formData.confirmPassword) setValidationMsg(p => ({ ...p, confirmPassword: 'Passwords do not match.' }));
    else setValidationMsg(p => ({ ...p, confirmPassword: '' }));
  };

  const handleSendOTP = () => {
    if (!registerValidated) return;
    setEmailForVerification(formData.email); // Pass email to parent
    dispatch(sendRegisterOTP(formData.email));
  };

  return (
    <AuthCard title="Create an Account" description="Get started by creating your new account.">
      <div className="space-y-4">
        {/* Name Input */}
        <div>
            <Input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleInputChange} onBlur={nameBlur} />
            {validationMsg.name && <p className="text-red-500 text-xs pt-1">{validationMsg.name}</p>}
        </div>
        {/* Email Input */}
        <div>
            <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} onBlur={emailBlur} />
            {validationMsg.email && <p className="text-red-500 text-xs pt-1">{validationMsg.email}</p>}
        </div>
        {/* Password Input */}
        <div>
            <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} onBlur={passwordBlur} />
            {validationMsg.password && <p className="text-red-500 text-xs pt-1">{validationMsg.password}</p>}
        </div>
        {/* Confirm Password Input */}
        <div>
            <Input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} onBlur={confirmPasswordBlur} />
            {validationMsg.confirmPassword && <p className="text-red-500 text-xs pt-1">{validationMsg.confirmPassword}</p>}
        </div>
      </div>
      <Button onClick={handleSendOTP} disabled={isLoading || !registerValidated} className="w-full mt-6 bg-black text-white hover:bg-gray-800">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Register'}
      </Button>
      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      <p className="mt-6 text-center text-sm">
        Already have an account?{' '}
        <span onClick={() => setPage('login')} className="font-semibold text-blue-600 cursor-pointer hover:underline">
          Log in
        </span>
      </p>
    </AuthCard>
  );
};

export default RegisterPage;
