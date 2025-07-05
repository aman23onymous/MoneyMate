import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import AuthPage from './pages/authPage'
import Raztemp from './components/ui/raztemp'
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
    </Routes>
  )
}

export default App