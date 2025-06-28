/**
 * Détermine la route de redirection basée sur le type d'utilisateur
 * @param {string} userType - Le type d'utilisateur (student, staff, club, admin)
 * @returns {string} - Le chemin de redirection
 */
export const getUserRedirectPath = (userType) => {
  switch (userType) {
    case 'student':
      return '/accueil-student';
    case 'staff':
    case 'club':
      return '/accueil-staff-club';
    case 'admin':
      return '/admin';
    default:
      return '/accueil-student'; // Default pour les cas non prévus
  }
};

/**
 * Redirige l'utilisateur vers la bonne page après authentification
 * @param {object} navigate - La fonction de navigation de React Router
 * @param {object} userData - Les données utilisateur contenant le type
 */
export const redirectUserAfterAuth = (navigate, userData) => {
  const userType = userData?.user_type;
  const redirectPath = getUserRedirectPath(userType);
  
  console.log('👤 Type d\'utilisateur:', userType);
  console.log('🔄 Redirection vers:', redirectPath);
  
  navigate(redirectPath);
};

/**
 * Vérifie si l'utilisateur a accès à une route spécifique
 * @param {string} userType - Le type d'utilisateur
 * @param {string} route - La route à vérifier
 * @returns {boolean} - True si l'utilisateur a accès
 */
export const hasAccessToRoute = (userType, route) => {
  const userRoutes = {
    student: [
      '/accueil-student', '/projets', '/portfolio', '/favoris', '/messages', '/message',
      '/candidature', '/projetrealise', '/add', '/add-project', '/gigs', '/gig', 
      '/orders', '/mygigs', '/dashboard'
    ],
    staff: [
      '/accueil-staff-club', '/projets', '/portfolio', '/messages', '/message',
      '/add', '/add-project', '/gigs', '/gig', '/orders', '/mygigs', '/dashboard',
      '/demandes', '/profil', '/mes-projets'
    ],
    club: [
      '/accueil-staff-club', '/projets', '/portfolio', '/messages', '/message',
      '/add', '/add-project', '/gigs', '/gig', '/orders', '/mygigs', '/dashboard',
      '/demandes', '/profil', '/mes-projets'
    ],
    admin: [
      '/admin', '/admin-dashboard', '/adminprojet', '/admincomptes', '/admindemandes', 
      '/admin/gestion-comptes', '/add', '/add-project', '/projets', '/portfolio',
      '/messages', '/message', '/gigs', '/gig', '/orders', '/mygigs', '/dashboard'
    ]
  };
  
  const allowedRoutes = userRoutes[userType] || userRoutes.student;
  return allowedRoutes.some(allowedRoute => route.startsWith(allowedRoute));
}; 