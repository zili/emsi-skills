import React, { useState, useEffect } from "react";
import "./ProjetRealise.scss";

const categories = ["Catégorie", "IT", "Art", "Bénévole", "Civil"];
const statuts = ["Statut", "Terminé", "En cours"];

const ProjetRealise = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Statut");
  const [categoryFilter, setCategoryFilter] = useState("Catégorie");
  const [dateFilter, setDateFilter] = useState("Année");

  // Charger les projets depuis l'API
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedProjects = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setError('Vous devez être connecté pour voir vos projets réalisés');
          return;
        }

        const response = await fetch('http://localhost:8000/api/projects/my-projects/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Filtrer seulement les projets terminés
          const completedProjects = (data.results || data).filter(project => 
            project.status === 'completed' || project.admin_status === 'approved'
          );
          setProjects(completedProjects);
        } else {
          setError('Erreur lors du chargement des projets');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        setError('Erreur lors du chargement des projets');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedProjects();
  }, []);

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
          <h3>3</h3>
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