import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFixedDeposits } from '../../features/fixedDeposits/fixedDepositSlice'; // Adjust path as needed
import Card from './Card'; // Assuming your Card component is in the same folder

const FixedDepositCard = () => {
  const dispatch = useDispatch();
  
  // Get the necessary state from the Redux store
  const { fixedDeposits, isLoading, error } = useSelector((state) => state.fixedDeposits);
  const { user } = useSelector((state) => state.auth);

  // Fetch fixed deposits when the component mounts or when the user logs in
  useEffect(() => {
    if (user) {
      dispatch(getFixedDeposits());
    }
  }, [user, dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Helper function to render the content based on the state
  const renderContent = () => {
    // Show a compact loading state
    if (isLoading) {
      return <p className="text-gray-500">Loading fixed deposits...</p>;
    }

    // Show an error message if something went wrong
    if (error) {
      return <p className="text-red-500">Could not load fixed deposits.</p>;
    }

    // If there are no fixed deposits, show a message and a link to open one
    if (fixedDeposits.length === 0) {
      return (
        <div className="text-center text-gray-500">
          <p>No fixed deposits found.</p>
          <Link to="/fixed-deposit" className="text-blue-600 hover:underline">
            Open a Fixed Deposit
          </Link>
        </div>
      );
    }

    // If fixed deposits exist, display the latest two
    return (
      <div className="space-y-3">
        {/* Use .slice(0, 2) to get only the first two items from the array */}
        {fixedDeposits.slice(0, 2).map((fd) => (
          <div key={fd._id} className="flex justify-between items-center">
            <div>
                <span className="font-semibold">
                ₹{fd.principal.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-500 ml-2">({fd.tenureMonths} months)</span>
            </div>
            <div className="text-right">
                <span className="text-gray-600">Matures on</span>
                <p className="font-semibold text-sm">{formatDate(fd.maturityDate)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Fixed Deposits</h3>
        <Link to="/fixed-deposit" className="text-sm text-blue-600 hover:underline">
            View All
        </Link>
      </div>
      {renderContent()}
    </Card>
  );
};

export default FixedDepositCard;
