import React, { useState, useRef } from 'react';
import './Profil.scss';

const Profil = () => {
  const [profileData, setProfileData] = useState({
    nom: "Lions Tanger",
    email: "lions.tanger@emsi-edu.ma",
    type: "Club",
    photo: "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600",
    projets_crees: 5,
    candidatures_recues: 12,
    isLionsMember: true // Indicateur si l'utilisateur est membre du club Lions
  });
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, photo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour obtenir la photo de profil appropriée
  const getProfilePhoto = () => {
    if (profileData.isLionsMember) {
      return "/img/lionss.jpg";
    }
    return profileData.photo;
  };

  return (
    <div className="profil-modern-page">
      <div className="profil-container">
        
        {/* Header avec photo et infos principales */}
        <div className="profil-header-card">
          <div className="profil-photo-section">
            <div className="photo-container">
              <img 
                src={getProfilePhoto()} 
                alt="Photo de profil" 
                className="profile-photo"
              />
              <div className="photo-overlay" onClick={() => fileInputRef.current.click()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                <span>Modifier</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>
            
            <div className="photo-info">
              <h1>{profileData.nom}</h1>
              <p className="user-type">{profileData.type}</p>
              <p className="user-email">{profileData.email}</p>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="quick-stats">
            <div className="stat-item">
              <div className="stat-number">{profileData.projets_crees}</div>
              <div className="stat-label">Projets créés</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{profileData.candidatures_recues}</div>
              <div className="stat-label">Candidatures reçues</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
