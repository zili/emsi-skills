import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Demandes.scss";
import ApiService from "../services/api";

const Demandes = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projets, setProjets] = useState([]);
  const [projectCandidatures, setProjectCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [candidaturesLoading, setCandidaturesLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Charger les projets de l'utilisateur au montage du composant
  useEffect(() => {
    loadMyProjects();
  }, []);

  const loadMyProjects = async () => {
    try {
      setLoading(true);
      const response = await ApiService.request('/projects/my-projects/');
      console.log('📋 Mes projets chargés:', response);
      
      // L'API retourne un objet paginé avec results
      const projects = response.results || [];
      setProjets(projects);
      
      if (projects.length === 0) {
        console.log('ℹ️ Aucun projet trouvé pour cet utilisateur');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des projets:', error);
      setError('Erreur lors du chargement des projets');
      setProjets([]); // Assurer que projets est toujours un tableau
    } finally {
      setLoading(false);
    }
  };

  const loadProjectCandidatures = async (projectId) => {
    try {
      setCandidaturesLoading(true);
      const response = await ApiService.request(`/candidatures/project/${projectId}/`);
      console.log('📋 Candidatures chargées pour le projet:', response);
      
      // Extraire les candidatures de la réponse
      const candidatures = response.candidatures || [];
      setProjectCandidatures(Array.isArray(candidatures) ? candidatures : []);
      
      console.log(`ℹ️ ${candidatures.length} candidature(s) trouvée(s)`);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des candidatures:', error);
      setProjectCandidatures([]);
    } finally {
      setCandidaturesLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "En attente", class: "status-pending" },
      approved: { label: "Approuvé", class: "status-approved" },
      in_progress: { label: "En cours", class: "status-progress" },
      completed: { label: "Terminé", class: "status-completed" },
      cancelled: { label: "Annulé", class: "status-cancelled" },
      rejected: { label: "Rejeté", class: "status-rejected" }
    };
    return statusConfig[status] || { label: status, class: "status-default" };
  };

  const getCandidatureStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "En attente", class: "status-pending" },
      accepted: { label: "Accepté", class: "status-accepted" },
      rejected: { label: "Refusé", class: "status-refused" },
      withdrawn: { label: "Retiré", class: "status-withdrawn" }
    };
    return statusConfig[status] || { label: status, class: "status-default" };
  };

  const handleAcceptCandidature = async (candidatureId) => {
    try {
      console.log("🔄 Acceptation candidature:", candidatureId);
      await ApiService.request(`/candidatures/${candidatureId}/accept/`, {
        method: 'PATCH'
      });
      
      // Recharger les candidatures pour mettre à jour l'affichage
      if (selectedProject) {
        await loadProjectCandidatures(selectedProject.id);
      }
      
      console.log("✅ Candidature acceptée avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de l'acceptation:", error);
      alert("Erreur lors de l'acceptation de la candidature");
    }
  };

  const handleRefuseCandidature = async (candidatureId) => {
    const reason = prompt("Raison du refus (optionnel):");
    
    try {
      console.log("🔄 Refus candidature:", candidatureId);
      await ApiService.request(`/candidatures/${candidatureId}/reject/`, {
        method: 'PATCH',
        body: JSON.stringify({
          rejection_reason: reason || ''
        })
      });
      
      // Recharger les candidatures pour mettre à jour l'affichage
      if (selectedProject) {
        await loadProjectCandidatures(selectedProject.id);
      }
      
      console.log("✅ Candidature refusée avec succès");
    } catch (error) {
      console.error("❌ Erreur lors du refus:", error);
      alert("Erreur lors du refus de la candidature");
    }
  };

  const handleViewPortfolio = (candidatureId) => {
    // Trouver la candidature correspondante dans projectCandidatures
    const candidature = projectCandidatures.find(c => c.id === candidatureId);
    
    if (candidature && candidature.candidate) {
      // Naviguer vers la page portfolio avec l'ID du candidat
      navigate('/portfolio-view', { 
        state: { 
          userId: candidature.candidate.id,
          candidature: candidature,
          fromDemandes: true 
        } 
      });
    }
  };

  const handleProjectClick = async (projet) => {
    setSelectedProject(projet);
    // Charger les candidatures pour ce projet
    await loadProjectCandidatures(projet.id);
  };

  if (selectedProject) {
    return (
      <div className="demandes">
        <div className="container">
          <div className="header">
            <button className="back-btn" onClick={() => setSelectedProject(null)}>
              ← Retour aux projets
            </button>
            <div className="header-content">
              <h1>Candidatures - {selectedProject.title}</h1>
              <p>{candidaturesLoading ? 'Chargement...' : `${projectCandidatures.length} candidature(s) reçue(s)`}</p>
            </div>
          </div>

          <div className="candidatures-table-container" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
            marginTop: '20px'
          }}>
            <table className="candidatures-table" style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr>
                  <th style={{
                    background: '#f8f9fa',
                    color: '#124f31',
                    fontWeight: '600',
                    padding: '15px 12px',
                    textAlign: 'left',
                    borderBottom: '2px solid #e9ecef',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Nom</th>
                  <th style={{
                    background: '#f8f9fa',
                    color: '#124f31',
                    fontWeight: '600',
                    padding: '15px 12px',
                    textAlign: 'left',
                    borderBottom: '2px solid #e9ecef',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Email</th>
                  <th style={{
                    background: '#f8f9fa',
                    color: '#124f31',
                    fontWeight: '600',
                    padding: '15px 12px',
                    textAlign: 'left',
                    borderBottom: '2px solid #e9ecef',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Statut</th>
                  <th style={{
                    background: '#f8f9fa',
                    color: '#124f31',
                    fontWeight: '600',
                    padding: '15px 12px',
                    textAlign: 'left',
                    borderBottom: '2px solid #e9ecef',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Date</th>
                  <th style={{
                    background: '#f8f9fa',
                    color: '#124f31',
                    fontWeight: '600',
                    padding: '15px 12px',
                    textAlign: 'left',
                    borderBottom: '2px solid #e9ecef',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidaturesLoading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      Chargement des candidatures...
                    </td>
                  </tr>
                ) : projectCandidatures.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      Aucune candidature pour ce projet
                    </td>
                  </tr>
                ) : (
                  projectCandidatures.map(candidature => (
                  <tr key={candidature.id} style={{
                    transition: 'background-color 0.2s ease'
                  }}>
                    <td className="candidat-name" style={{
                      padding: '15px 12px',
                      borderBottom: '1px solid #f1f3f4',
                      verticalAlign: 'middle',
                      fontWeight: '600',
                      color: '#124f31',
                      fontSize: '1rem'
                    }}>
                      {candidature.display_name || candidature.candidate?.full_name || 'Nom non disponible'}
                    </td>
                    <td className="candidat-email" style={{
                      padding: '15px 12px',
                      borderBottom: '1px solid #f1f3f4',
                      verticalAlign: 'middle',
                      color: '#666',
                      fontSize: '0.9rem'
                    }}>
                      {candidature.candidate?.email || 'Email non disponible'}
                    </td>
                    <td style={{
                      padding: '15px 12px',
                      borderBottom: '1px solid #f1f3f4',
                      verticalAlign: 'middle'
                    }}>
                      <span className={`status-badge ${getCandidatureStatusBadge(candidature.status).class}`} style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        display: 'inline-block',
                        background: candidature.status === 'pending' ? '#fef3c7' : candidature.status === 'accepted' ? '#dcfce7' : '#fee2e2',
                        color: candidature.status === 'pending' ? '#d97706' : candidature.status === 'accepted' ? '#16a34a' : '#dc2626'
                      }}>
                        {getCandidatureStatusBadge(candidature.status).label}
                      </span>
                    </td>
                    <td className="candidature-date" style={{
                      padding: '15px 12px',
                      borderBottom: '1px solid #f1f3f4',
                      verticalAlign: 'middle',
                      color: '#999',
                      fontSize: '0.9rem'
                    }}>
                      {candidature.applied_at ? new Date(candidature.applied_at).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="actions-cell" style={{
                      padding: '15px 12px',
                      borderBottom: '1px solid #f1f3f4',
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap'
                    }}>
                      <button 
                        className="btn-portfolio-table" 
                        onClick={() => handleViewPortfolio(candidature.id)}
                        style={{
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          marginRight: '10px',
                          transition: 'all 0.3s ease',
                          display: 'inline-block',
                          background: '#124f31',
                          color: 'white'
                        }}
                      >
                        Voir Portfolio
                      </button>
                      
                      {candidature.status === 'pending' && (
                        <>
                          <button 
                            className="btn-accept-table" 
                            onClick={() => handleAcceptCandidature(candidature.id)}
                            style={{
                              padding: '8px 16px',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              marginRight: '10px',
                              transition: 'all 0.3s ease',
                              display: 'inline-block',
                              background: '#1dbf73',
                              color: 'white'
                            }}
                          >
                            Accepter
                          </button>
                          <button 
                            className="btn-refuse-table" 
                            onClick={() => handleRefuseCandidature(candidature.id)}
                            style={{
                              padding: '8px 16px',
                              border: '1px solid #fecaca',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'inline-block',
                              background: '#fee2e2',
                              color: '#dc2626'
                            }}
                          >
                            Refuser
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="demandes">
      <div className="container">
        <div className="header">
          <h1>Mes Projets & Candidatures</h1>
          <p>Gérez vos projets et les candidatures reçues</p>
        </div>
        
        <div className="content">
          <div className="projects-section">
            <h2>Vos Projets</h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Chargement de vos projets...</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                <p>{error}</p>
                <button onClick={loadMyProjects} style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
                  Réessayer
                </button>
              </div>
            ) : projets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Vous n'avez créé aucun projet pour le moment.</p>
              </div>
            ) : (
              <div className="projects-grid">
                {Array.isArray(projets) && projets.map(projet => (
                <div 
                  key={projet.id} 
                  className="project-card clickable"
                  onClick={() => handleProjectClick(projet)}
                >
                  <div className="project-header">
                    <h3>{projet.title}</h3>
                    <span className={`status-badge ${getStatusBadge(projet.status).class}`}>
                      {getStatusBadge(projet.status).label}
                    </span>
                  </div>
                  
                  <p className="project-description">{projet.description}</p>
                  
                  <div className="project-meta">
                    <div className="meta-item">
                      <span className="meta-label">Candidatures:</span>
                      <span className="meta-value">{projet.applications_count || 0}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Durée:</span>
                      <span className="meta-value">{projet.estimated_duration || 'Non définie'}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Créé le:</span>
                      <span className="meta-value">{new Date(projet.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  <div className="project-skills">
                    {(projet.required_skills_list || []).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>

                  <div className="project-action-hint">
                    <span>Cliquez pour voir les candidatures →</span>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demandes; 