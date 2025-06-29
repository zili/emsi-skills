import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProjetDetail.scss";

const ProjetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour la candidature
  const [candidatureStatus, setCandidatureStatus] = useState(null);
  const [candidatureLoading, setCandidatureLoading] = useState(false);

  // État pour les notifications
  const [notification, setNotification] = useState(null);

  // Fonction pour afficher une notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Vérifier le token d'authentification
  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  const isAuthenticated = () => {
    return !!getAuthToken();
  };

  // Fonction pour obtenir la photo du client avec logique spéciale pour Lions Tanger
  const getClientPhoto = (client) => {
    if (!client) {
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80';
    }
    
    // Logique spéciale pour Lions Tanger
    const clientName = client.full_name || 
      (client.first_name && client.last_name ? `${client.first_name} ${client.last_name}` : '') ||
      client.email || '';
    
    if (clientName.toLowerCase().includes('lions') && clientName.toLowerCase().includes('tanger')) {
      return '/img/lionss.jpg';
    }
    
    // Retourner la photo de profil si elle existe, sinon une image par défaut
    return client.profile_picture || 
           'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80';
  };

  // Fonction pour récupérer les détails du projet depuis l'API
  const fetchProjetDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/api/projects/simple/${id}/`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Projet introuvable');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Détails du projet reçus:', data);
      
      // Transformer les données backend vers le format frontend
      const transformedProjet = {
        id: data.id,
        nom: data.title,
        categorie: data.category || 'Autres',
        image: data.image || data.main_image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80',
        tags: data.tags ? data.tags.map(tag => tag.name) : (data.required_skills ? data.required_skills.split(',').map(s => s.trim()) : ['Non spécifié']),
        description: data.description,
        client: data.client?.full_name || (data.client?.first_name && data.client?.last_name ? 
          `${data.client.first_name} ${data.client.last_name}` : 
          data.client?.email || 'Client anonyme'),
        clientPhoto: getClientPhoto(data.client),
        date: data.display_date || new Date(data.created_at).toLocaleDateString('fr-FR'),
        duree: data.display_duration || data.estimated_duration || 'Non spécifiée',
        fichiers: data.files?.map(file => ({
          nom: file.name,
          type: file.file_type_display?.toLowerCase() || 'file',
          url: file.file
        })) || []
      };
      
      setProjet(transformedProjet);
      
      // Vérifier le statut de candidature si l'utilisateur est connecté
      if (isAuthenticated()) {
        await checkCandidatureStatus();
      }
      
    } catch (err) {
      console.error('Erreur lors du chargement du projet:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur a déjà candidaté
  const checkCandidatureStatus = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:8000/api/candidatures/check/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCandidatureStatus(data);
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du statut de candidature:', err);
    }
  };

  // Candidature simple en un clic
  const handleCandidatureClick = async () => {
    if (!isAuthenticated()) {
      showNotification('Vous devez être connecté pour candidater', 'warning');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    if (candidatureStatus?.has_applied) {
      return; // Déjà candidaté
    }
    
    setCandidatureLoading(true);
    
    try {
      const token = getAuthToken();
      console.log('Token utilisé:', token ? 'Token présent' : 'Pas de token');
      
      const response = await fetch('http://localhost:8000/api/candidatures/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: parseInt(id),
          cover_letter: 'Je suis intéressé(e) par ce projet et souhaite y contribuer.',
          availability: 'Disponible immédiatement',
          proposed_timeline: projet?.duree || 'À discuter',
          proposed_budget: 'À négocier'
        }),
      });
      
      console.log('Réponse API:', response.status, response.statusText);
      
      // Gestion spécifique des erreurs d'authentification
      if (response.status === 401) {
        // Token expiré ou invalide
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        showNotification('Votre session a expiré. Redirection...', 'error');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      const data = await response.json();
      console.log('Données de réponse:', data);
      
      if (response.ok) {
        showNotification('Candidature envoyée avec succès !', 'success');
        await checkCandidatureStatus(); // Rafraîchir le statut
      } else {
        // Afficher l'erreur spécifique du serveur
        const errorMessage = data.error || data.message || data.detail || 'Erreur inconnue';
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Erreur lors de la candidature:', err);
      
      if (err.message.includes('déjà candidaté')) {
        showNotification('Vous avez déjà candidaté pour ce projet !', 'warning');
      } else if (err.message.includes('session') || err.message.includes('authentication')) {
        showNotification('Problème d\'authentification. Redirection...', 'error');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.message.includes('Failed to fetch')) {
        showNotification('Erreur de connexion. Vérifiez que le serveur est démarré.', 'error');
      } else {
        showNotification(`Erreur: ${err.message}`, 'error');
      }
    } finally {
      setCandidatureLoading(false);
    }
  };

  // Charger les détails au montage du composant
  useEffect(() => {
    if (id) {
      fetchProjetDetail();
    }
  }, [id]);

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className="project-detail-view">
        <div className="project-detail-header">
          <div className="project-header-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Retour
            </button>
            <div className="project-main-content">
              <div className="project-image-section">
                <div className="project-main-image" style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Chargement...
                </div>
              </div>
              <div className="project-info-section">
                <h1 className="project-title">Chargement du projet...</h1>
                <p>Récupération des données depuis le backend...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-view">
        <div className="project-detail-header">
          <div className="project-header-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Retour
            </button>
            <div className="project-main-content">
              <div className="project-info-section">
                <h1 className="project-title">Erreur</h1>
                <div style={{
                  background: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  borderRadius: '8px',
                  padding: '16px',
                  margin: '20px 0',
                  color: '#721c24'
                }}>
                  {error}
                </div>
                <button 
                  onClick={fetchProjetDetail}
                  style={{
                    background: '#1dbf73',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!projet) {
    return (
      <div style={{ padding: 40 }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Retour
        </button>
        <h2>Projet introuvable</h2>
        <p>Le projet avec l'ID {id} n'existe pas.</p>
      </div>
    );
  }

  return (
    <div className="project-detail-view">
      {/* Notification Toast */}
      {notification && (
        <div className={`toast-notification ${notification.type}`}>
          <div className="toast-content">
            <div className="toast-icon">
              {notification.type === 'success' && '✓'}
              {notification.type === 'error' && '✗'}
              {notification.type === 'warning' && '⚠'}
            </div>
            <span className="toast-message">{notification.message}</span>
          </div>
          <button 
            className="toast-close"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Header vert style portfolio */}
      <div className="project-detail-header">
        <div className="project-header-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Retour
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
                  <span className="meta-label">Date :</span>
                  <span className="meta-value">{projet.date}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Durée :</span>
                  <span className="meta-value">{projet.duree}</span>
                </div>
              </div>
              
              <div className="project-competences">
                <span className="competences-label">Compétences requises :</span>
                <div className="competences-list">
                  {projet.tags && projet.tags.length > 0 ? (
                    projet.tags.map((tag, index) => (
                      <span className="competence-tag" key={index}>{tag}</span>
                    ))
                  ) : (
                    <span className="competence-tag" style={{ opacity: 0.7, background: '#f0f0f0' }}>
                      Compétences non spécifiées
                    </span>
                  )}
                </div>
              </div>
             
              {/* Bouton candidater simple */}
              {candidatureStatus?.has_applied ? (
                <div className="candidature-status">
                  <div className={`status-badge status-${candidatureStatus.status}`}>
                    Candidature {candidatureStatus.status_display}
                  </div>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '8px' }}>
                    Candidature soumise le {new Date(candidatureStatus.applied_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ) : (
                <button 
                  className="candidater-btn"
                  onClick={handleCandidatureClick}
                  disabled={candidatureLoading}
                >
                  {candidatureLoading ? 'Envoi en cours...' : 'CANDIDATER POUR CE PROJET'}
                </button>
              )}
              

            </div>
          </div>
        </div>
      </div>
      
      {/* Section fichiers de référence en bas */}
      {projet.fichiers.length > 0 && (
        <div className="project-files-section">
          <div className="files-container">
            <h2>Fichiers de référence</h2>
            <div className="files-grid">
              {projet.fichiers.map((fichier, index) => (
                <div className="file-item" key={index}>
                  <span className="file-name" data-type={fichier.type.toUpperCase()}>
                    {fichier.nom}
                  </span>
                  <button 
                    className="download-btn"
                    onClick={() => {
                      if (fichier.url) {
                        window.open(fichier.url, '_blank');
                      }
                    }}
                  >
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjetDetail; 