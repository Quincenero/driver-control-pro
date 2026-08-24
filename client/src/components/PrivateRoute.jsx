// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>; // o un spinner

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;