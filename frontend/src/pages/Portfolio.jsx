import React, { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import "./Portfolio.scss";

const categories = ["Catégorie", "IT", "Art", "Bénévole", "Civil"];
const statuts = ["Statut", "Terminé", "En cours", "En attente"];

const Portfolio = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Statut");
  const [categoryFilter, setCategoryFilter] = useState("Catégorie");
  const [selectedProject, setSelectedProject] = useState(null);

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = !!localStorage.getItem('accessToken');

  // Charger tous les projets - DOIT être avant useEffect
  const { data: projects, loading, error, retry } = useApi('/api/projects/');

  // Debug: Afficher les informations d'authentification
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('🔍 Portfolio Debug Info:');
    console.log('- Token présent:', !!token);
    console.log('- Token:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('- Projects loading:', loading);
    console.log('- Projects error:', error);
    console.log('- Projects data:', projects);
  }, [loading, error, projects]);

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

  // Si l'utilisateur n'est pas connecté, afficher un message de connexion requise
  if (!isAuthenticated) {
    return (
      <div className="portfolio">
        <div className="container">
          <div className="auth-required">
            <div className="auth-icon">🔒</div>
            <h2>Connexion requise</h2>
            <p>Vous devez être connecté pour accéder au portfolio des projets.</p>
            <p>Le portfolio contient des informations privées réservées aux membres de la communauté EMSI.</p>
            <div className="auth-actions">
              <a href="/login" className="login-btn">Se connecter</a>
              <a href="/register" className="register-btn">S'inscrire</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    // Si erreur 401, rediriger vers la connexion
    if (error.includes('401') || error.includes('Authentication')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return null;
    }

    return (
      <div className="portfolio">
        <div className="container">
          <div className="error-state">
            <h2>Erreur de chargement</h2>
            <p>Erreur: {error}</p>
            <div className="debug-info">
              <h3>Informations de débogage:</h3>
              <p>Token: {localStorage.getItem('accessToken') ? 'Présent' : 'Absent'}</p>
              <p>URL API: /api/projects/</p>
            </div>
            <button onClick={retry} className="retry-button">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vérifier si projects existe et a une structure valide
  const projectsList = projects?.results || [];
  const projectsCount = projects?.count || 0;

  return (
    <div className="portfolio">
      <div className="container">
        <div className="portfolio-header">
          <h1>Portfolio Privé</h1>
          <p>Projets exclusifs réservés aux membres de la communauté EMSI</p>
          <div className="stats">
            <span className="stat-item">
              <strong>{projectsCount}</strong> projets disponibles
            </span>
            <span className="stat-item">
              <strong>👤</strong> Accès membre
            </span>
          </div>
        </div>

        {projectsList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h2>Aucun projet disponible</h2>
            <p>Il n'y a actuellement aucun projet privé à afficher.</p>
            <p>Les projets apparaîtront ici une fois qu'ils seront créés par les membres.</p>
            <div className="debug-info">
              <h3>Informations techniques:</h3>
              <p>Réponse API: {JSON.stringify(projects, null, 2)}</p>
            </div>
          </div>
        ) : (
          <div className="projects-grid">
            {projectsList.map((project) => (
              <div key={project.id} className="project-card private">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <div className="project-badges">
                    <span className={`status ${project.status}`}>
                      {project.status}
                    </span>
                    <span className="private-badge">🔒 Privé</span>
                  </div>
                </div>
                
                <p className="project-description">
                  {project.description}
                </p>
                
                <div className="project-details">
                  <div className="detail-item">
                    <span className="label">Budget:</span>
                    <span className="value">{project.budget_range}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Durée:</span>
                    <span className="value">{project.estimated_duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Compétences:</span>
                    <span className="value">{project.required_skills}</span>
                  </div>
                </div>
                
                <button 
                  className="view-details-btn"
                  onClick={() => setSelectedProject(project)}
                >
                  Voir détails
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal pour les détails du projet */}
        {selectedProject && (
          <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedProject.title}</h2>
                <div className="modal-badges">
                  <span className="private-badge">🔒 Projet Privé</span>
                </div>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedProject(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <p><strong>Description:</strong> {selectedProject.description}</p>
                <p><strong>Budget:</strong> {selectedProject.budget_range}</p>
                <p><strong>Durée estimée:</strong> {selectedProject.estimated_duration}</p>
                <p><strong>Compétences requises:</strong> {selectedProject.required_skills}</p>
                <p><strong>Statut:</strong> {selectedProject.status}</p>
                {selectedProject.created_at && (
                  <p><strong>Créé le:</strong> {new Date(selectedProject.created_at).toLocaleDateString()}</p>
                )}
                <div className="privacy-notice">
                  <p><strong>⚠️ Confidentialité:</strong> Ce projet est privé et réservé aux membres authentifiés.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio; 