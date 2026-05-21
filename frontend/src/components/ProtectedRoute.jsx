import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * HOC para proteger rutas basado en la autenticación y el rol del usuario.
 * @param {Object} props
 * @param {React.ReactNode} props.children Componente hijo a renderizar si se aprueba.
 * @param {string[]} [props.allowedRoles] Arreglo de roles permitidos, ej: ['admin']. Si no se provee, solo requiere estar logueado.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <span className="loader-icon">⏳</span>
          <span>Verificando permisos...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Si no está logueado, redirige al login y guarda la ruta intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si está logueado pero no tiene el rol necesario, redirige al inicio (o catálogo)
    return <Navigate to="/" replace />;
  }

  return children;
}
