import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import AuthPage from './pages/authPage'
import HomePage from './components/Home/Home';
import Raztemp from './components/ui/raztemp'
import { useSelector } from 'react-redux';
const App = () => {
  const {user}=useSelector((state)=> state.auth);
  const isAuthenticated=!!user;
  return (
    <Routes>
      <Route path="/auth" element={!isAuthenticated?<AuthPage/>:<Navigate to="/"/>} />
      
      <Route  path="/*" element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" />}/>
       
        
    
    </Routes>
  )
}

export default App