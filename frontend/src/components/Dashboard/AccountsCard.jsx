import Card from './Card';

const AccountsCard = () => (
  <Card>
    <h3 className="font-bold text-lg mb-4">Accounts</h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Savings Account</span>
        <span className="font-semibold">₹4,550.00</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Current Account</span>
        <span className="font-semibold">₹6,750.20</span>
      </div>
    </div>
  </Card>
);

export default AccountsCard;
