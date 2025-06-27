import React, { useState } from "react";
import { useCandidatures } from "../hooks/useApi";
import "./Candidature.scss";

const categories = ["Catégorie", "IT", "Art", "Bénévole", "Civil"];
const statuts = ["Décision", "En attente", "Accepté", "Refusé"];

const Candidature = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Décision");
  const [categoryFilter, setCategoryFilter] = useState("Catégorie");
  const [dateFilter, setDateFilter] = useState("Année");

  // Charger les candidatures de l'utilisateur connecté
  const { data: candidatures, loading, error } = useCandidatures({ my_candidatures: true });

  // Créer la liste des dates disponibles
  const dates = candidatures ? ["Année", ...Array.from(new Set(candidatures.map(c => 
    c.created_at ? new Date(c.created_at).getFullYear().toString() : '2024'
  )))] : ["Année"];

  // Filtrer les candidatures
  const filteredCandidatures = candidatures ? candidatures.filter((c) => {
    const matchSearch = !search || 
      c.project?.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.project?.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.message?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Décision" || c.status === statusFilter;
    const matchCategory = categoryFilter === "Catégorie" || c.project?.category?.name === categoryFilter;
    const matchDate = dateFilter === "Année" || 
      (c.created_at && new Date(c.created_at).getFullYear().toString() === dateFilter);
    
    return matchSearch && matchStatus && matchCategory && matchDate;
  }) : [];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Chargement de vos candidatures...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <p>Erreur: {error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="candidature-container">
      <h1 className="candidature-title">Mes Candidatures</h1>
      
      {/* Statistiques */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{candidatures?.length || 0}</p>
        </div>
        <div className="stat-card accepted">
          <h3>Acceptées</h3>
          <p>{candidatures?.filter(c => c.status === 'Accepté').length || 0}</p>
        </div>
        <div className="stat-card pending">
          <h3>En attente</h3>
          <p>{candidatures?.filter(c => c.status === 'En attente').length || 0}</p>
        </div>
        <div className="stat-card rejected">
          <h3>Refusées</h3>
          <p>{candidatures?.filter(c => c.status === 'Refusé').length || 0}</p>
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
              {candidatures?.length === 0 
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
                
                <div className="candidature-message">
                  <h4>Votre message:</h4>
                  <p>{candidature.message || 'Aucun message fourni'}</p>
                </div>
                
                <div className="candidature-meta">
                  <div className="meta-item">
                    <strong>Catégorie:</strong> {candidature.project?.category?.name || 'Non définie'}
                  </div>
                  {candidature.project?.budget && (
                    <div className="meta-item">
                      <strong>Budget:</strong> {candidature.project.budget}€
                    </div>
                  )}
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
                  <>
                    <button className="edit-btn">
                      Modifier la candidature
                    </button>
                    <button className="withdraw-btn">
                      Retirer la candidature
                    </button>
                  </>
                )}
                {candidature.status === 'Accepté' && (
                  <button className="contact-btn">
                    Contacter le propriétaire
                  </button>
                )}
                <button className="view-project-btn">
                  Voir le projet
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Candidature; 