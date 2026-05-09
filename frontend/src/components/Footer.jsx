import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  // Do not show footer on login and register pages
  const dashboardPaths = ['/donor-dashboard', '/hospital-dashboard', '/admin-dashboard'];
  if (location.pathname === '/login' || location.pathname === '/register' || dashboardPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <footer style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
      <p>© {new Date().getFullYear()} BloodSync. All rights reserved.</p>
      <p style={{ marginTop: '0.5rem' }}>Connecting Donors and Hospitals for a Better Future.</p>
    </footer>
  );
};

export default Footer;
