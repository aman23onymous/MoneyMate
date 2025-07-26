import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createFixedDeposit, clearFdState } from '../features/fixedDeposits/fixedDepositSlice'; // Adjust path
import { getAccounts } from '../features/accounts/accountsSlice'; // To fetch user's accounts
import { ArrowLeft } from 'lucide-react';

// --- Sub-Component for Estimated Returns ---
const EstimatedReturns = ({ principal, tenureMonths }) => {
  const getInterestRate = (months) => {
    if (months >= 36) return 7.25;
    if (months >= 24) return 7.10;
    if (months >= 12) return 6.80;
    if (months >= 6) return 5.50;
    return 4.50;
  };

  const interestRate = getInterestRate(tenureMonths);
  const maturityAmount = principal * (1 + (interestRate / 100) * (tenureMonths / 12));
  const totalInterest = maturityAmount - principal;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
      <h3 className="text-lg font-semibold mb-4">Estimated Returns</h3>
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Interest Rate</p>
          <p className="text-3xl font-bold text-blue-600">{interestRate.toFixed(2)}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Interest</p>
          <p className="text-2xl font-semibold text-gray-900">
            ₹{totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600">Maturity Amount</p>
          <p className="text-3xl font-bold text-gray-900">
            ₹{maturityAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main OpenFixedDepositPage Component ---
const OpenFixedDepositPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get state from Redux
  const { accounts } = useSelector((state) => state.accounts);
  const { isLoading, error } = useSelector((state) => state.fixedDeposits);
  const { user } = useSelector((state) => state.auth);

  // Form state
  const [selectedAccount, setSelectedAccount] = useState('');
  const [principal, setPrincipal] = useState(30000);
  const [tenure, setTenure] = useState(12); // in months
  const [agreed, setAgreed] = useState(false);

  // Fetch user's accounts when component mounts
  useEffect(() => {
    if (user) {
      dispatch(getAccounts());
    }
    // Clear any previous errors when the component loads
    dispatch(clearFdState());
  }, [user, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please agree to the terms and conditions.');
      return;
    }
    const fdData = {
      accountId: selectedAccount,
      principal: parseFloat(principal),
      tenureMonths: parseInt(tenure, 10),
    };

    dispatch(createFixedDeposit(fdData))
      .unwrap()
      .then(() => {
        navigate('/fixed-deposit'); // Navigate back to the FD list on success
      })
      .catch((err) => {
        // Error is handled by the slice and displayed on the UI
        console.error("Failed to create FD:", err);
      });
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Fixed Deposits
      </button>
      <h1 className="text-3xl font-bold text-gray-900">Open Fixed Deposit</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6">
          <div>
            <label htmlFor="account" className="block text-sm font-medium text-gray-700">Select Account</label>
            <select
              id="account"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Select an account to debit from</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountType} Account - ₹{acc.balance.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="principal" className="block text-sm font-medium text-gray-700">Deposit Amount</label>
            <input
              type="number"
              id="principal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tenure</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[3, 6, 12, 24].map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => setTenure(months)}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    tenure === months
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {months} months
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I have read and agree to the terms and conditions.
                </label>
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? 'Processing...' : 'Create FD'}
          </button>
        </div>

        {/* Estimated Returns Section */}
        <div className="lg:col-span-1">
          <EstimatedReturns principal={parseFloat(principal) || 0} tenureMonths={tenure} />
        </div>
      </form>
    </div>
  );
};

export default OpenFixedDepositPage;
