import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Hospital,
  ClipboardList,
  Droplet,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  Heart
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ user, isCollapsed, setIsCollapsed }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getLinks = (role) => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: 'dashboard' },
          { name: 'Manage Donors', icon: <Users size={20} />, path: 'donors' },
          { name: 'Manage Hospitals', icon: <Hospital size={20} />, path: 'hospitals' },
          { name: 'System Requests', icon: <ClipboardList size={20} />, path: 'requests' },
        ];
      case 'donor':
        return [
          { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: 'dashboard' },
          { name: 'Find Requests', icon: <Droplet size={20} />, path: 'requests' },
          { name: 'My Activities', icon: <Activity size={20} />, path: 'activities' },
        ];
      case 'hospital':
        return [
          { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: 'dashboard' },
          { name: 'Manage Patients', icon: <Users size={20} />, path: 'patients' },
          { name: 'Active Requests', icon: <ClipboardList size={20} />, path: 'requests' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks(user?.role);

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen bg-bg-card backdrop-blur-2xl border-r border-glass-border transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}
    >
      <div className="flex h-full flex-col p-4">
        {/* Logo Section */}
        <Link to="/" className="mb-10 flex items-center gap-2 px-2 text-xl font-bold">
          <Droplet className="text-primary fill-primary" size={24} />
          {!isCollapsed && (
            <span>BloodSync</span>
          )}
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => window.dispatchEvent(new CustomEvent('change-view', { detail: link.path }))}
              className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-200 hover:bg-white/5 group`}
            >
              <div className="text-primary group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              {!isCollapsed && (
                <span className="font-medium text-text-main/80 group-hover:text-white">
                  {link.name}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="mt-auto border-t border-glass-border pt-6 pb-2">
          {!isCollapsed && (
            <div className="mb-6 flex items-center gap-3 px-2">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/20">
                {user?.name?.[0]}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-bold text-white">{user?.name}</p>
                <p className="truncate text-xs text-text-muted capitalize">{user?.role}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-danger transition-all hover:bg-danger/10 group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            {!isCollapsed && <span className="font-semibold">Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
