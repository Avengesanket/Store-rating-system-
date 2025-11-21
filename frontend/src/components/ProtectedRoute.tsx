import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

interface Props {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, isAuthenticated } = useAuth();

  // 1. Not logged in? Go to login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in, but wrong role?
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard based on their actual role
    if (user.role === UserRole.ADMIN) return <Navigate to="/admin/dashboard" replace />;
    if (user.role === UserRole.STORE_OWNER) return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/stores" replace />;
  }

  // 3. All good? Render the child route
  return <Outlet />;
};

export default ProtectedRoute;