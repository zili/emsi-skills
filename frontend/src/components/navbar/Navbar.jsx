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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsAdmin(user.is_superuser || false);
      } catch (error) {
        console.error('Erreur parsing user data:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setCurrentUser(null);
    setIsAdmin(false);
    window.location.href = '/login';
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <img src="/img/Emsi Logo.png" alt="EMSI Logo" style={{height: '90px', objectFit: 'contain', marginTop: '15px', marginLeft: '-23px'}} />
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/">Accueil</Link>
          <Link className="link" to="/projets">Projets</Link>
          <Link className="link" to="/portfolio">Portfolio</Link>
          {isAdmin && (
            <>
              <Link className="link" to="/admin">Administration</Link>
              <Link className="link" to="/admin/gestion-comptes">Gestion des comptes</Link>
            </>
          )}
          {currentUser ? (
            <div className="user" onClick={()=>setOpen(!open)}>
              <img
                src={currentUser.profile_picture || "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600"}
                alt=""
              />
              <span>{currentUser?.username || currentUser?.email}</span>
              {open && <div className="options">
                <Link className="link" to="/projetrealise">
                  Mes projets
                </Link>
                <Link className="link" to="/candidature">
                  Mes candidatures
                </Link>
                <Link className="link" to="/messages">
                  Messages
                </Link>
                <button className="link" onClick={handleLogout} style={{border: 'none', background: 'none', cursor: 'pointer', padding: 0, textAlign: 'left'}}>
                  Se déconnecter
                </button>
              </div>}
            </div>
          ) : (
            <Link className="link" to="/register">
              <button>Inscription</button>
            </Link>
          )}
        </div>
      </div>
      {((pathname === "/" || pathname.startsWith("/projets")) && active) && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/gigs?cat=informatique">
              Informatique
            </Link>
            <Link className="link menuLink" to="/gigs?cat=genie-civil">
              Génie Civil
            </Link>
            <Link className="link menuLink" to="/gigs?cat=design">
              Design & Créatif
            </Link>
            <Link className="link menuLink" to="/gigs?cat=marketing">
              Marketing Digital
            </Link>
            <Link className="link menuLink" to="/gigs?cat=business">
              Business
            </Link>
            <Link className="link menuLink" to="/gigs?cat=benevolat">
              Bénévolat
            </Link>
            <Link className="link menuLink" to="/gigs?cat=recherche">
              Recherche
            </Link>
            <Link className="link menuLink" to="/gigs?cat=entrepreneuriat">
              Entrepreneuriat
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
