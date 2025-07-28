import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Wallet,
  ArrowRightLeft,
  Receipt,
  History,
  Landmark,
  ShieldCheck,
  FileText,
  X,
} from 'lucide-react';
import logo from '../../assets/Logo.png'; 

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Wallet, label: 'Accounts', path: '/accounts' },
    { icon: ArrowRightLeft, label: 'Transfer', path: '/transfer' },
    { icon: Receipt, label: 'Bill Payments', path: '/bill-payments' },
    { icon: History, label: 'Transactions', path: '/transactions' },
    { icon: Landmark, label: 'Fixed Deposit', path: '/fixed-deposit' },
    { icon: ShieldCheck, label: 'Loans', path: '/loans' },
    { icon: FileText, label: 'Report', path: '/report' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-60 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 h-32 border-b lg:justify-center">
          <img src={logo} alt="MoneyMate Logo" className="h-28 w-auto" />
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gray-100 font-semibold text-gray-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
