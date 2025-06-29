import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  // Récupérer les données utilisateur depuis localStorage
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState('student');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    const storedUserType = localStorage.getItem('user_type');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setUserType(storedUserType || 'student');
      } catch (error) {
        console.error('Erreur parsing user data:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
      }
    }
  }, []);

  // Écouter les changements du localStorage pour mettre à jour la navbar
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUserType = localStorage.getItem('user_type');
      const userData = localStorage.getItem('user_data');
      
      if (storedUserType) {
        setUserType(storedUserType);
      }
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUser(user);
        } catch (error) {
          console.error('Erreur parsing user data:', error);
        }
      }
    };

    // Écouter les changements du localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Nettoyer l'événement
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setCurrentUser(null);
    setUserType('student');
    window.location.href = '/login';
  };

  // Fonction pour obtenir le lien du logo selon le type d'utilisateur
  const getLogoLink = () => {
    switch(userType) {
      case 'student':
        return '/accueil-student';
      case 'staff':
      case 'club':
        return '/accueil-staff-club';
      case 'admin':
        return '/admin';
      default:
        return '/accueil-student';
    }
  };

  // Fonction pour obtenir les liens de la navbar selon le type d'utilisateur
  const getNavbarLinks = () => {
    switch(userType) {
      case 'student':
        return (
          <>
            <Link className="link" to="/accueil-student">Accueil</Link>
            <Link className="link" to="/projets">Projets</Link>
            <Link className="link" to="/portfolio">Mon Portfolio</Link>
          </>
        );
      case 'staff':
      case 'club':
        return (
          <>
            <Link className="link" to="/accueil-staff-club">Accueil</Link>
            <Link className="link" to="/demandes">Demandes</Link>
            <Link className="link" to="/profil">Profil</Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Link className="link" to="/admin">Admin Center</Link>
            <Link className="link" to="/admin/gestion-comptes">Gestion des comptes</Link>
          </>
        );
      default:
        return (
          <>
            <Link className="link" to="/accueil-student">Accueil</Link>
            <Link className="link" to="/projets">Projets</Link>
            <Link className="link" to="/portfolio">Mon Portfolio</Link>
          </>
        );
    }
  };

  // Fonction pour obtenir les options de la sidebar selon le type d'utilisateur
  const getSidebarOptions = () => {
    switch(userType) {
      case 'student':
        return (
          <>
            <Link className="link" to="/projetrealise">Projets réalisés</Link>
            <Link className="link" to="/candidature">Candidatures</Link>
            <Link className="link" to="/messages">Messages</Link>
            <button className="link" onClick={handleLogout} style={{border: 'none', background: 'none', cursor: 'pointer', padding: 0, textAlign: 'left'}}>
              Se déconnecter
            </button>
          </>
        );
      case 'staff':
        return (
          <>
            <Link className="link" to="/messages">Messages</Link>
            <button className="link" onClick={handleLogout} style={{border: 'none', background: 'none', cursor: 'pointer', padding: 0, textAlign: 'left'}}>
              Se déconnecter
            </button>
          </>
        );
      case 'club':
        return (
          <>
            <Link className="link" to="/messages">Messages</Link>
            <button className="link" onClick={handleLogout} style={{border: 'none', background: 'none', cursor: 'pointer', padding: 0, textAlign: 'left'}}>
              Se déconnecter
            </button>
          </>
        );
      case 'admin':
        return (
          <button className="link" onClick={handleLogout} style={{border: 'none', background: 'none', cursor: 'pointer', padding: 0, textAlign: 'left'}}>
            Se déconnecter
          </button>
        );
      default:
        return (
          <>
            <Link className="link" to="/projetrealise">Projets réalisés</Link>
            <Link className="link" to="/candidature">Candidatures</Link>
            <Link className="link" to="/messages">Messages</Link>
            <button className="link" onClick={handleLogout} style={{border: 'none', background: 'none', cursor: 'pointer', padding: 0, textAlign: 'left'}}>
              Se déconnecter
            </button>
          </>
        );
    }
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link className="link" to={getLogoLink()}>
            <img src="/img/Emsi Logo.png" alt="EMSI Logo" style={{height: '90px', objectFit: 'contain', marginTop: '15px', marginLeft: '-23px'}} />
          </Link>
        </div>
        <div className="links">
          {getNavbarLinks()}
            <div className="user" onClick={()=>setOpen(!open)}>
              <img
                src={userType === 'club' ? "/img/lionss.jpg" : userType === 'admin' ? "/img/admin.png" : (currentUser?.profile_picture || "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600")}
                alt=""
              />
            <span>{userType === 'club' ? "Lions" : userType === 'admin' ? "Admin" : (currentUser?.first_name || currentUser?.username || "Anna")}</span>
              {open && <div className="options">
                {getSidebarOptions()}
              </div>}
            </div>
        </div>
      </div>
      {((pathname === "/" || pathname.startsWith("/projets")) && active && userType === 'student') && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/gigs?cat=developpement">
              Développement
            </Link>
            <Link className="link menuLink" to="/gigs?cat=genie-civil">
              Génie Civil
            </Link>
            <Link className="link menuLink" to="/gigs?cat=industriel">
              Industriel
            </Link>
            <Link className="link menuLink" to="/gigs?cat=marketing">
              Marketing
            </Link>
            <Link className="link menuLink" to="/gigs?cat=benevolat">
              Bénévolat
            </Link>
            <Link className="link menuLink" to="/gigs?cat=art">
              Art
            </Link>
            <Link className="link menuLink" to="/gigs?cat=video-montage">
              Vidéo & Montage
            </Link>
            <Link className="link menuLink" to="/gigs?cat=autres">
              Autres
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
