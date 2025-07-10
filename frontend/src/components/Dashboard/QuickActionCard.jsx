import Card from './Card';

const QuickActionCard = ({ title, description, icon: Icon }) => (
  <Card className="flex flex-col justify-between">
    <div>
      <div className="p-2 bg-gray-100 rounded-full w-10 h-10 mb-4 flex items-center justify-center">
        <Icon className="h-5 w-5 text-gray-700" />
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
    </div>
  </Card>
);

export default QuickActionCard;
