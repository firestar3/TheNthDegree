import React from 'react';
import AuthForm from '../components/AuthForm';

// Fix: Removed React.FC as it's largely deprecated.
const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center">
      <AuthForm />
    </div>
  );
};

export default LoginPage;