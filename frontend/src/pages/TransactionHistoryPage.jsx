import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactions } from '../features/transactions/transactionSlice';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const TransactionHistoryPage = () => {
    const dispatch = useDispatch();
    const { transactions, isLoading, error } = useSelector((state) => state.transactions);
    const { user } = useSelector((state) => state.auth);
    const { accounts } = useSelector((state) => state.accounts);

    useEffect(() => {
        if (user) {
            dispatch(getTransactions());
        }
    }, [user, dispatch]);

    const userAccountNumbers = accounts.map(acc => acc.accountNumber);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return <p>Loading transaction history...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                {transactions.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {transactions.map((tx) => (
                            <li key={tx._id} className="py-4 flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    {userAccountNumbers.includes(tx.toAccount.accountNumber) ? (
                                        <div className="bg-green-100 p-2 rounded-full">
                                            <ArrowDownLeft className="h-5 w-5 text-green-600" />
                                        </div>
                                    ) : (
                                        <div className="bg-red-100 p-2 rounded-full">
                                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {userAccountNumbers.includes(tx.toAccount.accountNumber)
                                                ? `From: ${tx.fromAccount.accountNumber}`
                                                : `To: ${tx.toAccount.accountNumber}`}
                                        </p>
                                        <p className="text-sm text-gray-500">{tx.description || tx.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${userAccountNumbers.includes(tx.toAccount.accountNumber) ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {userAccountNumbers.includes(tx.toAccount.accountNumber) ? '+' : '-'}
                                        ₹{tx.amount.toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-sm text-gray-500">{formatDate(tx.timestamp)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-8">You have no transaction history.</p>
                )}
            </div>
        </div>
    );
};

export default TransactionHistoryPage;