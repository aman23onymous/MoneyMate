import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyTransfer, clearTransferState } from '../../features/transfer/transferSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const VerifyTransfer = ({ transactionDetails, onVerification }) => {
    const dispatch = useDispatch();
    const { isLoading, error, completedTransaction } = useSelector((state) => state.transfer);
    const [otp, setOtp] = useState('');
    
    useEffect(() => {
        // 2. Check for the existence of the `completedTransaction` object
        if (completedTransaction) {
            // 3. Pass the full details object up to the parent page
            onVerification({ success: true, details: completedTransaction });
        } else if (error) {
            onVerification({ success: false, message: error });
        }
    }, [completedTransaction, error, onVerification]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const verificationData = {
            transactionId: transactionDetails.transactionId,
            otp,
        };
        dispatch(verifyTransfer(verificationData));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Verify Transfer</h2>
            <p className="text-center text-gray-600 mb-6">{transactionDetails.message}</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
                    <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify & Transfer'}
                </Button>
            </form>
        </div>
    );
};

export default VerifyTransfer;