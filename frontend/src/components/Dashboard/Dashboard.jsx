import AccountsCard from './AccountsCard';
import TransactionHistoryCard from './TransactionHistoryCard';
import QuickActionCard from './QuickActionCard';
import ReportsCard from './ReportsCard';
import FixedDepositCard from './FixedDepositCard';
import { ArrowRightLeft, Receipt, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { transactions } = useSelector((state) => state.transactions);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const recentFundTransfers = transactions
        .filter(tx => ['IMPS', 'NEFT', 'RTGS', 'UPI'].includes(tx.category) && tx.type !== 'deposit')
        .slice(0, 2);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">{greeting()}, {user?.user?.fullName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Column 1 */}
                <div className="lg:col-span-1 xl:col-span-1 space-y-6">
                    <AccountsCard />
                    <Link to="/transactions" className="no-underline text-current">
                        <TransactionHistoryCard />
                    </Link>
                </div>

                {/* Column 2 */}
                <div className="lg:col-span-1 xl:col-span-1 space-y-6">
                    <Link to="/transfer">
                        <QuickActionCard
                            title="Fund Transfer"
                            description="IMPS, NEFT, RTGS, UPI"
                            icon={ArrowRightLeft}
                            transactions={recentFundTransfers}
                        />
                    </Link>
                    <FixedDepositCard />
                </div>

                {/* Column 3 */}
                <div className="lg:col-span-2 md:col-span-2 xl:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <QuickActionCard
                            title="Bill Payments"
                            description="Electricity, phone, internet"
                            icon={Receipt}
                        />
                        <QuickActionCard
                            title="Loans"
                            description="View or apply for loans"
                            icon={ShieldCheck}
                        />
                    </div>
                    <ReportsCard />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;