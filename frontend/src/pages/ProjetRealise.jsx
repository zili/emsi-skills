import React, { useState } from "react";
import "./ProjetRealise.scss";

const categories = ["Catégorie", "IT", "Art", "Bénévole", "Civil"];
const statuts = ["Statut", "Terminé", "En cours"];

// Données mockées pour les projets réalisés
const mockProjects = [
  {
    id: 1,
    title: "Site web e-commerce pour boutique de mode",
    description: "Développement complet d'une plateforme e-commerce avec système de paiement intégré, gestion des stocks et interface d'administration.",
    status: "Terminé",
    budget: 3500,
    skills: "React, Node.js, MongoDB, Stripe",
    rating: 5,
    created_at: "2024-01-10T09:00:00Z",
    category: { name: "IT" }
  },
  {
    id: 2,
    title: "Identité visuelle pour startup",
    description: "Création complète de l'identité visuelle : logo, charte graphique, cartes de visite, et déclinaisons digitales.",
    status: "Terminé",
    budget: 1200,
    skills: "Illustrator, Photoshop, Branding",
    rating: 4,
    created_at: "2024-01-05T14:30:00Z",
    category: { name: "Art" }
  },
  {
    id: 3,
    title: "Application mobile de fitness",
    description: "Développement d'une application mobile cross-platform pour le suivi d'entraînements et de nutrition.",
    status: "En cours",
    budget: 4200,
    skills: "React Native, Firebase, API REST",
    rating: null,
    created_at: "2024-01-20T11:15:00Z",
    category: { name: "IT" }
  },
  {
    id: 4,
    title: "Organisation d'atelier de sensibilisation",
    description: "Coordination et animation d'ateliers de sensibilisation à l'environnement dans les écoles primaires.",
    status: "Terminé",
    budget: 0,
    skills: "Animation, Pédagogie, Écologie",
    rating: 5,
    created_at: "2023-12-15T16:45:00Z",
    category: { name: "Bénévole" }
  },
  {
    id: 5,
    title: "Étude de faisabilité pont routier",
    description: "Réalisation d'une étude technique complète pour la construction d'un pont routier de 150m de portée.",
    status: "Terminé",
    budget: 8000,
    skills: "Génie Civil, AutoCAD, Calcul de structures",
    rating: 4,
    created_at: "2023-11-20T08:30:00Z",
    category: { name: "Civil" }
  }
];

const ProjetRealise = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Statut");
  const [categoryFilter, setCategoryFilter] = useState("Catégorie");
  const [dateFilter, setDateFilter] = useState("Année");

  // Utiliser les données mockées
  const projects = mockProjects;

  // Créer la liste des dates disponibles
  const dates = ["Année", ...Array.from(new Set(projects.map(p => 
    p.created_at ? new Date(p.created_at).getFullYear().toString() : '2024'
  )))];

  // Filtrer les projets
  const filteredProjects = projects.filter((p) => {
    const matchSearch = !search || 
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Statut" || p.status === statusFilter;
    const matchCategory = categoryFilter === "Catégorie" || p.category?.name === categoryFilter;
    const matchDate = dateFilter === "Année" || 
      (p.created_at && new Date(p.created_at).getFullYear().toString() === dateFilter);
    
    return matchSearch && matchStatus && matchCategory && matchDate;
  });

    return (
    <div className="projet-realise-container">
      <h1 className="projet-realise-title">Mes Projets Réalisés</h1>
      
      {/* Statistiques */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>{projects.length}</h3>
          <p>Projets total</p>
        </div>
        <div className="stat-card completed">
          <h3>{projects.filter(p => p.status === 'Terminé').length}</h3>
          <p>Terminés</p>
        </div>
        <div className="stat-card in-progress">
          <h3>{projects.filter(p => p.status === 'En cours').length}</h3>
          <p>En cours</p>
        </div>
        <div className="stat-card rating">
          <h3>
            {(projects.filter(p => p.rating).reduce((acc, p) => acc + p.rating, 0) / projects.filter(p => p.rating).length || 0).toFixed(1)}
          </h3>
          <p>Note moyenne</p>
      </div>
      </div>
      
      {/* Filtres */}
      <div className="projet-realise-filters">
        <input 
          type="text" 
          placeholder="Rechercher un projet..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          {statuts.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select 
          value={categoryFilter} 
          onChange={e => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select 
          value={dateFilter} 
          onChange={e => setDateFilter(e.target.value)}
          className="filter-select"
        >
          {dates.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Liste des projets */}
      <div className="projets-list">
        {filteredProjects.length === 0 ? (
          <div className="no-projets">
            <p>
              {projects.length === 0 
                ? "Vous n'avez encore réalisé aucun projet" 
                : "Aucun projet ne correspond aux filtres sélectionnés"
              }
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="projet-card">
              <div className="projet-header">
                <div className="projet-info">
                  <h3>{project.title || 'Projet sans titre'}</h3>
                </div>
                <div className="projet-status">
                  <span className={`status-badge ${project.status?.toLowerCase().replace(/\s+/g, '-') || 'en-cours'}`}>
                    {project.status || 'En cours'}
                  </span>
                </div>
                </div>
                
              <div className="projet-body">
                <div className="projet-description">
                  <p>{project.description || 'Aucune description disponible'}</p>
                </div>
                
                <div className="projet-meta">
                  {project.category && (
                    <div className="meta-item category">
                      <strong>Catégorie:</strong> {project.category.name}
                    </div>
                  )}
                  {project.created_at && (
                    <div className="meta-item date">
                      <strong>Date:</strong> {new Date(project.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                  {project.rating && (
                    <div className="meta-item rating">
                      <strong>Note:</strong> {project.rating}/5
                    </div>
                  )}
                </div>
                
                {project.skills && (
                  <div className="projet-skills">
                    <div className="skills-list">
                      {project.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="skill-tag">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjetRealise; 