import Card from './Card';
import { MoreVertical } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// Pie chart data
const pieData = [
  { name: 'Groceries', value: 400 },
  { name: 'Bills', value: 300 },
  { name: 'Shopping', value: 300 },
  { name: 'Entertainment', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Line chart data
const lineData = [
  { name: 'Jan', spending: 4000 },
  { name: 'Feb', spending: 3000 },
  { name: 'Mar', spending: 5000 },
  { name: 'Apr', spending: 4500 },
  { name: 'May', spending: 6000 },
  { name: 'Jun', spending: 5500 },
];

const ReportsCard = () => (
  <Card>
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-lg">Reports</h3>
      <button className="p-1 rounded-full hover:bg-gray-100">
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </button>
    </div>

    <p className="text-sm text-gray-500 mb-4">Spending by category</p>

    <div className="h-48 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="spending" stroke="#8884d8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export default ReportsCard;
