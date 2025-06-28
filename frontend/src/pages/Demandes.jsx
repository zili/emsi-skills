import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Demandes.scss";

const Demandes = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  // Données d'exemple des projets
  const projets = [
    {
      id: 1,
      titre: "Application mobile de gestion des étudiants",
      description: "Développement d'une application mobile pour gérer les informations des étudiants",
      status: "en_cours",
      candidatures_count: 12,
      date_creation: "2024-01-15",
      duree: "3 mois",
      competences: ["React Native", "Node.js", "MongoDB"],
      candidatures: [
        {
          id: 1,
          nom: "Ahmed Benali",
          prenom: "Ahmed",
          email: "ahmed.benali@emsi.ma",
          photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1600",
          competences: ["React Native", "JavaScript", "MongoDB"],
          motivation: "Je suis passionné par le développement mobile et j'ai déjà réalisé plusieurs projets similaires...",
          date_candidature: "2024-01-16",
          status: "en_attente"
        },
        {
          id: 2,
          nom: "Fatima Zahra",
          prenom: "Fatima",
          email: "fatima.zahra@emsi.ma",
          photo: "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600",
          competences: ["React Native", "Node.js", "UI/UX"],
          motivation: "Expérience de 2 ans en développement mobile, je souhaite contribuer à ce projet innovant...",
          date_candidature: "2024-01-17",
          status: "en_attente"
        }
      ]
    },
    {
      id: 2,
      titre: "Site web pour club étudiant",
      description: "Création d'un site web moderne pour promouvoir les activités du club",
      status: "termine",
      candidatures_count: 8,
      date_creation: "2023-12-10",
      duree: "2 mois",
      competences: ["React", "CSS", "JavaScript"],
      candidatures: [
        {
          id: 3,
          nom: "Omar Alami",
          prenom: "Omar",
          email: "omar.alami@emsi.ma",
          photo: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1600",
          competences: ["React", "CSS", "JavaScript"],
          motivation: "Spécialisé en développement web frontend avec une forte expérience en React...",
          date_candidature: "2023-12-12",
          status: "accepte"
        }
      ]
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      en_cours: { label: "En cours", class: "status-progress" },
      termine: { label: "Terminé", class: "status-completed" },
      en_attente: { label: "En attente", class: "status-pending" }
    };
    return statusConfig[status] || { label: status, class: "status-default" };
  };

  const getCandidatureStatusBadge = (status) => {
    const statusConfig = {
      en_attente: { label: "En attente", class: "status-pending" },
      accepte: { label: "Accepté", class: "status-accepted" },
      refuse: { label: "Refusé", class: "status-refused" }
    };
    return statusConfig[status] || { label: status, class: "status-default" };
  };

  const handleAcceptCandidature = (candidatureId) => {
    console.log("Accepter candidature:", candidatureId);
    // Ici vous pouvez ajouter la logique pour accepter la candidature
  };

  const handleRefuseCandidature = (candidatureId) => {
    console.log("Refuser candidature:", candidatureId);
    // Ici vous pouvez ajouter la logique pour refuser la candidature
  };

  const handleViewPortfolio = (candidatureId) => {
    // Trouver la candidature correspondante pour obtenir les informations du candidat
    let candidature = null;
    for (const projet of projets) {
      candidature = projet.candidatures.find(c => c.id === candidatureId);
      if (candidature) break;
    }
    
    if (candidature) {
      // Naviguer vers la page portfolio avec les données du candidat
      navigate('/portfolio-view', { 
        state: { 
          candidature: candidature,
          fromDemandes: true 
        } 
      });
    }
  };

  const handleProjectClick = (projet) => {
    setSelectedProject(projet);
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
              <h1>Candidatures - {selectedProject.titre}</h1>
              <p>{selectedProject.candidatures.length} candidature(s) reçue(s)</p>
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
                {selectedProject.candidatures.map(candidature => (
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
                      {candidature.prenom} {candidature.nom}
                    </td>
                    <td className="candidat-email" style={{
                      padding: '15px 12px',
                      borderBottom: '1px solid #f1f3f4',
                      verticalAlign: 'middle',
                      color: '#666',
                      fontSize: '0.9rem'
                    }}>
                      {candidature.email}
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
                        background: candidature.status === 'en_attente' ? '#fef3c7' : candidature.status === 'accepte' ? '#dcfce7' : '#fee2e2',
                        color: candidature.status === 'en_attente' ? '#d97706' : candidature.status === 'accepte' ? '#16a34a' : '#dc2626'
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
                      {new Date(candidature.date_candidature).toLocaleDateString('fr-FR')}
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
                      
                      {candidature.status === 'en_attente' && (
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
                ))}
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
            <div className="projects-grid">
              {projets.map(projet => (
                <div 
                  key={projet.id} 
                  className="project-card clickable"
                  onClick={() => handleProjectClick(projet)}
                >
                  <div className="project-header">
                    <h3>{projet.titre}</h3>
                    <span className={`status-badge ${getStatusBadge(projet.status).class}`}>
                      {getStatusBadge(projet.status).label}
                    </span>
                  </div>
                  
                  <p className="project-description">{projet.description}</p>
                  
                  <div className="project-meta">
                    <div className="meta-item">
                      <span className="meta-label">Candidatures:</span>
                      <span className="meta-value">{projet.candidatures_count}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Durée:</span>
                      <span className="meta-value">{projet.duree}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Créé le:</span>
                      <span className="meta-value">{new Date(projet.date_creation).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  <div className="project-skills">
                    {projet.competences.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>

                  <div className="project-action-hint">
                    <span>Cliquez pour voir les candidatures →</span>
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

export default Demandes; 