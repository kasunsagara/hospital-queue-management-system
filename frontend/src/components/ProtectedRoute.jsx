import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to their respective dashboard if they try to access an unauthorized route
    if (user?.role === 'donor') return <Navigate to="/donor-dashboard" replace />;
    if (user?.role === 'hospital') return <Navigate to="/hospital-dashboard" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
