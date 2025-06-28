import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./projets/ProjetDetail.scss";

const AdminProjetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fonction pour récupérer les détails du projet depuis le backend
  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      console.log(`🔍 Fetching project details for ID: ${id}`);
      
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8000/api/projects/${id}/`, {
        method: 'GET',
        headers
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('🔐 Token invalide, redirection vers login...');
          navigate('/login');
          return;
        } else if (response.status === 404) {
          setError('Projet non trouvé');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Project details received:', data);
      
      // Transformer les données pour correspondre au format frontend
      const formattedProject = {
        id: data.id,
        nom: data.title,
        categorie: data.category?.name || 'Non catégorisé',
        image: data.main_image || data.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80',
        technologie: data.technology_used || 'Non spécifié',
        tags: data.tags || [],
        description: data.description || 'Description non disponible',
        client: data.client?.full_name || `${data.client?.first_name} ${data.client?.last_name}` || 'Client anonyme',
        clientPhoto: data.client?.profile_picture || data.client_photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        date: data.display_date || new Date(data.created_at).toLocaleDateString('fr-FR'),
        duree: data.display_duration || data.estimated_duration || 'Non spécifié',
        statut: data.admin_status === 'pending_approval' ? 'En attente' :
                data.admin_status === 'approved' ? 'Accepté' :
                data.admin_status === 'rejected' ? 'Refusé' : 'Inconnu',
        budget_range: data.budget_range || '',
        fichiers: data.files || [],
        admin_status: data.admin_status,
        rejection_reason: data.rejection_reason || ''
      };

      setProjet(formattedProject);
      
    } catch (err) {
      console.error('❌ Error fetching project details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour approuver le projet
  const handleAccepter = async () => {
    try {
      setActionLoading(true);
      
      const token = localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8000/api/projects/${id}/approve/`, {
        method: 'PATCH',
        headers
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Project approved:', result);
      
      // Mettre à jour le statut localement
      setProjet(prev => ({
        ...prev,
        statut: 'Accepté',
        admin_status: 'approved'
      }));
      
      alert("Projet accepté avec succès !");
      
    } catch (err) {
      console.error('❌ Error approving project:', err);
      alert(`Erreur lors de l'approbation: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Fonction pour rejeter le projet
  const handleRefuser = async () => {
    const reason = prompt("Raison du refus (optionnel):");
    
    try {
      setActionLoading(true);
      
      const token = localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8000/api/projects/${id}/reject/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ reason: reason || '' })
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Project rejected:', result);
      
      // Mettre à jour le statut localement
      setProjet(prev => ({
        ...prev,
        statut: 'Refusé',
        admin_status: 'rejected',
        rejection_reason: reason || ''
      }));
      
      alert("Projet refusé.");
      
    } catch (err) {
      console.error('❌ Error rejecting project:', err);
      alert(`Erreur lors du refus: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        flexDirection: 'column'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #178f56',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}></div>
        <p style={{ color: '#666', fontSize: '16px' }}>Chargement du projet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h3 style={{ color: '#e74c3c', marginBottom: '16px' }}>
          ⚠️ Erreur de chargement
        </h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          {error}
        </p>
        <button 
          onClick={() => navigate('/admin/demandes')}
          style={{
            background: '#178f56',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← Retour aux demandes
        </button>
      </div>
    );
  }

  if (!projet) {
    return <div style={{ padding: 40 }}>Projet introuvable.</div>;
  }

  return (
    <div className="project-detail-view">
      {/* Header vert style portfolio pleine largeur */}
      <div className="project-detail-header">
        <div className="project-header-container">
          <button className="back-btn" onClick={() => navigate('/admin/demandes')}>
            ← Retour aux demandes
          </button>
          
          <div className="project-main-content">
            <div className="project-image-section">
              <img src={projet.image} alt={projet.nom} className="project-main-image" />
              
              {/* Photo et nom du client en bas de l'image */}
              <div className="project-client-info">
                <img src={projet.clientPhoto} alt={projet.client} className="client-photo" />
                <span className="client-name">{projet.client}</span>
              </div>
            </div>
            
            <div className="project-info-section">
              <h1 className="project-title">{projet.nom}</h1>
              <div className="project-badge">{projet.categorie}</div>
              
              <p className="project-description">
                {projet.description}
              </p>
              
              <div className="project-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">DATE :</span>
                  <span className="meta-value">{projet.date}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">DURÉE :</span>
                  <span className="meta-value">{projet.duree}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">STATUT :</span>
                  <span className="meta-value" style={{
                    color: projet.statut === "Accepté" ? "#1dbf73" : 
                           projet.statut === "Refusé" ? "#ff4d4d" : "#f7a600"
                  }}>
                    {projet.statut}
                  </span>
                </div>
                {projet.technologie && (
                  <div className="meta-item">
                    <span className="meta-label">TECHNOLOGIE :</span>
                    <span className="meta-value">{projet.technologie}</span>
                  </div>
                )}
                {projet.budget_range && (
                  <div className="meta-item">
                    <span className="meta-label">BUDGET :</span>
                    <span className="meta-value">{projet.budget_range}</span>
                  </div>
                )}
              </div>
              
              <div className="project-competences">
                <span className="competences-label">Compétences requises :</span>
                <div className="competences-list">
                  {projet.tags.map((tag, index) => (
                    <span 
                      className="competence-tag" 
                      key={index}
                      style={{
                        background: tag.color || '#e3f2fd',
                        color: tag.color ? '#fff' : '#1976d2'
                      }}
                    >
                      {tag.name || tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Message de refus si le projet est refusé */}
              {projet.statut === "Refusé" && projet.rejection_reason && (
                <div style={{
                  background: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '20px',
                  color: '#856404'
                }}>
                  <strong>Raison du refus:</strong> {projet.rejection_reason}
                </div>
              )}
             
              <div className="admin-actions" style={{
                display: 'flex',
                gap: '15px',
                marginTop: '30px'
              }}>
                <button 
                  className="accepter-btn"
                  onClick={handleAccepter}
                  disabled={projet.admin_status !== "pending_approval" || actionLoading}
                  style={{
                    background: projet.statut === "Accepté" ? "#1dbf73" : "#178f56",
                    color: "white",
                    border: "none",
                    padding: "1rem 2rem",
                    borderRadius: "25px",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    cursor: projet.admin_status === "pending_approval" && !actionLoading ? "pointer" : "not-allowed",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    opacity: projet.admin_status === "pending_approval" && !actionLoading ? 1 : 0.6,
                    transition: "all 0.3s ease"
                  }}
                >
                  {actionLoading ? "⏳ TRAITEMENT..." : 
                   projet.statut === "Accepté" ? "✅ ACCEPTÉ" : "ACCEPTER LE PROJET"}
                </button>
                
                <button 
                  className="refuser-btn"
                  onClick={handleRefuser}
                  disabled={projet.admin_status !== "pending_approval" || actionLoading}
                  style={{
                    background: projet.statut === "Refusé" ? "#ff4d4d" : "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "1rem 2rem",
                    borderRadius: "25px",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    cursor: projet.admin_status === "pending_approval" && !actionLoading ? "pointer" : "not-allowed",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    opacity: projet.admin_status === "pending_approval" && !actionLoading ? 1 : 0.6,
                    transition: "all 0.3s ease"
                  }}
                >
                  {actionLoading ? "⏳ TRAITEMENT..." : 
                   projet.statut === "Refusé" ? "❌ REFUSÉ" : "REFUSER LE PROJET"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section fichiers de référence */}
      {projet.fichiers && projet.fichiers.length > 0 && (
        <div className="project-files-section">
          <div className="container">
            <h2 className="files-title">Fichiers de référence</h2>
            <div className="files-grid">
              {projet.fichiers.map((fichier, index) => (
                <div className="file-item" key={index}>
                  <div className="file-icon">
                    {fichier.file_type_display === 'PDF' ? '📄' :
                     fichier.file_type_display === 'ZIP' ? '📦' :
                     fichier.file_type_display === 'DOC' ? '📝' : '📁'}
                  </div>
                  <div className="file-info">
                    <span className="file-name">{fichier.name}</span>
                    <span className="file-type">{fichier.file_type_display || 'Fichier'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Export explicite du composant
const AdminProjetDetailComponent = AdminProjetDetail;
export default AdminProjetDetailComponent;
