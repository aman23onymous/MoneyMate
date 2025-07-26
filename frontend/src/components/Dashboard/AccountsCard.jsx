import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'; // To link to the full accounts page
import { getAccounts } from '../../features/accounts/accountsSlice'; // Adjust path as needed
import Card from './Card'; // Assuming your Card component is in the same folder

const AccountsCard = () => {
  const dispatch = useDispatch();
  
  // Get the necessary state from the Redux store
  const { accounts, isLoading, error } = useSelector((state) => state.accounts);
  const { user } = useSelector((state) => state.auth);

  // Fetch accounts when the component mounts or when the user logs in
  useEffect(() => {
    if (user) {
      dispatch(getAccounts());
    }
  }, [user, dispatch]);

  // Helper function to render the content based on the state
  const renderContent = () => {
    // Show a compact loading state
    if (isLoading) {
      return <p className="text-gray-500">Loading accounts...</p>;
    }

    // Show an error message if something went wrong
    if (error) {
      return <p className="text-red-500">Could not load accounts.</p>;
    }

    // If there are no accounts, show a message and a link to open one
    if (accounts.length === 0) {
      return (
        <div className="text-center text-gray-500">
          <p>No accounts found.</p>
          <Link to="/accounts" className="text-blue-600 hover:underline">
            Open an account
          </Link>
        </div>
      );
    }

    // If accounts exist, display them
    return (
      <div className="space-y-3">
        {accounts.map((account) => (
          <div key={account._id} className="flex justify-between items-center">
            <span className="text-gray-600 capitalize">{account.accountType} Account</span>
            <span className="font-semibold">
              ₹{account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Accounts</h3>
        <Link to="/accounts" className="text-sm text-blue-600 hover:underline">
            View All
        </Link>
      </div>
      {renderContent()}
    </Card>
  );
};

export default AccountsCard;
