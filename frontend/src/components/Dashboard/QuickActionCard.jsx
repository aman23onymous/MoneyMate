import React from 'react';

const QuickActionCard = ({ title, description, icon: Icon, transactions }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 ${transactions ? 'min-h-[200px] max-h-[260px]' : 'h-full'}`}>

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        {Icon && <Icon className="w-8 h-8 text-blue-600" />}
      </div>
      
      {/* If transactions are passed, display them */}
      {transactions && transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Recent Transfers</h4>
          <ul className="space-y-2 max-h-28 overflow-y-auto pr-1">
            {transactions.map((tx) => (
              <li key={tx._id} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{tx.description || tx.category}</span>
                <span className="font-semibold text-red-600">-₹{tx.amount.toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuickActionCard;