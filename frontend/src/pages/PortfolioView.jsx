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
  
  // Debug: Voir les données de candidature reçues
  console.log('🔍 Données candidature reçues:', candidature);
  
  // Si pas de données de candidature, rediriger vers les demandes
  if (!candidature) {
    navigate('/demandes');
    return null;
  }

  // Récupérer les données du portfolio de l'utilisateur connecté
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          // Rediriger vers la page de connexion
          console.log('🔄 Pas de token, redirection vers la connexion...');
          window.location.href = '/login';
          return;
        }

        // D'abord, récupérer les infos de l'utilisateur connecté
        const profileResponse = await fetch('http://localhost:8000/api/auth/profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!profileResponse.ok) {
          if (profileResponse.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Session expirée - veuillez vous reconnecter');
          }
          throw new Error(`HTTP error! status: ${profileResponse.status}`);
        }

        const profileResult = await profileResponse.json();
        const userData = profileResult.data;
        
        console.log('🔍 Utilisateur connecté:', userData);

        // Essayer de récupérer le portfolio complet
        try {
          const portfolioResponse = await fetch(`http://localhost:8000/api/auth/portfolio/${userData.id}/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (portfolioResponse.ok) {
            const portfolioResult = await portfolioResponse.json();
            const data = portfolioResult.data;
            
            setPortfolioData({
              ...data,
              name: `${data.prenom || ''} ${data.nom || ''}`.trim() || userData.username || "Utilisateur",
              photo: data.photo ? `http://localhost:8000${data.photo}` : userData.profile_picture ? `http://localhost:8000${userData.profile_picture}` : null,
            });
            
            console.log('✅ Portfolio complet chargé:', data);
          } else {
            throw new Error('Portfolio API failed');
          }
        } catch (portfolioError) {
          // Si l'API portfolio échoue, utiliser les données de base du profil
          console.log('⚠️ Portfolio API échoué, utilisation des données de base');
          setPortfolioData({
            prenom: userData.first_name,
            nom: userData.last_name,
            name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username || "Utilisateur",
            email: userData.email,
            photo: userData.profile_picture ? `http://localhost:8000${userData.profile_picture}` : null,
            bio: userData.bio || "Aucune description disponible.",
            linkedin_url: userData.linkedin_url || null,
            cv_file: userData.cv_file || null,
            competences: userData.skills ? userData.skills.split(',').map(s => s.trim()) : [],
            langues: userData.languages ? userData.languages.split(',').map(s => ({ nom: s.trim(), niveau: 'Intermédiaire' })) : [],
            projets_realises: [],
            commentaires: [],
            rating_average: userData.rating_average || 0,
            total_projects: userData.total_projects || 0
          });
          
          console.log('✅ Données de base utilisées:', userData);
        }
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement du portfolio:', error);
        setError(error.message);
        
        // En dernier recours, utiliser les données stockées en localStorage
        const storedUserName = localStorage.getItem('userName');
        const storedUserEmail = localStorage.getItem('userEmail');
        
        setPortfolioData({
          prenom: storedUserName ? storedUserName.split(' ')[0] : 'Utilisateur',
          nom: storedUserName ? storedUserName.split(' ').slice(1).join(' ') : '',
          name: storedUserName || "Utilisateur",
          email: storedUserEmail || '',
          photo: null,
          bio: "Impossible de charger les données du profil.",
          linkedin_url: null,
          cv_file: null,
          competences: [],
          langues: [],
          projets_realises: [],
          commentaires: [],
          rating_average: 0,
          total_projects: 0
        });
        
        console.log('💾 Fallback localStorage:', { storedUserName, storedUserEmail });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // Fonction pour retourner à la page précédente
  const handleBack = () => {
    if (fromDemandes) {
      navigate('/demandes');
    } else {
      navigate(-1); // Retourner à la page précédente
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
              src={portfolioData?.photo ? `http://localhost:8000${portfolioData.photo}` : (candidature?.photo || '/img/default-avatar.png')} 
              alt={`${portfolioData?.prenom || candidature?.prenom} ${portfolioData?.nom || candidature?.nom}`}
              className="profile-avatar"
            />
            <div className="profile-main-info">
              <div className="profile-name-section">
                <h1>
                  {candidature?.prenom && candidature?.nom 
                    ? `${candidature.prenom} ${candidature.nom}`
                    : portfolioData?.prenom && portfolioData?.nom 
                      ? `${portfolioData.prenom} ${portfolioData.nom}`
                      : 'Yassine Zilili'}
                </h1>
                <div className="profile-stars">
                  {renderStars(Math.round(portfolioData?.rating_average || candidature?.rating_average || 0))}
                  <span className="rating-text">({portfolioData?.rating_average || candidature?.rating_average || 0}/5)</span>
                </div>
                <p className="profile-classe">{candidature?.classe || 'Étudiant EMSI'}</p>
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
                <p>{portfolioData?.bio || candidature?.bio || "Aucune description disponible."}</p>
              </div>

              <div className="profile-tags-section">
                <div className="competences-section">
                  <span className="section-label">Compétences :</span>
                  <div className="tags-list">
                    {(portfolioData?.competences || candidature?.competences || []).map((skill, index) => (
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
              {portfolioData?.statistiques && (
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-number">{portfolioData.statistiques.projets_termines}</span>
                    <span className="stat-label">Projets terminés</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{portfolioData.statistiques.total_evaluations}</span>
                    <span className="stat-label">Évaluations</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{portfolioData.statistiques.taux_recommandation}%</span>
                    <span className="stat-label">Recommandations</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="portfolio-bottom-sections">
          {/* Section projets réalisés */}
          <div className="projects-section">
            <h2>Projets réalisés ({portfolioData?.projets_realises?.length || 0})</h2>
            {portfolioData?.projets_realises && portfolioData.projets_realises.length > 0 ? (
              <div className="projects-list-portfolio">
                {portfolioData.projets_realises.map(projet => (
                  <div key={projet.id} className="project-card-portfolio">
                    <img 
                      src={projet.image.startsWith('http') ? projet.image : `http://localhost:8000${projet.image}`} 
                      alt={projet.titre} 
                      className="project-img" 
                    />
                    <div className="project-info">
                      <h3 className="project-title">{projet.titre}</h3>
                      <p className="project-desc">{projet.description}</p>
                      <div className="project-meta">
                        <span className="duration">Durée: {projet.duree}</span>
                        <span className="budget">Budget: {projet.budget} MAD</span>
                        <span className="status">{projet.statut}</span>
                      </div>
                      <div className="project-tech">
                        {projet.categories && projet.categories.map((category, index) => (
                          <span key={index} className="tech-tag">{category}</span>
                        ))}
                      </div>
                      <div className="project-stats">
                        📝 {projet.candidatures_count} candidatures
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
                      src={commentaire.avatar.startsWith('http') ? commentaire.avatar : `http://localhost:8000${commentaire.avatar}`} 
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
                      <div className="comment-date">{new Date(commentaire.date).toLocaleDateString('fr-FR')}</div>
                      
                      {/* Critères détaillés */}
                      {commentaire.criteria && (
                        <div className="rating-criteria">
                          <small>Communication: {commentaire.criteria.communication}/5 | 
                          Qualité: {commentaire.criteria.quality}/5 | 
                          Délais: {commentaire.criteria.timeliness}/5 | 
                          Professionnalisme: {commentaire.criteria.professionalism}/5</small>
                        </div>
                      )}
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

