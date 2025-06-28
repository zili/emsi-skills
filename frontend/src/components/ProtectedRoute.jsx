import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserRedirectPath, hasAccessToRoute } from '../utils/userRedirection';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('access_token');
  const userData = localStorage.getItem('user_data');
  const location = useLocation();
  
  // Si pas de token, rediriger vers login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userData);
    const userType = user?.user_type;
    
    // Si route admin requise mais utilisateur n'est pas admin
    if (requireAdmin && userType !== 'admin') {
      const redirectPath = getUserRedirectPath(userType);
      return <Navigate to={redirectPath} replace />;
    }
    
    // Vérifier si l'utilisateur a accès à cette route
    if (!hasAccessToRoute(userType, location.pathname)) {
      const redirectPath = getUserRedirectPath(userType);
      return <Navigate to={redirectPath} replace />;
    }

    return children;
  } catch (error) {
    // Si erreur de parsing, supprimer les données et rediriger vers login
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

 
 