import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check if mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark">
      <Sidebar 
        user={user} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      
      <main 
        className={`transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-72'}`}
      >
        <div className="container min-h-screen py-8 px-4 md:px-8">
          {children}
        </div>
      </main>

      <style>{`
        /* Hide main navbar/footer when in dashboard layout */
        nav#main-navbar, footer#main-footer {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
