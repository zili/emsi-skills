import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProjetDetail.scss";

const ProjetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les détails du projet depuis l'API
  const fetchProjetDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${id}/`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Projet introuvable');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Détails du projet reçus:', data);
      console.log('required_skills dans data:', data.required_skills);
      console.log('tags dans data:', data.tags);
      
      // Debug des compétences
      console.log('=== DEBUG COMPÉTENCES ===');
      console.log('data.tags:', data.tags);
      console.log('data.required_skills:', data.required_skills);
      console.log('data.skills:', data.skills);
      console.log('data.required_skills_list:', data.required_skills_list);
      
      // Extraire les compétences de différentes sources possibles
      let competences = [];
      
      // Priorité 1: tags avec noms
      if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
        competences = data.tags.map(tag => tag.name || tag);
        console.log('Compétences depuis tags:', competences);
      }
      // Priorité 2: required_skills_list
      else if (data.required_skills_list && Array.isArray(data.required_skills_list) && data.required_skills_list.length > 0) {
        competences = data.required_skills_list;
        console.log('Compétences depuis required_skills_list:', competences);
      }
      // Priorité 3: required_skills string à splitter
      else if (data.required_skills && typeof data.required_skills === 'string' && data.required_skills.trim()) {
        competences = data.required_skills.split(',').map(s => s.trim()).filter(s => s);
        console.log('Compétences depuis required_skills string:', competences);
      }
      // Priorité 4: skills (alias)
      else if (data.skills && typeof data.skills === 'string' && data.skills.trim()) {
        competences = data.skills.split(',').map(s => s.trim()).filter(s => s);
        console.log('Compétences depuis skills:', competences);
      }
      // Fallback: compétences par défaut
      else {
        competences = ['Compétences à définir'];
        console.log('Aucune compétence trouvée, fallback utilisé');
      }
      
      console.log('Compétences finales:', competences);
      
      // Transformer les données backend vers le format frontend
      const transformedProjet = {
        id: data.id,
        nom: data.title,
        categorie: data.category?.name || 'Autres',
        image: data.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80',
        technologie: data.technology_used || 'Non spécifiée',
        tags: data.required_skills ? data.required_skills.split(',').map(s => s.trim()) : ['Marketing digital', 'Réseaux sociaux', 'Communication'],
        description: data.description,
        client: data.client?.full_name || data.client?.email || 'Client anonyme',
        clientPhoto: data.client?.profile_picture || data.client_photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        date: data.display_date || new Date(data.created_at).toLocaleDateString('fr-FR'),
        duree: data.display_duration || data.estimated_duration || 'Non spécifiée',
        fichiers: data.files?.map(file => ({
          nom: file.name,
          type: file.file_type_display?.toLowerCase() || 'file',
          url: file.file
        })) || []
      };
      
      console.log('Tags finaux:', transformedProjet.tags);
      setProjet(transformedProjet);
      
    } catch (err) {
      console.error('Erreur lors du chargement du projet:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les détails au montage du composant
  useEffect(() => {
    if (id) {
      fetchProjetDetail();
    }
  }, [id]);

  // État de chargement
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
                  🔄 Chargement...
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

  // État d'erreur
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
                  ❌ {error}
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

  // Projet introuvable
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
                {projet.technologie && projet.technologie !== 'Non spécifiée' && (
                  <div className="meta-item">
                    <span className="meta-label">Technologie :</span>
                    <span className="meta-value">{projet.technologie}</span>
                  </div>
                )}
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
             
              <button className="candidater-btn">
                CANDIDATER POUR CE PROJET
              </button>
              
              {/* Indicateur que les données viennent du backend */}
              <div style={{ 
                marginTop: '20px', 
                fontSize: '0.9rem', 
                color: '#666',
                background: '#e6f4ee',
                padding: '8px 12px',
                borderRadius: '6px'
              }}>
                ✅ Données chargées depuis le backend (ID: {projet.id})
              </div>
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