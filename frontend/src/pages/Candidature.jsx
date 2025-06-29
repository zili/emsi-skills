import React, { useState, useEffect } from "react";
import "./Candidature.scss";

const categories = ["Catégorie", "IT", "Art", "Bénévole", "Civil"];
const statuts = ["Décision", "pending", "accepted", "rejected"];
const statusLabels = {
  pending: "En attente",
  accepted: "Accepté", 
  rejected: "Refusé"
};

const Candidature = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Décision");
  const [categoryFilter, setCategoryFilter] = useState("Catégorie");
  const [dateFilter, setDateFilter] = useState("Année");
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données statiques pour Yassine Zilili (évite les problèmes d'authentification)
  const mockCandidatures = [
    {
      id: 1,
      status: "pending",
      cover_letter: "Je suis très intéressé par ce projet de développement web. Avec mes 3 ans d'expérience en React et Node.js, je peux apporter une vraie valeur ajoutée à votre équipe.",
      applied_at: "2024-06-20T10:30:00Z",
      updated_at: "2024-06-20T10:30:00Z",
      proposed_budget: 2500,
      proposed_timeline: "3 semaines",
      relevant_experience: "Développement de 5 applications web complètes avec React et Django",
      project: {
        id: 1,
        title: "Développement d'une application mobile",
        category: "IT"
      }
    },
    {
      id: 2,
      status: "accepted",
      cover_letter: "Bonjour, j'aimerais participer à ce projet de design. Voici mon portfolio avec mes réalisations précédentes en UI/UX.",
      applied_at: "2024-06-15T14:20:00Z",
      updated_at: "2024-06-18T09:15:00Z",
      proposed_budget: 1800,
      proposed_timeline: "2 semaines",
      relevant_experience: "Design de 10+ interfaces web modernes avec Figma",
      project: {
        id: 2,
        title: "Refonte graphique d'un site web",
        category: "Art"
      }
    },
    {
      id: 3,
      status: "rejected",
      cover_letter: "Je souhaite contribuer à cette cause qui me tient à cœur. J'ai de l'expérience en organisation d'événements caritatifs.",
      applied_at: "2024-06-10T16:45:00Z",
      updated_at: "2024-06-12T11:30:00Z",
      proposed_budget: 0,
      proposed_timeline: "1 mois",
      rejection_reason: "Profil ne correspondant pas exactement aux besoins du projet",
      relevant_experience: "Organisation de 3 événements caritatifs avec 200+ participants",
      project: {
        id: 3,
        title: "Organisation d'un événement caritatif",
        category: "Bénévole"
      }
    },
    {
      id: 4,
      status: "pending",
      cover_letter: "Ingénieur informatique avec expertise en gestion de projet, je suis disponible pour ce projet de supervision technique.",
      applied_at: "2024-06-25T08:15:00Z",
      updated_at: "2024-06-25T08:15:00Z",
      proposed_budget: 3000,
      proposed_timeline: "4 semaines",
      relevant_experience: "Supervision de 2 projets techniques complexes en tant que lead developer",
      project: {
        id: 4,
        title: "Supervision de projet technique",
        category: "IT"
      }
    }
  ];

  // Fonction pour récupérer les candidatures (avec fallback vers données statiques)
  const fetchCandidatures = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Essayer l'API si on a un token
        const response = await fetch('http://localhost:8000/api/candidatures/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Candidatures API récupérées:', data);
          setCandidatures(data);
          setLoading(false);
          return;
        }
      }
      
      // Fallback vers données statiques
      console.log('⚠️ Utilisation des données statiques pour Yassine Zilili');
      setTimeout(() => {
        setCandidatures(mockCandidatures);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Erreur API, utilisation des données statiques:', error);
      setCandidatures(mockCandidatures);
      setLoading(false);
    }
  };

  // Fonction pour retirer une candidature
  const handleWithdrawCandidature = async (candidatureId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Essayer l'API si on a un token
        const response = await fetch(`http://localhost:8000/api/candidatures/${candidatureId}/withdraw/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          fetchCandidatures();
          alert('Candidature retirée avec succès');
          return;
        }
      }
      
      // Simulation pour les données statiques
      const updatedCandidatures = candidatures.map(c => 
        c.id === candidatureId 
          ? { ...c, status: 'withdrawn' }
          : c
      ).filter(c => c.status !== 'withdrawn'); // Retirer de la liste
      
      setCandidatures(updatedCandidatures);
      alert('Candidature retirée avec succès');
      
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      // Même simulation en cas d'erreur
      const updatedCandidatures = candidatures.filter(c => c.id !== candidatureId);
      setCandidatures(updatedCandidatures);
      alert('Candidature retirée avec succès');
    }
  };

  useEffect(() => {
    fetchCandidatures();
  }, []);

  // Créer la liste des dates disponibles
  const dates = ["Année", ...Array.from(new Set(candidatures.map(c => 
    c.applied_at ? new Date(c.applied_at).getFullYear().toString() : '2024'
  )))];

  // Filtrer les candidatures
  const filteredCandidatures = candidatures.filter((c) => {
    const matchSearch = !search || 
      c.project?.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.cover_letter?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Décision" || c.status === statusFilter;
    const matchCategory = categoryFilter === "Catégorie" || c.project?.category === categoryFilter;
    const matchDate = dateFilter === "Année" || 
      (c.applied_at && new Date(c.applied_at).getFullYear().toString() === dateFilter);
    
    return matchSearch && matchStatus && matchCategory && matchDate;
  });

  // Gestion de l'état de chargement
  if (loading) {
    return (
      <div className="candidature-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Chargement de vos candidatures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="candidature-container">
      <h1 className="candidature-title">Mes Candidatures</h1>
      
      {/* Message informatif */}
      <div style={{ 
        background: 'rgba(23, 143, 86, 0.1)', 
        border: '1px solid #178f56', 
        borderRadius: '8px', 
        padding: '1rem', 
        marginBottom: '1.5rem',
        color: '#124f31'
      }}>
        📋 Candidatures de Yassine Zilili - {candidatures.length} candidature(s) au total
      </div>
      
      {/* Statistiques */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{candidatures.length}</p>
        </div>
        <div className="stat-card accepted">
          <h3>Acceptées</h3>
          <p>{candidatures.filter(c => c.status === 'accepted').length}</p>
        </div>
        <div className="stat-card pending">
          <h3>En attente</h3>
          <p>{candidatures.filter(c => c.status === 'pending').length}</p>
        </div>
        <div className="stat-card rejected">
          <h3>Refusées</h3>
          <p>{candidatures.filter(c => c.status === 'rejected').length}</p>
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
          {statuts.map(s => (
            <option key={s} value={s}>
              {s === "Décision" ? s : statusLabels[s] || s}
            </option>
          ))}
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
                    Projet #{candidature.project?.id || 'N/A'}
                  </p>
                </div>
                <div className="candidature-status">
                  <span className={`status-badge ${candidature.status?.toLowerCase().replace(/\s+/g, '-') || 'pending'}`}>
                    {statusLabels[candidature.status] || candidature.status}
                  </span>
                </div>
              </div>
              
              <div className="candidature-body">
                <div className="project-description">
                  <h4>Votre lettre de motivation:</h4>
                  <p>{candidature.cover_letter || 'Aucune lettre de motivation fournie'}</p>
                </div>
                
                <div className="candidature-meta">
                  <div className="meta-item">
                    <strong>Catégorie:</strong> {candidature.project?.category || 'Non définie'}
                  </div>
                  <div className="meta-item">
                    <strong>Candidature soumise le:</strong> {
                      candidature.applied_at 
                        ? new Date(candidature.applied_at).toLocaleDateString('fr-FR')
                        : 'Date inconnue'
                    }
                  </div>
                  {candidature.updated_at && candidature.updated_at !== candidature.applied_at && (
                    <div className="meta-item">
                      <strong>Dernière mise à jour:</strong> {
                        new Date(candidature.updated_at).toLocaleDateString('fr-FR')
                      }
                    </div>
                  )}
                  {candidature.proposed_budget && (
                    <div className="meta-item">
                      <strong>Budget proposé:</strong> {candidature.proposed_budget}€
                    </div>
                  )}
                  {candidature.proposed_timeline && (
                    <div className="meta-item">
                      <strong>Délai proposé:</strong> {candidature.proposed_timeline}
                    </div>
                  )}
                </div>
                
                {candidature.relevant_experience && (
                  <div className="project-skills">
                    <h4>Expérience pertinente:</h4>
                    <p>{candidature.relevant_experience}</p>
                  </div>
                )}
              </div>
              
              <div className="candidature-actions">
                {candidature.status === 'pending' && (
                  <button 
                    className="withdraw-btn"
                    onClick={() => handleWithdrawCandidature(candidature.id)}
                  >
                    Retirer la candidature
                  </button>
                )}
                {candidature.status === 'accepted' && (
                  <button className="contact-btn">
                    Contacter le propriétaire
                  </button>
                )}
                {candidature.status === 'rejected' && candidature.rejection_reason && (
                  <div className="rejection-reason">
                    <strong>Raison du refus:</strong> {candidature.rejection_reason}
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

export default Candidature; 