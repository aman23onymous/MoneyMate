import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // 1. Import useDispatch
import { clearTransferState } from '../features/transfer/transferSlice';
import InitiateTransfer from '../components/Transfer/InitiateTransfer';
import VerifyTransfer from '../components/Transfer/VerifyTransfer';
import TransferStatus from '../components/Transfer/TransferStatus';

const FundTransferPage = () => {
  const [step, setStep] = useState('initiate');
  const dispatch = useDispatch(); 
  // This state will now hold the full object: { success, details }
  const [transactionResult, setTransactionResult] = useState(null);

  useEffect(() => {
    // Clear state when the page loads to prevent showing stale data.
    dispatch(clearTransferState());

    // Return a cleanup function to clear state when the user navigates away.
    return () => {
      dispatch(clearTransferState());
    };
  }, [dispatch]);

  const handleInitiate = (details) => {
    setTransactionResult(details);
    setStep('verify');
  };

  const handleVerification = (result) => {
    // `result` is the object from `onVerification` ({ success, details })
    setTransactionResult(result);
    setStep('status');
  };

  const handleReset = () => {
    setTransactionResult(null); 
    dispatch(clearTransferState()); 
    setStep('initiate');
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Fund Transfer</h1>
      {step === 'initiate' && <InitiateTransfer onInitiate={handleInitiate} />}
      {step === 'verify' && <VerifyTransfer transactionDetails={transactionResult} onVerification={handleVerification} />}
      {/* Pass the entire result object to the status page */}
      {step === 'status' && <TransferStatus transactionDetails={transactionResult} onReset={handleReset}/>}
    </div>
  );
};

export default FundTransferPage;