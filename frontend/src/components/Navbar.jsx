import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Droplet, User, LogOut, LayoutDashboard, Home } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Do not show navbar on login and register pages
  const dashboardPaths = ['/donor-dashboard', '/hospital-dashboard', '/admin-dashboard'];
  if (location.pathname === '/login' || location.pathname === '/register' || dashboardPaths.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="glass-card sticky top-0 z-50 m-0 flex items-center justify-between rounded-none border-x-0 border-t-0 px-8 py-4">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold">
        <Droplet className="text-primary fill-primary" size={24} />
        <span>BloodSync</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-text-muted transition-colors hover:text-text-main">
          <Home size={20} />
        </Link>
        
        {token ? (
          <>
            {user?.role === 'donor' && (
              <Link to="/donor-dashboard" className="text-sm font-medium text-text-muted transition-colors hover:text-text-main">
                Dashboard
              </Link>
            )}
            {user?.role === 'hospital' && (
              <Link to="/hospital-dashboard" className="text-sm font-medium text-text-muted transition-colors hover:text-text-main">
                Dashboard
              </Link>
            )}
            
            <div className="flex items-center gap-3 border-l border-glass-border pl-4">
              <span className="text-sm text-text-muted">{user?.name}</span>
              <button 
                onClick={handleLogout} 
                className="btn-outline rounded-full p-2"
              >
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
