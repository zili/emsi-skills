import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PortfolioView.scss";

const PortfolioView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Récupérer les données de la candidature depuis l'état de navigation
  const { candidature, fromDemandes } = location.state || {};
  
  // Si pas de données de candidature, rediriger vers les demandes
  if (!candidature) {
    navigate('/demandes');
    return null;
  }

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
    // Ici vous pouvez ajouter le lien LinkedIn réel du candidat
    window.open('https://linkedin.com/in/ahmed-benali', '_blank');
  };

  const handleCV = () => {
    // Ici vous pouvez ajouter le lien vers le CV du candidat
    const cvUrl = '/cv/ahmed-benali-cv.pdf'; // Exemple de chemin
    window.open(cvUrl, '_blank');
  };

  // Données d'exemple du portfolio - dans une vraie app, cela viendrait de l'API
  const portfolioData = {
    ...candidature,
    bio: "Étudiant en ingénierie informatique passionné par le développement web et l'innovation.",
    langues: [
      { nom: "Français", niveau: "Natif" },
      { nom: "Anglais", niveau: "Avancé" }
    ],
    projets_realises: [
      {
        id: 1,
        titre: "Application de gestion des étudiants",
        description: "Application mobile développée avec React Native pour gérer les informations des étudiants, leurs notes et leur emploi du temps.",
        technologies: ["React Native", "Node.js", "MongoDB"],
        image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1600",
        duree: "3 mois",
        statut: "Terminé"
      },
      {
        id: 2,
        titre: "Site e-commerce",
        description: "Plateforme e-commerce complète avec système de paiement intégré et interface d'administration.",
        technologies: ["React", "Django", "PostgreSQL", "Stripe"],
        image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1600",
        duree: "4 mois",
        statut: "Terminé"
      }
    ],
    commentaires: [
      {
        id: 1,
        auteur: "Sara B.",
        poste: "Projet : Plateforme E-learning EMSI",
        commentaire: "Excellent étudiant avec de très bonnes compétences techniques. Travail de qualité et respect des délais.",
        note: 5,
        date: "2024-01-10",
        avatar: "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600"
      }
    ]
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="portfolio-view">
      <div className="container">
        {/* Header avec bouton retour */}
        <div className="portfolio-header">
          <button className="back-btn" onClick={handleBack}>
            ← Retour aux candidatures
          </button>
        </div>

        {/* Section profil principale */}
        <div className="profile-main-card">
          <div className="profile-header">
            <img 
              src={candidature.photo} 
              alt={`${candidature.prenom} ${candidature.nom}`}
              className="profile-avatar"
            />
            <div className="profile-main-info">
              <div className="profile-name-section">
                <h1>{candidature.prenom} {candidature.nom}</h1>
                <div className="profile-stars">
                  {renderStars(5)}
                </div>
                <p className="profile-classe">4IIR G4 Tanger</p>
              </div>
              
              <div className="profile-actions">
                <button className="btn-action" onClick={handleLinkedIn}>LinkedIn</button>
                <button className="btn-action" onClick={handleCV}>CV</button>
              </div>
              
              <div className="profile-bio">
                <p>{portfolioData.bio}</p>
              </div>

              <div className="profile-tags-section">
                <div className="competences-section">
                  <span className="section-label">Compétences :</span>
                  <div className="tags-list">
                    {candidature.competences.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="langues-section">
                  <span className="section-label">Langues :</span>
                  <div className="tags-list">
                    {portfolioData.langues.map((langue, index) => (
                      <span key={index} className="langue-tag">{langue.nom}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="portfolio-bottom-sections">
          {/* Section projets réalisés */}
          <div className="projects-section">
            <h2>Projets réalisés</h2>
            <div className="projects-list-portfolio">
              {portfolioData.projets_realises.map(projet => (
                <div key={projet.id} className="project-card-portfolio">
                  <img src={projet.image} alt={projet.titre} className="project-img" />
                  <div className="project-info">
                    <h3 className="project-title">{projet.titre}</h3>
                    <p className="project-desc">{projet.description}</p>
                    <div className="project-meta">
                      <span className="duration">Durée: {projet.duree}</span>
                    </div>
                    <div className="project-tech">
                      {projet.technologies.map((tech, index) => (
                        <span key={index} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section commentaires */}
          <div className="comments-section">
            <h2>Commentaires</h2>
            <div className="comments-list">
              {portfolioData.commentaires.map(commentaire => (
                <div key={commentaire.id} className="comment-card-modern">
                  <img 
                    src={commentaire.avatar} 
                    alt={commentaire.auteur}
                    className="comment-avatar"
                  />
                  <div className="comment-content-modern">
                    <div className="comment-author-modern">{commentaire.auteur}</div>
                    <div className="comment-project-modern">{commentaire.poste}</div>
                    <div className="comment-text-modern">"{commentaire.commentaire}"</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioView; 

