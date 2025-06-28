import React, { useState } from "react";
import "./Candidature.scss";

const categories = ["Catégorie", "IT", "Art", "Bénévole", "Civil"];
const statuts = ["Décision", "En attente", "Accepté", "Refusé"];

// Données mockées pour les candidatures
const mockCandidatures = [
  {
    id: 1,
    status: "En attente",
    message: "Je suis très intéressé par ce projet. J'ai 3 ans d'expérience en développement web et je pense pouvoir apporter une vraie valeur ajoutée à votre équipe.",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    project: {
      id: 1,
      title: "Développement d'une application mobile",
      description: "Nous cherchons un développeur pour créer une application mobile innovante pour la gestion des tâches quotidiennes.",
      budget: 2500,
      skills: "React Native, JavaScript, UI/UX",
      category: { name: "IT" },
      owner: { username: "sarah_dev" }
    }
  },
  {
    id: 2,
    status: "Accepté",
    message: "Bonjour, j'aimerais participer à ce projet de design. Voici mon portfolio avec mes réalisations précédentes.",
    created_at: "2024-01-10T14:20:00Z",
    updated_at: "2024-01-12T09:15:00Z",
    project: {
      id: 2,
      title: "Refonte graphique d'un site web",
      description: "Modernisation complète de l'identité visuelle et de l'interface utilisateur de notre site e-commerce.",
      budget: 1800,
      skills: "Figma, Photoshop, UI/UX Design",
      category: { name: "Art" },
      owner: { username: "design_pro" }
    }
  },
  {
    id: 3,
    status: "Refusé",
    message: "Je souhaite contribuer à cette cause qui me tient à cœur. J'ai de l'expérience en organisation d'événements caritatifs.",
    created_at: "2024-01-05T16:45:00Z",
    updated_at: "2024-01-08T11:30:00Z",
    project: {
      id: 3,
      title: "Organisation d'un événement caritatif",
      description: "Recherche de bénévoles pour organiser un événement de collecte de fonds pour les enfants défavorisés.",
      budget: 0,
      skills: "Organisation, Communication, Marketing",
      category: { name: "Bénévole" },
      owner: { username: "charity_org" }
    }
  },
  {
    id: 4,
    status: "En attente",
    message: "Ingénieur civil avec 5 ans d'expérience, je suis disponible pour ce projet de construction.",
    created_at: "2024-01-20T08:15:00Z",
    updated_at: "2024-01-20T08:15:00Z",
    project: {
      id: 4,
      title: "Supervision de travaux de construction",
      description: "Nous recherchons un ingénieur civil expérimenté pour superviser la construction d'un complexe résidentiel.",
      budget: 5000,
      skills: "Génie Civil, AutoCAD, Gestion de projet",
      category: { name: "Civil" },
      owner: { username: "construction_co" }
    }
  }
];

const Candidature = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Décision");
  const [categoryFilter, setCategoryFilter] = useState("Catégorie");
  const [dateFilter, setDateFilter] = useState("Année");

  // Utiliser les données mockées
  const candidatures = mockCandidatures;

  // Créer la liste des dates disponibles
  const dates = ["Année", ...Array.from(new Set(candidatures.map(c => 
    c.created_at ? new Date(c.created_at).getFullYear().toString() : '2024'
  )))];

  // Filtrer les candidatures
  const filteredCandidatures = candidatures.filter((c) => {
    const matchSearch = !search || 
      c.project?.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.project?.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.message?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Décision" || c.status === statusFilter;
    const matchCategory = categoryFilter === "Catégorie" || c.project?.category?.name === categoryFilter;
    const matchDate = dateFilter === "Année" || 
      (c.created_at && new Date(c.created_at).getFullYear().toString() === dateFilter);
    
    return matchSearch && matchStatus && matchCategory && matchDate;
  });

  return (
    <div className="candidature-container">
      <h1 className="candidature-title">Mes Candidatures</h1>
      
      {/* Statistiques */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{candidatures.length}</p>
        </div>
        <div className="stat-card accepted">
          <h3>Acceptées</h3>
          <p>{candidatures.filter(c => c.status === 'Accepté').length}</p>
        </div>
        <div className="stat-card pending">
          <h3>En attente</h3>
          <p>{candidatures.filter(c => c.status === 'En attente').length}</p>
        </div>
        <div className="stat-card rejected">
          <h3>Refusées</h3>
          <p>{candidatures.filter(c => c.status === 'Refusé').length}</p>
        </div>
      </div>
      
      {/* Filtres */}
      <div className="candidature-filters">
        <input 
          type="text" 
          placeholder="Rechercher une candidature..." 
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

      {/* Liste des candidatures */}
      <div className="candidatures-list">
        {filteredCandidatures.length === 0 ? (
          <div className="no-candidatures">
            <p>
              {candidatures.length === 0 
                ? "Vous n'avez encore soumis aucune candidature" 
                : "Aucune candidature ne correspond aux filtres sélectionnés"
              }
            </p>
          </div>
        ) : (
          filteredCandidatures.map((candidature) => (
            <div key={candidature.id} className="candidature-card">
              <div className="candidature-header">
                <div className="project-info">
                  <h3>{candidature.project?.title || 'Projet sans titre'}</h3>
                  <p className="project-owner">
                    Par {candidature.project?.owner?.username || 'Utilisateur inconnu'}
                  </p>
                </div>
                <div className="candidature-status">
                  <span className={`status-badge ${candidature.status?.toLowerCase().replace(/\s+/g, '-') || 'en-attente'}`}>
                    {candidature.status || 'En attente'}
                  </span>
                </div>
              </div>
              
              <div className="candidature-body">
                <div className="project-description">
                  <h4>Description du projet:</h4>
                  <p>{candidature.project?.description || 'Aucune description disponible'}</p>
                </div>
                
                <div className="candidature-meta">
                  <div className="meta-item">
                    <strong>Catégorie:</strong> {candidature.project?.category?.name || 'Non définie'}
                  </div>
                  <div className="meta-item">
                    <strong>Candidature soumise le:</strong> {
                      candidature.created_at 
                        ? new Date(candidature.created_at).toLocaleDateString('fr-FR')
                        : 'Date inconnue'
                    }
                  </div>
                  {candidature.updated_at && candidature.updated_at !== candidature.created_at && (
                    <div className="meta-item">
                      <strong>Dernière mise à jour:</strong> {
                        new Date(candidature.updated_at).toLocaleDateString('fr-FR')
                      }
                    </div>
                  )}
                </div>
                
                {candidature.project?.skills && (
                  <div className="project-skills">
                    <h4>Compétences requises:</h4>
                    <div className="skills-list">
                      {candidature.project.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="skill-tag">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="candidature-actions">
                {candidature.status === 'En attente' && (
                    <button className="withdraw-btn">
                      Retirer la candidature
                    </button>
                )}
                {candidature.status === 'Accepté' && (
                  <button className="contact-btn">
                    Contacter le propriétaire
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Candidature; 