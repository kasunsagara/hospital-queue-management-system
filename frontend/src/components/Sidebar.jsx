import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaHospital, FaClipboardList, FaTint, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdDashboard, MdTimeline } from 'react-icons/md';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Sidebar = ({ user, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getLinks = (role) => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', icon: <MdDashboard size={20} />, path: 'dashboard' },
          { name: 'Manage Donors', icon: <FaUsers size={20} />, path: 'donors' },
          { name: 'Manage Hospitals', icon: <FaHospital size={20} />, path: 'hospitals' },
          { name: 'System Requests', icon: <FaClipboardList size={20} />, path: 'requests' },
        ];
      case 'donor':
        return [
          { name: 'Dashboard', icon: <MdDashboard size={20} />, path: 'dashboard' },
          { name: 'Find Requests', icon: <FaTint size={20} />, path: 'requests' },
          { name: 'My Activities', icon: <MdTimeline size={20} />, path: 'activities' },
        ];
      case 'hospital':
        return [
          { name: 'Dashboard', icon: <MdDashboard size={20} />, path: 'dashboard' },
          { name: 'Manage Patients', icon: <FaUsers size={20} />, path: 'patients' },
          { name: 'Active Requests', icon: <FaClipboardList size={20} />, path: 'requests' },
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
          <FaTint className="text-primary" size={24} />
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
            <FaSignOutAlt size={20} className="group-hover:rotate-12 transition-transform" />
            {!isCollapsed && <span className="font-semibold">Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110"
        >
          {isCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
