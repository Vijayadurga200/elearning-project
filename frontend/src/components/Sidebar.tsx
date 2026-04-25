import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  Cog6ToothIcon,
  EyeIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userType: 'visual' | 'hearing' | 'none';
  setUserType: (type: 'visual' | 'hearing' | 'none') => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  userType,
  setUserType
}) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: HomeIcon },
    { path: '/courses', label: 'Courses', icon: BookOpenIcon },
    { path: '/profile', label: 'Profile', icon: UserIcon },
    { path: '/accessibility', label: 'Accessibility', icon: Cog6ToothIcon },
  ];

  return (
    <aside className="h-screen w-64 bg-white text-black shadow-xl flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">EduAccess</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg ${
                isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Icon className="w-6 h-6 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Accessibility Buttons */}
      <div className="p-4 border-t space-y-2">

        <button
          onClick={() => setUserType('visual')}
          className="w-full flex items-center p-3 bg-green-500 text-white rounded-lg"
        >
          <EyeIcon className="w-6 h-6 mr-3" />
          Visual Mode
        </button>

        <button
          onClick={() => setUserType('hearing')}
          className="w-full flex items-center p-3 bg-orange-500 text-white rounded-lg"
        >
          <SpeakerXMarkIcon className="w-6 h-6 mr-3" />
          Hearing Mode
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;