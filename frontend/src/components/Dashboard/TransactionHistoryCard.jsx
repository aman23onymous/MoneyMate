import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactions } from '@/features/transactions/transactionSlice';
import { Link } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Card from './Card';

const TransactionHistoryCard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { accounts } = useSelector((state) => state.accounts);
    const { transactions, isLoading } = useSelector((state) => state.transactions);

    useEffect(() => {
        // Fetch transactions when the component loads if a user is logged in
        if (user) {
            dispatch(getTransactions());
        }
    }, [user, dispatch]);

    // Memoize the user's account numbers to avoid recalculating on every render
    const userAccountNumbers = React.useMemo(() => accounts.map(acc => acc.accountNumber), [accounts]);

    const recentTransactions = transactions.slice(0, 5);

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Transaction History</h3>
                <Link to="/transactions" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    View All
                </Link>
            </div>
            <div className="space-y-4">
                {isLoading ? (
                    <p className="text-gray-500">Loading transactions...</p>
                ) : recentTransactions.length > 0 ? (
                    recentTransactions.map((tx) => {
                        const isCredit = userAccountNumbers.includes(tx.toAccount.accountNumber);
                        return (
                            <div key={tx._id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${isCredit ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {isCredit ? (
                                            <ArrowDownLeft className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">
                                            {isCredit ? `From: ${tx.fromAccount.accountNumber}` : `To: ${tx.toAccount.accountNumber}`}
                                        </p>
                                        <p className="text-xs text-gray-500">{tx.description || 'Transfer'}</p>
                                    </div>
                                </div>
                                <p className={`font-bold text-sm ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                                    {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 pt-4">No recent transactions found.</p>
                )}
            </div>
        </Card>
    );
};

export default TransactionHistoryCard;