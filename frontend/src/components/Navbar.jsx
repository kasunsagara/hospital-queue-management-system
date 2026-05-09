import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Droplet, User, LogOut, LayoutDashboard, Home } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Do not show navbar on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar glass-card" style={{ 
      margin: '0', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: '0',
      zIndex: 1000,
      borderRadius: '0',
      borderLeft: 'none',
      borderRight: 'none',
      borderTop: 'none'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
        <Droplet color="#ff4d4d" fill="#ff4d4d" size={24} />
        <span>BloodSync</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" className="nav-link"><Home size={20} /></Link>
        
        {token ? (
          <>
            {user?.role === 'donor' && <Link to="/donor-dashboard" className="nav-link">Dashboard</Link>}
            {user?.role === 'hospital' && <Link to="/hospital-dashboard" className="nav-link">Dashboard</Link>}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user?.name}</span>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        )}
      </div>
      
      <style>{`
        .nav-link {
          color: var(--text-muted);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav-link:hover {
          color: var(--text-main);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
