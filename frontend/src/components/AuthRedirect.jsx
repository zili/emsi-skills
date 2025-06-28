import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserRedirectPath } from '../utils/userRedirection';

const AuthRedirect = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    // Si utilisateur connecté et sur la page de login, rediriger vers sa page d'accueil
    if (token && userData && location.pathname === '/login') {
      try {
        const user = JSON.parse(userData);
        const redirectPath = getUserRedirectPath(user.user_type);
        console.log('🔄 Utilisateur déjà connecté, redirection vers:', redirectPath);
        navigate(redirectPath, { replace: true });
      } catch (error) {
        console.error('Erreur parsing user data:', error);
        // Nettoyer les données corrompues
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
      }
    }
  }, [navigate, location.pathname]);

  return children;
};

export default AuthRedirect; 