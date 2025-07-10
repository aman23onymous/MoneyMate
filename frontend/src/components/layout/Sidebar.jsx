import {
  Home,
  Wallet,
  ArrowRightLeft,
  Receipt,
  History,
  Landmark,
  ShieldCheck,
  FileText,
  X,
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navItems = [
    { icon: Home, label: 'Home' },
    { icon: Wallet, label: 'Accounts' },
    { icon: ArrowRightLeft, label: 'Transfer' },
    { icon: Receipt, label: 'Bill Payments' },
    { icon: History, label: 'Transactions' },
    { icon: Landmark, label: 'Fixed Deposit' },
    { icon: ShieldCheck, label: 'Loans' },
    { icon: FileText, label: 'Report' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-60 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top logo & close button */}
        <div className="flex items-center justify-between p-4 h-16 border-b">
          <h1 className="text-2xl font-bold">LOGO</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    item.label === 'Home'
                      ? 'bg-gray-100 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

