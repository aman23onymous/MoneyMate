import { Bell, Search, UserCircle, Menu } from 'lucide-react';

const Header = ({ setIsSidebarOpen }) => {
  return (
    <header className="flex items-center justify-between h-16 bg-white border-b px-4 sm:px-6">
      {/* Sidebar toggle for mobile */}
      <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden">
        <Menu className="h-6 w-6" />
      </button>

      {/* Optional branding or center spacer */}
      <div className="hidden lg:block" />

      {/* Right-side icons */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Search className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <UserCircle className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
