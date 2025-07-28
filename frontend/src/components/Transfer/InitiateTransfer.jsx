import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccounts } from '../../features/accounts/accountsSlice';
import { initiateTransfer, clearTransferState } from '../../features/transfer/transferSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const InitiateTransfer = ({ onInitiate }) => {
  const dispatch = useDispatch();
  const { accounts } = useSelector((state) => state.accounts);
  const { isLoading, error, message, transactionId } = useSelector((state) => state.transfer);

  const [fromAccount, setFromAccount] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('IMPS');


  useEffect(() => {
    dispatch(getAccounts());
    dispatch(clearTransferState());
  }, [dispatch]);
  
  useEffect(() => {
    if (transactionId) {
        onInitiate({ transactionId, message });
    }
  }, [transactionId, message, onInitiate])

  const handleSubmit = (e) => {
    e.preventDefault();
    const transferData = {
      fromAccount,
      toAccountNumber,
      amount: parseFloat(amount),
      description,
      category,
    };
    dispatch(initiateTransfer(transferData));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Initiate Transfer</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700">From Account</label>
          <select
            id="fromAccount"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select an account</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.accountType} Account - ₹{acc.balance.toLocaleString('en-IN')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="toAccountNumber" className="block text-sm font-medium text-gray-700">Beneficiary Account Number</label>
          <Input
            id="toAccountNumber"
            type="text"
            value={toAccountNumber}
            onChange={(e) => setToAccountNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Transfer Mode</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="IMPS">IMPS</option>
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <Input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
        </Button>
      </form>
    </div>
  );
};

export default InitiateTransfer;