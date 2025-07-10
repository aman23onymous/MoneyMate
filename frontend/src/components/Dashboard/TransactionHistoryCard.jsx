import Card from './Card';
import { ChevronRight } from 'lucide-react';

const TransactionHistoryCard = () => (
  <Card>
    <h3 className="font-bold text-lg mb-4">Transaction History</h3>
    <div className="space-y-3">
      <a href="#" className="flex justify-between items-center group">
        <span className="text-gray-600">• Today</span>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black" />
      </a>
      <a href="#" className="flex justify-between items-center group">
        <span className="text-gray-600">• Last week</span>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black" />
      </a>
    </div>
  </Card>
);

export default TransactionHistoryCard;
