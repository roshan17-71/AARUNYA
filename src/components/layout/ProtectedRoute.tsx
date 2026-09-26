import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { Skeleton } from '../ui/Skeleton';
import { Container } from './Container';

export interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="py-20 min-h-[60vh] flex items-center justify-center">
        <Container size="sm" className="space-y-4 text-center">
          <Skeleton variant="circular" className="w-12 h-12 mx-auto" />
          <Skeleton variant="text" className="w-48 mx-auto" />
          <p className="text-xs text-neutral-muted">Authenticating your secure session...</p>
        </Container>
      </div>
    );
  }

  // 1. Not signed in -> redirect to /signin
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 2. Check role authorization if allowedRoles specified
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Route to user's assigned dashboard instead of unauthorized area
    const roleRoutes: Record<UserRole, string> = {
      patient: '/dashboard/patient',
      doctor: '/dashboard/doctor',
      hospital: '/dashboard/hospital',
      admin: '/admin',
    };
    return <Navigate to={roleRoutes[role] || '/'} replace />;
  }

  return children ? <>{children}</> : null;
};

