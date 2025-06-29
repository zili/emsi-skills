import React, { useState, useEffect } from "react";
import "./Candidature.scss";
import apiService from "../services/api";

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
  const [error, setError] = useState(null);

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
      category: "IT",
      owner: {
        full_name: "Lions Tanger",
        first_name: "Lions",
        last_name: "Tanger"
      }
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
      category: "Art",
      owner: {
        full_name: "Ahmed Bennani",
        first_name: "Ahmed",
        last_name: "Bennani"
      }
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
      category: "Bénévole",
      owner: {
        full_name: "Club Étudiant EMSI",
        first_name: "Club",
        last_name: "Étudiant"
      }
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
      category: "IT",
      owner: {
        full_name: "Fatima Idrissi",
        first_name: "Fatima",
        last_name: "Idrissi"
      }
    }
    }
  ];

  // Fonction pour récupérer les candidatures depuis l'API
  const fetchCandidatures = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Récupération des candidatures depuis l\'API...');
      
      // Utiliser l'ApiService au lieu de fetch direct
      const data = await apiService.getCandidatures();
      console.log('✅ Candidatures API récupérées:', data);
      
      // Vérifier et adapter le format des données
      let candidaturesList = [];
      
      if (Array.isArray(data)) {
        candidaturesList = data;
      } else if (data && Array.isArray(data.results)) {
        // Format paginé Django REST Framework
        candidaturesList = data.results;
      } else if (data && data.candidatures && Array.isArray(data.candidatures)) {
        // Format avec wrapper
        candidaturesList = data.candidatures;
      } else {
        console.warn('⚠️ Format de données inattendu:', typeof data, data);
        throw new Error('Format de données inattendu de l\'API');
      }
      
      // Adapter le format des candidatures pour correspondre au frontend
      const adaptedCandidatures = candidaturesList.map(c => ({
        id: c.id,
        status: c.status,
        cover_letter: c.cover_letter,
        applied_at: c.applied_at,
        updated_at: c.updated_at || c.applied_at,
        proposed_budget: c.proposed_budget,
        proposed_timeline: c.proposed_timeline,
        relevant_experience: c.relevant_experience,
        rejection_reason: c.rejection_reason,
        project: {
          id: c.project?.id,
          title: c.project?.title,
          category: c.project?.category,
          client: c.project?.client
        }
      }));
      
      setCandidatures(adaptedCandidatures);
      console.log(`📊 ${adaptedCandidatures.length} candidatures chargées et adaptées depuis l'API`);
      
      setLoading(false);
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des candidatures:', error);
      setError(error.message);
      
      // En cas d'erreur, utiliser les données mockées comme fallback
      console.log('⚠️ Utilisation des données mockées comme fallback');
      setCandidatures(mockCandidatures);
      setLoading(false);
    }
  };

  // Fonction pour retirer une candidature
  const handleWithdrawCandidature = async (candidatureId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir retirer cette candidature ?')) {
      return;
    }

    try {
      console.log('🔄 Retrait de la candidature:', candidatureId);
      
      // Utiliser l'ApiService au lieu de fetch direct
      await apiService.withdrawCandidature(candidatureId);
      console.log('✅ Candidature retirée avec succès');
      
      // Recharger la liste des candidatures
      fetchCandidatures();
      alert('Candidature retirée avec succès');
      
    } catch (error) {
      console.error('❌ Erreur lors du retrait de la candidature:', error);
      
             // Simulation locale en cas d'erreur API (pour les données mockées)
       if (error.message.includes('401') || error.message.includes('token')) {
         console.log('⚠️ Simulation du retrait pour les données mockées');
         const updatedCandidatures = (candidatures || []).filter(c => c.id !== candidatureId);
         setCandidatures(updatedCandidatures);
         alert('Candidature retirée avec succès (simulation)');
       } else {
         alert('❌ Erreur lors du retrait de la candidature. Veuillez réessayer.');
       }
    }
  };

  useEffect(() => {
    fetchCandidatures();
  }, []);

  // Créer la liste des dates disponibles
  const dates = ["Année", ...Array.from(new Set((candidatures || []).map(c => 
    c.applied_at ? new Date(c.applied_at).getFullYear().toString() : '2024'
  )))];

  // Filtrer les candidatures
  const filteredCandidatures = (candidatures || []).filter((c) => {
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
      
      {/* Statistiques */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{(candidatures || []).length}</p>
        </div>
        <div className="stat-card accepted">
          <h3>Acceptées</h3>
          <p>{(candidatures || []).filter(c => c.status === 'accepted').length}</p>
        </div>
        <div className="stat-card pending">
          <h3>En attente</h3>
          <p>{(candidatures || []).filter(c => c.status === 'pending').length}</p>
        </div>
        <div className="stat-card rejected">
          <h3>Refusées</h3>
          <p>{(candidatures || []).filter(c => c.status === 'rejected').length}</p>
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
        {error && (
          <div className="error-message" style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <h4>Erreur de chargement</h4>
            <p>{error}</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              💡 Les données affichées ci-dessous sont des exemples de démonstration.
            </p>
          </div>
        )}
        
        {filteredCandidatures.length === 0 ? (
          <div className="no-candidatures">
            <p>
              {(candidatures || []).length === 0 
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
                    {candidature.project?.client?.full_name 
                      ? `Proposé par: ${candidature.project.client.full_name}`
                      : candidature.project?.client?.first_name 
                        ? `Proposé par: ${candidature.project.client.first_name} ${candidature.project.client.last_name || ''}`
                        : `Projet #${candidature.project?.id || 'N/A'}`}
                  </p>
                </div>
                <div className="candidature-status">
                  <span className={`status-badge ${candidature.status?.toLowerCase().replace(/\s+/g, '-') || 'pending'}`}>
                    {statusLabels[candidature.status] || candidature.status}
                  </span>
                </div>
              </div>
              
              <div className="candidature-body">
                <div className="candidature-meta">
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