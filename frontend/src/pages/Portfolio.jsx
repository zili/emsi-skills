import React, { useState, useEffect } from "react";
import "./Portfolio.scss";

const categories = ["Catégorie", "IT", "Art", "Bénévole", "Civil"];
const statuts = ["Statut", "Terminé", "En cours", "En attente"];

const Portfolio = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Statut");
  const [categoryFilter, setCategoryFilter] = useState("Catégorie");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Yassine Zilili",
    photo: "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "Étudiant en ingénierie informatique passionné par le développement web et l'innovation.",
    linkedin: "https://linkedin.com/in/yassine-zilili",
    cv: "/cv/yassine-zilili.pdf",
    skills: ["React", "Node.js", "UI/UX", "MongoDB", "Figma", "Python"],
    languages: ["Français", "Anglais"]
  });

  const handleFileUpload = (file, type) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileData({...profileData, [type]: url});
    }
  };

  // Données mockées pour le portfolio
  const projects = [
    {
      id: 1,
      title: "Plateforme E-learning EMSI",
      description: "Développement d'une plateforme d'apprentissage en ligne moderne et intuitive",
      image: "/img/projet1.jpg",
      owner: { username: "Yassine Zilili" },
      status: "Terminé",
      created_at: "2024-01-15"
    },
    {
      id: 2,
      title: "Application de gestion de bibliothèque",
      description: "Application web pour la gestion et l'emprunt de livres",
      image: "/img/projet2.jpg", 
      owner: { username: "Sara B." },
      status: "Terminé",
      created_at: "2024-02-20"
    }
  ];
  
  const loading = false;
  const error = null;

  // Filtrer les projets
  const filteredProjects = projects ? projects.filter((p) => {
    const matchSearch = !search || 
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.owner?.username?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Statut" || p.status === statusFilter;
    const matchCategory = categoryFilter === "Catégorie" || p.category?.name === categoryFilter;
    
    return matchSearch && matchStatus && matchCategory;
  }) : [];

  if (loading) {
    return (
      <div className="portfolio">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Chargement des projets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio">
        <div className="container">
          <div className="error-state">
            <h2>Erreur de chargement</h2>
            <p>Erreur: {error}</p>
            <button onClick={retry} className="retry-button">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vérifier si projects existe et a une structure valide
  const projectsList = projects || [];
  const projectsCount = projects.length;

  return (
    <div className="portfolio-hero-page">
      {/* Header du portfolio */}
      <div className="portfolio-hero-header">
        <div className="portfolio-hero-avatar">
          <img src={profileData.photo} alt={profileData.name} />
        </div>
        <div className="portfolio-hero-content">
          <h1>{profileData.name}</h1>
          <div className="stars">★★★★★</div>
          <p className="class">4IIR G4 Tanger</p>
          <div className="actions">
            <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-btn">LinkedIn</a>
            <a href={profileData.cv} target="_blank" rel="noopener noreferrer" className="cv-btn">CV</a>
            <button className="modifier-btn" onClick={() => setShowEditModal(true)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{marginRight: '8px'}}>
                <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z"/>
              </svg>
              Modifier
            </button>
          </div>
          <p className="description">
            {profileData.description}
          </p>
          <div className="skills">
            <span className="label">Compétences :</span>
            <div className="skill-tags">
              {profileData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
          <div className="languages">
            <span className="label">Langues :</span>
            <div className="language-tags">
              {profileData.languages.map((language, index) => (
                <span key={index} className="language-tag">{language}</span>
              ))}
            </div>
          </div>
          </div>
        </div>

      {/* Contenu principal */}
      <div className="portfolio-hero-content-main">
        <div className="portfolio-sections">
          {/* Section Projets réalisés */}
          <div className="section-left">
            <h2>Projets réalisés</h2>
            <div className="portfolio-hero-projects-list">
              <div className="project-item">
                <img src="https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Plateforme E-learning EMSI" />
                <div className="project-info">
                  <h3>Plateforme E-learning EMSI</h3>
                  <p>Développement d'une plateforme d'apprentissage en ligne moderne et intuitive pour les étudiants EMSI.</p>
                </div>
              </div>
              <div className="project-item">
                <img src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Application de gestion de bibliothèque" />
                <div className="project-info">
                  <h3>Application de gestion de bibliothèque</h3>
                  <p>Application web pour la gestion et l'emprunt de livres avec interface administrateur complète.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Commentaires */}
          <div className="section-right">
            <h2>Commentaires</h2>
            <div className="comments-list">
              <div className="comment-item">
                <div className="comment-header">
                  <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Sara B." className="comment-avatar" />
                  <div className="comment-info">
                    <h4>Sara B.</h4>
                    <p className="comment-project">Projet : Plateforme E-learning EMSI</p>
                    <p className="comment-text">Super travail, très professionnel !</p>
                    <p className="comment-date">2024-06-01</p>
                    <div className="comment-stars">★★★★★</div>
                  </div>
                </div>
                  </div>
              <div className="comment-item">
                <div className="comment-header">
                  <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Mohamed K." className="comment-avatar" />
                  <div className="comment-info">
                    <h4>Mohamed K.</h4>
                    <p className="comment-project">Projet : Application de gestion de bibliothèque</p>
                    <p className="comment-text">Toujours à l'écoute et force de proposition.</p>
                    <p className="comment-date">2024-05-28</p>
                    <div className="comment-stars">★★★★★</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'édition */}
      {showEditModal && (
        <div className="edit-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="edit-modal-modern" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header-modern">
              <div className="header-content">
                <div className="header-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1V3H9V1L3 7V9H21M12 8C13.66 8 15 9.34 15 11V12H21V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V12H9V11C9 9.34 10.34 8 12 8Z"/>
                  </svg>
                </div>
                <div className="header-text">
                  <h2>Modifier mon profil</h2>
                  <p>Personnalisez vos informations professionnelles</p>
                </div>
              </div>
              <button className="close-btn-modern" onClick={() => setShowEditModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                </button>
            </div>
            
            <div className="edit-modal-content-modern">
              <form onSubmit={(e) => {
                e.preventDefault();
                setShowEditModal(false);
              }}>
                <div className="form-sections">
                  {/* Section Photo */}
                  <div className="form-section">
                    <h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1V3H9V1L3 7V9H21Z"/>
                      </svg>
                      Photo de profil
                    </h3>
                    <div className="photo-upload-container">
                      <div className="current-photo">
                        <img src={profileData.photo} alt="Photo actuelle" />
                      </div>
                      <div className="upload-controls">
                        <input
                          type="file"
                          id="photo-upload"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e.target.files[0], 'photo')}
                          style={{display: 'none'}}
                        />
                        <label htmlFor="photo-upload" className="upload-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                          </svg>
                          Choisir une photo
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Section Description */}
                  <div className="form-section">
                    <h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"/>
                      </svg>
                      Description professionnelle
                    </h3>
                    <div className="form-group-modern">
                      <textarea
                        value={profileData.description}
                        onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                        placeholder="Décrivez votre parcours et vos objectifs..."
                        rows="4"
                      />
                    </div>
                  </div>

                  {/* Section Liens */}
                  <div className="form-section">
                    <h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10.59,13.41C11,13.8 11,14.4 10.59,14.81C10.2,15.2 9.6,15.2 9.19,14.81L7.77,13.39L6.34,14.83L7.76,16.25C8.54,17.03 8.54,18.29 7.76,19.07C6.98,19.85 5.72,19.85 4.94,19.07L3.53,17.66L2.11,19.07L3.53,20.49C5.07,22.03 7.63,22.03 9.17,20.49C10.71,18.95 10.71,16.39 9.17,14.85L7.76,13.44L9.19,12L10.59,13.41M13.41,9.17C14.19,8.39 15.45,8.39 16.23,9.17L17.64,10.59L19.07,9.17L17.66,7.76C16.12,6.22 13.56,6.22 12.02,7.76C10.48,9.3 10.48,11.86 12.02,13.4L13.43,14.81L14.83,13.4L13.41,9.17M15.5,4L14.09,5.41L15.5,6.83L16.91,5.41L15.5,4M13.41,5.83L12,7.25L13.41,8.66L14.83,7.25L13.41,5.83Z"/>
                      </svg>
                      Liens professionnels
                    </h3>
                    <div className="links-grid">
                      <div className="form-group-modern">
                        <label>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19S5.19 5.95 5.19 6.88A1.69 1.69 0 0 0 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/>
                          </svg>
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                          placeholder="https://linkedin.com/in/votre-profil"
                        />
                      </div>
                      <div className="form-group-modern">
                        <label>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                          </svg>
                          CV (Fichier)
                        </label>
                        <div className="file-upload-wrapper">
                          <input
                            type="file"
                            id="cv-upload"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload(e.target.files[0], 'cv')}
                            style={{display: 'none'}}
                          />
                          <label htmlFor="cv-upload" className="file-upload-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                            Télécharger CV
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section Compétences */}
                  <div className="form-section">
                    <h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
                      </svg>
                      Compétences techniques
                    </h3>
                    <div className="form-group-modern">
                      <input
                        type="text"
                        value={profileData.skills.join(', ')}
                        onChange={(e) => setProfileData({...profileData, skills: e.target.value.split(', ').filter(s => s.trim())})}
                        placeholder="React, Node.js, Python, UI/UX..."
                      />
                      <small>Séparez les compétences par des virgules</small>
                    </div>
              </div>
              
                  {/* Section Langues */}
                  <div className="form-section">
                    <h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07ZM18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z"/>
                      </svg>
                      Langues parlées
                    </h3>
                    <div className="form-group-modern">
                      <input
                        type="text"
                        value={profileData.languages.join(', ')}
                        onChange={(e) => setProfileData({...profileData, languages: e.target.value.split(', ').filter(s => s.trim())})}
                        placeholder="Français, Anglais, Arabe..."
                      />
                      <small>Séparez les langues par des virgules</small>
                    </div>
                  </div>
                </div>

                <div className="form-actions-modern">
                  <button type="button" className="cancel-btn-modern" onClick={() => setShowEditModal(false)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Annuler
                  </button>
                  <button type="submit" className="save-btn-modern">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"/>
                    </svg>
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Portfolio; 