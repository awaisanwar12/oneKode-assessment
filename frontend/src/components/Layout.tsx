import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiUser,
  FiGrid,
  FiLayers
} from 'react-icons/fi';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem = ({ icon, label, onClick, isActive }: { icon: React.ReactNode, label: string, onClick: () => void, isActive?: boolean }) => (
  <button
    onClick={onClick}
    className={clsx(
        "flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg group",
        isActive 
            ? "bg-indigo-50 text-indigo-700" 
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    )}
  >
    <span className={clsx("mr-3", isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500")}>
        {icon}
    </span>
    {label}
  </button>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize to manage sidebar state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          TaskFlow
        </span>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Discovered
            </p>
            <SidebarItem 
                icon={<FiHome size={20} />} 
                label="Dashboard" 
                onClick={() => navigate('/')} 
                isActive={location.pathname === '/'} 
            />
            <SidebarItem 
                icon={<FiGrid size={20} />} 
                label="My Tasks" 
                onClick={() => navigate('/tasks')} 
                isActive={location.pathname === '/tasks'} 
            />
             <SidebarItem 
                icon={<FiLayers size={20} />} 
                label="My Teams" 
                onClick={() => navigate('/teams')} 
                isActive={location.pathname === '/teams'} 
            />
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
                <FiUser size={20} />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                    {user?.role || 'Guest'}
                </p>
             </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <FiLogOut className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
            className="fixed inset-0 z-40 bg-gray-800/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 flex items-center justify-between px-4 h-16">
           <button 
             onClick={() => setSidebarOpen(true)}
             className="text-gray-500 hover:text-gray-700 p-2 -ml-2 rounded-md hover:bg-gray-100"
            >
             <FiMenu size={24} />
           </button>
           <span className="font-bold text-gray-800">TaskFlow</span>
           <div className="w-8" /> {/* Spacer for centering */}
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
