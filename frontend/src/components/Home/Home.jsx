import { useState } from 'react';
import Sidebar from '../layout/Sidebar'
import Header from '../layout/Header';
import Dashboard from '../Dashboard/Dashboard';
import FloatingChatIcon from '../Bot/FloatingChatIcon';
import AccountsPage from '@/pages/AccountsPage';
import { Routes, Route, Navigate } from 'react-router-dom';
import FixedDepositPage from '@/pages/FixedDepositPage';
import OpenFixedDepositPage from '@/pages/OpenFixedDepositPage';
const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Routes>
            {/* When the URL is '/', render the Dashboard */}
            <Route path="/" element={<Dashboard />} />
            
            {/* When the URL is '/accounts', render the AccountsPage */}
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="fixed-deposit" element={<FixedDepositPage />} />
            <Route path="fixed-deposit/new" element={<OpenFixedDepositPage />} />
            {/* You can add routes for other pages here */}
            {/* e.g., <Route path="transfer" element={<TransferPage />} /> */}
          </Routes>
          <FloatingChatIcon/>
        </main>
      </div>
    </div>
  );
};

export default Home;
