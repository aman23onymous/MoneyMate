import { useState } from 'react';
import LoginPage from '../components/auth/LoginPage';
import RegisterPage from '../components/auth/RegisterPage';
import VerifyEmailPage from '../components/auth/VerifyEmailPage';
import VerifyLoginPage from '../components/auth/VerifyLoginPage';
//import ForgotPasswordPage from '../components/auth/ForgotPasswordPage';
//import ResetPasswordPage from '../components/auth/ResetPasswordPage';

const AuthPage = () => {
  // This state determines which auth component to show.
  const [page, setPage] = useState('login');
  // This state is lifted up to pass the email between components.
  const [emailForVerification, setEmailForVerification] = useState('');

  const renderContent = () => {
    switch (page) {
      case 'login':
        return <LoginPage setPage={setPage} />;
      case 'login_otp':
        return <VerifyLoginPage setPage={setPage} email={emailForVerification} />;
      case 'register':
        return <RegisterPage setPage={setPage} setEmailForVerification={setEmailForVerification} />;
      case 'register_otp':
        return <VerifyEmailPage setPage={setPage} email={emailForVerification} />;
      //case 'forget_password_email':
        return <ForgotPasswordPage setPage={setPage} setEmailForVerification={setEmailForVerification} />;
      //case 'forget_password_otp':
        return <ResetPasswordPage setPage={setPage} email={emailForVerification} />;
      default:
        return <LoginPage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Left Side: Logo */}
      <div className="hidden lg:flex w-1/3 bg-white p-8 border-r items-start">
        <h1 className="text-2xl font-bold">LOGO</h1>
      </div>

      {/* Right Side: Dynamic Form */}
      <div className="flex flex-1 justify-center items-center p-4">
        {renderContent()}
      </div>
    </div>
  );
};
export default AuthPage;
