import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFixedDeposits } from '../features/fixedDeposits/fixedDepositSlice'; // Adjust path as needed
import { Plus } from 'lucide-react';

// --- Sub-Component for the FD Calculator ---
const FdCalculator = () => {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(7.00);
  const [period, setPeriod] = useState(24); // in months
  const [maturityAmount, setMaturityAmount] = useState(0);

  useEffect(() => {
    // Simple Interest Calculation: A = P(1 + rt)
    const principalNum = parseFloat(principal) || 0;
    const rateNum = parseFloat(rate) || 0;
    const periodYears = (parseFloat(period) || 0) / 12;
    
    const maturity = principalNum * (1 + (rateNum / 100) * periodYears);
    setMaturityAmount(maturity);
  }, [principal, rate, period]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Fixed Deposit Calculator</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="principal" className="block text-sm font-medium text-gray-700">Principal</label>
          <input
            type="number"
            id="principal"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
          <input
            type="number"
            id="interestRate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700">Period (months)</label>
          <input
            type="number"
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">Maturity Amount</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{maturityAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};


// --- Main FixedDepositPage Component ---
const FixedDepositPage = () => {
  const dispatch = useDispatch();
  const { fixedDeposits, isLoading, error } = useSelector((state) => state.fixedDeposits);
  const { user } = useSelector((state) => state.auth);

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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Active Fixed Deposits</h1>
        <Link
          to="/fixed-deposit/new" // This will navigate to the "Open New FD" page
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Open New FD
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FD List Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          {isLoading && <p>Loading your fixed deposits...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !error && (
            fixedDeposits.length > 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Tenure</th>
                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Start Date</th>
                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Maturity Date</th>
                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Interest Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {fixedDeposits.map((fd) => (
                    <tr key={fd._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{fd.tenureMonths / 12} year(s)</td>
                      <td className="py-3 px-4">{formatDate(fd.startDate)}</td>
                      <td className="py-3 px-4">{formatDate(fd.maturityDate)}</td>
                      <td className="py-3 px-4">{fd.interestRate.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500 py-8">You have no active fixed deposits.</p>
            )
          )}
        </div>

        {/* Calculator Section */}
        <div className="lg:col-span-1">
          <FdCalculator />
        </div>
      </div>
    </div>
  );
};

export default FixedDepositPage;
