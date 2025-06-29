import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PortfolioView.scss";
import "./PortfolioView-additions.scss";

const PortfolioView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Récupérer les données de la candidature depuis l'état de navigation
  const { candidature, fromDemandes } = location.state || {};
  
  // Fallback pour les tests - créer une candidature factice si nécessaire
  const candidatureFallback = candidature || {
    prenom: 'Lina',
    nom: 'Zili',
    photo: '/img/woman.png',
    classe: '4IIR G4 Tanger',
    bio: 'salam'
  };
  
  // Debug: Voir les données de candidature reçues
  console.log('🔍 Données candidature reçues:', candidature);
  console.log('🔍 Candidature avec fallback:', candidatureFallback);
  
  // Pour le test avec les données mockées, on désactive temporairement cette vérification
  /*
  if (!candidature) {
    navigate('/demandes');
    return null;
  }
  */



  // Charger les données depuis l'API
  useEffect(() => {
    const loadPortfolioData = async () => {
      setLoading(true);
      
      try {
        // Si on a une candidature avec un user_id, récupérer le profil de cet utilisateur
        if (candidatureFallback?.user?.id) {
          const response = await fetch(`http://localhost:8000/api/auth/users/${candidatureFallback.user.id}/`);
          if (response.ok) {
            const userData = await response.json();
            setPortfolioData({
              prenom: userData.first_name || candidatureFallback.prenom,
              nom: userData.last_name || candidatureFallback.nom,
              name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
              email: userData.email,
              photo: userData.profile_picture || candidatureFallback.photo || "/img/admin.png",
              bio: userData.bio || "Pas de description disponible",
              linkedin_url: userData.linkedin_url,
              cv_file: userData.cv_file,
              competences: userData.skills ? userData.skills.split(',').map(s => s.trim()) : [],
              langues: userData.languages ? userData.languages.split(',').map(l => ({ nom: l.trim(), niveau: "Non spécifié" })) : [],
              projets_realises: userData.projects || [],
              commentaires: userData.comments || [],
              rating_average: userData.rating_average || 0,
              total_projects: userData.total_projects || 0,
              projets_termines: userData.total_projects || 0,
              en_cours: 0,
              taux_reussite: userData.success_rate || 0
            });
          } else {
            // Fallback vers les données de candidature
            setPortfolioData({
              prenom: candidatureFallback.prenom,
              nom: candidatureFallback.nom,
              name: `${candidatureFallback.prenom} ${candidatureFallback.nom}`,
              photo: candidatureFallback.photo || "/img/admin.png",
              bio: candidatureFallback.bio || "Pas de description disponible",
              competences: [],
              langues: [],
              projets_realises: [],
              commentaires: [],
              rating_average: 0,
              total_projects: 0,
              projets_termines: 0,
              en_cours: 0,
              taux_reussite: 0
            });
          }
        } else {
          // Fallback vers les données de candidature
          setPortfolioData({
            prenom: candidatureFallback.prenom,
            nom: candidatureFallback.nom,
            name: `${candidatureFallback.prenom} ${candidatureFallback.nom}`,
            photo: candidatureFallback.photo || "/img/admin.png",
            bio: candidatureFallback.bio || "Pas de description disponible",
            competences: [],
            langues: [],
            projets_realises: [],
            commentaires: [],
            rating_average: 0,
            total_projects: 0,
            projets_termines: 0,
            en_cours: 0,
            taux_reussite: 0
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement du portfolio:', error);
        // Fallback vers les données de candidature
        setPortfolioData({
          prenom: candidatureFallback.prenom,
          nom: candidatureFallback.nom,
          name: `${candidatureFallback.prenom} ${candidatureFallback.nom}`,
          photo: candidatureFallback.photo || "/img/admin.png",
          bio: candidatureFallback.bio || "Pas de description disponible",
          competences: [],
          langues: [],
          projets_realises: [],
          commentaires: [],
          rating_average: 0,
          total_projects: 0,
          projets_termines: 0,
          en_cours: 0,
          taux_reussite: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, [candidatureFallback]);

  // Fonction pour retourner à la page précédente
  const handleBack = () => {
    if (fromDemandes) {
      navigate('/demandes');
    } else {
      navigate('/projets'); // Retourner vers projets au lieu de -1 pour éviter les erreurs
    }
  };

  // Fonctions pour les boutons LinkedIn et CV
  const handleLinkedIn = () => {
    if (portfolioData?.linkedin_url) {
      window.open(portfolioData.linkedin_url, '_blank');
    } else {
      // Fallback vers une recherche LinkedIn
      const searchUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(portfolioData?.prenom + ' ' + portfolioData?.nom)}`;
      window.open(searchUrl, '_blank');
    }
  };

  const handleCV = () => {
    if (portfolioData?.cv_file) {
      window.open(`http://localhost:8000${portfolioData.cv_file}`, '_blank');
    } else {
      alert('Aucun CV disponible pour cet utilisateur');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="portfolio-view">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement du portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state (mais on affiche quand même les données disponibles)
  if (error && !portfolioData) {
    return (
      <div className="portfolio-view">
        <div className="container">
          <div className="error-container">
            <p>Erreur lors du chargement : {error}</p>
            <button onClick={() => window.location.reload()}>Réessayer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-view">
      <div className="container">
        {/* Header avec bouton retour */}
        <div className="portfolio-header">
          <button className="back-btn" onClick={handleBack}>
            ← Retour aux candidatures
          </button>
          {error && (
            <div className="warning-message">
              ⚠️ Certaines données n'ont pas pu être chargées
            </div>
          )}
        </div>

        {/* Section profil principale */}
        <div className="profile-main-card">
          <div className="profile-header">
            <img 
              src={portfolioData?.photo || candidatureFallback?.photo || '/img/woman.png'} 
              alt={`${portfolioData?.prenom || candidatureFallback?.prenom} ${portfolioData?.nom || candidatureFallback?.nom}`}
              className="profile-avatar"
            />
            <div className="profile-main-info">
              <div className="profile-name-section">
                <h1>
                  {portfolioData?.prenom && portfolioData?.nom 
                    ? `${portfolioData.prenom} ${portfolioData.nom}`
                    : portfolioData?.name
                      ? portfolioData.name
                      : 'Lina Zili'}
                </h1>
                <div className="profile-stars">
                  {renderStars(Math.round(portfolioData?.rating_average || candidatureFallback?.rating_average || 5))}
                  <span className="rating-text">({portfolioData?.rating_average || candidatureFallback?.rating_average || 4.8}/5)</span>
                </div>
                <p className="profile-classe">{candidatureFallback?.classe || 'Étudiant EMSI'}</p>
                {portfolioData?.city && <p className="profile-city">📍 {portfolioData.city}</p>}
              </div>
              
              <div className="profile-actions">
                <button className="btn-action" onClick={handleLinkedIn}>
                  LinkedIn {portfolioData?.linkedin_url ? '🔗' : '🔍'}
                </button>
                <button className="btn-action" onClick={handleCV}>
                  CV {portfolioData?.cv_file ? '📄' : '❌'}
                </button>
              </div>
              
              <div className="profile-bio">
                <p>{portfolioData?.bio || candidatureFallback?.bio || "Aucune description disponible."}</p>
              </div>

              <div className="profile-tags-section">
                <div className="competences-section">
                  <span className="section-label">Compétences :</span>
                  <div className="tags-list">
                    {(portfolioData?.competences || candidatureFallback?.competences || []).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                {portfolioData?.langues && portfolioData.langues.length > 0 && (
                  <div className="langues-section">
                    <span className="section-label">Langues :</span>
                    <div className="tags-list">
                      {portfolioData.langues.map((langue, index) => (
                        <span key={index} className="langue-tag">
                          {langue.nom} ({langue.niveau})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistiques */}
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{portfolioData?.projets_termines || 0}</span>
                  <span className="stat-label">Projets terminés</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{portfolioData?.total_projects || 0}</span>
                  <span className="stat-label">Total projets</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{portfolioData?.taux_reussite || 0}%</span>
                  <span className="stat-label">Taux de réussite</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="portfolio-bottom-sections">
          {/* Debug info - temporaire */}
          <div style={{background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px'}}>
            <strong>🔍 Debug Info:</strong><br/>
            Portfolio Data: {portfolioData ? 'Chargé' : 'Non chargé'}<br/>
            Projets: {portfolioData?.projets_realises?.length || 0}<br/>
            Commentaires: {portfolioData?.commentaires?.length || 0}<br/>
            Première donnée: {JSON.stringify(portfolioData?.projets_realises?.[0]?.titre || 'Aucune')}
          </div>

          {/* Section projets réalisés */}
          <div className="projects-section">
            <h2>Projets réalisés ({portfolioData?.projets_realises?.length || 0})</h2>
            {portfolioData?.projets_realises && portfolioData.projets_realises.length > 0 ? (
              <div className="projects-list-portfolio">
                {portfolioData.projets_realises.map(projet => (
                  <div key={projet.id} className="project-card-portfolio">
                    <img 
                      src={projet.image} 
                      alt={projet.titre} 
                      className="project-img" 
                    />
                    <div className="project-info">
                      <h3 className="project-title">{projet.titre}</h3>
                      <p className="project-desc">{projet.description}</p>
                      <div className="project-meta">
                        <span className="duration">Durée: {projet.duree}</span>
                        <span className="client">Client: {projet.client}</span>
                        <span className="status">{projet.statut}</span>
                      </div>
                      <div className="project-tech">
                        {projet.technologies && projet.technologies.map((tech, index) => (
                          <span key={index} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-projects">
                <p>Aucun projet réalisé pour le moment.</p>
              </div>
            )}
          </div>

          {/* Section commentaires */}
          <div className="comments-section">
            <h2>Témoignages ({portfolioData?.commentaires?.length || 0})</h2>
            {portfolioData?.commentaires && portfolioData.commentaires.length > 0 ? (
              <div className="comments-list">
                {portfolioData.commentaires.map(commentaire => (
                  <div key={commentaire.id} className="comment-card-modern">
                    <img 
                      src={commentaire.photo} 
                      alt={commentaire.auteur}
                      className="comment-avatar"
                    />
                    <div className="comment-content-modern">
                      <div className="comment-author-modern">{commentaire.auteur}</div>
                      <div className="comment-project-modern">{commentaire.poste}</div>
                      <div className="comment-rating">
                        {renderStars(commentaire.note)} ({commentaire.note}/5)
                      </div>
                      <div className="comment-text-modern">"{commentaire.commentaire}"</div>
                      <div className="comment-date">{commentaire.date}</div>
                      <div className="comment-project-name">Projet: {commentaire.projet}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-comments">
                <p>Aucun témoignage disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioView; 

