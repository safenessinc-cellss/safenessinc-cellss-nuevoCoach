import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth, Role } from '../context/AuthContext';

interface Props { children: ReactNode; allowedRoles: Role[]; }

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03050C] text-[#00F0FF] font-mono text-sm">
        Verificando credenciales…
      </div>
    );
  }
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location }} />;
  if (currentUser.status === 'pending') return <Navigate to="/login?pending=1" replace />;
  if (currentUser.status === 'suspended') return <Navigate to="/login?blocked=1" replace />;
  if (!allowedRoles.includes(currentUser.role) && currentUser.role !== 'superadmin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
