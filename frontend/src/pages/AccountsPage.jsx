import React, { useState, useEffect } from 'react';
// 1. Import hooks from react-redux to interact with the store
import { useSelector, useDispatch } from 'react-redux';

// 2. Import the async thunks and actions from your accounts slice
import { getAccounts, createAccount, clearAccountState } from '../features/accounts/accountsSlice'; 
// 3. Import the logout action from your auth slice
import { logout } from '../features/auth/authSlice'; // Ensure this path is correct

// 4. Import icons from react-icons
import { FaCreditCard, FaTimes, FaPlusCircle, FaUniversity } from 'react-icons/fa';

// --- UI Sub-Components (These have no logic changes) ---

const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex flex-col justify-center items-center p-10 bg-gray-50/50 rounded-lg">
    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
    <p className="mt-4 text-lg text-gray-700">{text}</p>
  </div>
);

const AccountCard = ({ account, onCardClick, onAtmCardClick }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col justify-between">
    <div onClick={() => onCardClick(account)} className="cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4"><FaUniversity className="text-blue-600" /></div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 capitalize">{account.accountType} Account</h3>
            <p className="text-sm font-mono text-gray-500">{account.accountNumber}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {account.status.toUpperCase()}
        </span>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">Available Balance</p>
        <p className="text-4xl font-extrabold text-gray-900">
          ₹{account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
      <button onClick={() => onAtmCardClick(account)} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
        <FaCreditCard className="mr-2" />
        View ATM Card
      </button>
    </div>
  </div>
);

const AccountDetailsModal = ({ account, onClose }) => {
  if (!account) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">{account.accountType} Account Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><FaTimes /></button>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b"><span className="font-medium text-gray-600">Status:</span><span className="font-bold text-green-600 capitalize">{account.status}</span></div>
          <div className="flex justify-between py-2 border-b"><span className="font-medium text-gray-600">Account Number:</span><span className="font-mono text-gray-800">{account.accountNumber}</span></div>
          <div className="flex justify-between py-2 border-b"><span className="font-medium text-gray-600">Current Balance:</span><span className="font-bold text-2xl text-gray-900">₹{account.balance.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between py-2"><span className="font-medium text-gray-600">Account Opened:</span><span className="text-gray-800">{new Date(account.createdAt).toLocaleDateString("en-GB")}</span></div>
        </div>
        <button onClick={onClose} className="mt-8 w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">Close</button>
      </div>
    </div>
  );
};

const CreateAccountModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.accounts);
  const [accountType, setAccountType] = useState('savings');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createAccount({ accountType }))
      .unwrap()
      .then(() => {
        onClose(); // Close modal only on success
      })
      .catch(() => {
        // Error is handled in the slice, no need for extra logic here
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all animate-fade-in-up">
        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-900">Open a New Account</h2><button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700"><FaTimes /></button></div>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          <div className="flex space-x-4">{['savings', 'current'].map(type => (<label key={type} className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-all ${accountType === type ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}><input type="radio" name="accountType" value={type} checked={accountType === type} onChange={() => setAccountType(type)} className="sr-only" /><span className="font-bold text-lg capitalize text-gray-800">{type}</span><p className="text-sm text-gray-500">{type === 'savings' ? 'For personal savings' : 'For daily transactions'}</p></label>))}</div>
        </div>
        <button type="submit" disabled={isLoading} className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex justify-center items-center">{isLoading ? 'Creating...' : 'Create Account'}</button>
      </form>
    </div>
  );
};

// FIX: The component now accepts a `userName` prop
const AtmCardModal = ({ account, onClose, userName }) => {
  if (!account) return null;
  const cardNumber = `${account.accountNumber.slice(0, 4)} **** **** ${account.accountNumber.slice(-4)}`;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-sm transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-56 w-full bg-gradient-to-br from-blue-800 to-indigo-900 rounded-2xl shadow-2xl text-white p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center"><h3 className="font-bold text-xl">MoneyMate</h3><div className="w-14 h-8 bg-gradient-to-tr from-yellow-300 to-yellow-500 rounded-md"></div></div>
          <div className="text-center"><p className="font-mono tracking-widest text-xl">{cardNumber}</p></div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-70">Card Holder</p>
              {/* FIX: Display the userName prop, with a fallback */}
              <p className="font-medium uppercase">{userName || 'CARD HOLDER'}</p>
            </div>
            <div><p className="text-xs opacity-70">Expires</p><p className="font-medium">12/28</p></div>
          </div>
        </div>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 text-white opacity-70 hover:opacity-100"><FaTimes size={24} /></button>
    </div>
  );
};


// --- Main AccountsPage Component ---
function AccountsPage() {
  // Initialize the dispatch function to send actions to the store
  const dispatch = useDispatch();
  
  // Read state from the Redux store instead of local useState
  const { user } = useSelector((state) => state.auth);
  const { accounts, isLoading, error } = useSelector((state) => state.accounts);

  // Local state for UI concerns
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  
  // This effect runs when the component loads or when the user logs in
  useEffect(() => {
    // If a user is logged in, dispatch the action to get their accounts
    if (user) {
      dispatch(getAccounts());
    }
  }, [user, dispatch]);
  
  // This effect watches for an invalid token error.
  useEffect(() => {
    if (error === 'Invalid or expired token' || error === 'Authorization token missing or invalid') {
      dispatch(logout());
    }
  }, [error, dispatch]);

  // Handlers for opening modals
  const handleCardClick = (account) => { 
    setSelectedAccount(account);
    setActiveModal('details');
  };
  const handleAtmCardClick = (account) => { 
    setSelectedAccount(account);
    setActiveModal('atm');
  };
  const handleOpenCreateModal = () => {
      dispatch(clearAccountState()); 
      setCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAccount(null);
    setActiveModal(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div><h1 className="text-4xl font-extrabold text-gray-900">Your Accounts</h1><p className="text-lg text-gray-600 mt-1">Welcome back! Here's an overview of your finances.</p></div>
          <button onClick={handleOpenCreateModal} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"><FaPlusCircle className="mr-2" />Open New Account</button>
        </header>
        
        <main>
          {isLoading && accounts.length === 0 && <LoadingSpinner />}
          {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}
          {!isLoading && !error && accounts.length === 0 && (
            <div className="text-center bg-white p-12 rounded-xl shadow-md mt-8"><h3 className="text-2xl font-semibold text-gray-900">No Accounts Yet!</h3><p className="mt-2 text-md text-gray-500">Click the button above to open your first account with us.</p></div>
          )}
          {accounts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {accounts.map((account) => (
                <AccountCard key={account._id} account={account} onCardClick={handleCardClick} onAtmCardClick={handleAtmCardClick} />
              ))}
            </div>
          )}
        </main>
      </div>

      {activeModal === 'details' && (
        <AccountDetailsModal 
          account={selectedAccount} 
          onClose={handleCloseModal} 
        />
      )}
      <CreateAccountModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)}
      />
      {activeModal === 'atm' && (
        <AtmCardModal 
          account={selectedAccount} 
          onClose={handleCloseModal}
          // FIX: Pass the user's name to the modal. Optional chaining (?.) is used for safety.
          userName={user?.user?.fullName}
        />
      )}
    </div>
  );
}

export default AccountsPage;
