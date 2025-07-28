import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

const TransferStatus = ({ transactionDetails, onReset }) => {
  // Destructure the transaction data from the props
  const { success, details, message } = transactionDetails;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <div className="text-center">
        {success ? (
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        ) : (
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
        )}
        <h2 className={`text-3xl font-bold mt-4 ${success ? 'text-green-700' : 'text-red-700'}`}>
          {success ? 'Transfer Successful' : 'Transfer Failed'}
        </h2>
        <p className="text-gray-600 mt-2">
          {success ? 'Your transaction has been completed.' : message}
        </p>
      </div>

      {/* Conditionally render the details table only on success */}
      {success && details && (
        <div className="mt-8 border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 text-left">Transaction Details</h3>
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-mono text-gray-800">{details._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date & Time</span>
            <span className="font-medium text-gray-800">
              {new Date(details.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Amount</span>
            <span className="font-bold text-xl text-gray-900">
              ₹{details.amount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Transfer Mode</span>
            <span className="font-medium text-gray-800">{details.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-green-600 capitalize">{details.status}</span>
          </div>
        </div>
      )}

      <div className="text-center mt-8">
        <Button onClick={onReset}>
          Make Another Transfer
        </Button>
      </div>
    </div>
  );
};

export default TransferStatus;