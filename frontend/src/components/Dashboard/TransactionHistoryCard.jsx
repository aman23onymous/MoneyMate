import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions } from '../../features/transactions/transactionSlice';
import { Banknote, Landmark, Smartphone, PiggyBank } from 'lucide-react';

const TransactionHistoryCard = () => {
    const dispatch = useDispatch();
    const { transactions, isLoading } = useSelector((state) => state.transactions);

    useEffect(() => {
        dispatch(getTransactions());
    }, [dispatch]);

    const getTransactionIcon = (category) => {
        switch (category) {
            case 'UPI':
                return <Smartphone className="w-6 h-6 text-purple-600" />;
            case 'IMPS':
            case 'NEFT':
            case 'RTGS':
                return <Landmark className="w-6 h-6 text-green-600" />;
            case 'auto debit':
                return <PiggyBank className="w-6 h-6 text-pink-600" />;
            default:
                return <Banknote className="w-6 h-6 text-gray-500" />;
        }
    };

    const recentTransactions = transactions.slice(0, 4);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h3>
            <div className="flex-grow space-y-4">
                {isLoading ? (
                    <p className="text-gray-500">Loading transactions...</p>
                ) : recentTransactions.length > 0 ? (
                    recentTransactions.map((tx) => (
                        <div key={tx._id} className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-full">
                                {getTransactionIcon(tx.category)}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{tx.description || 'Transfer'}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                </p>
                                <p className="text-xs text-gray-400">{tx.category}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No recent transactions found.</p>
                )}
            </div>
        </div>
    );
};

export default TransactionHistoryCard;