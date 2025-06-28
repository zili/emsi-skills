import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Add.scss";

const Add = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Catégories hardcodées comme demandé
  const categories = [
    { id: 1, name: "Développement" },
    { id: 2, name: "Génie Civil" },
    { id: 3, name: "Industriel" },
    { id: 4, name: "Marketing" },
    { id: 5, name: "Bénévolat" },
    { id: 6, name: "Art" },
    { id: 7, name: "Vidéo & Montage" },
    { id: 8, name: "Autres" }
  ];

  const [formData, setFormData] = useState({
    title: '',
    category_id: 1, // Développement par défaut
    estimated_duration: '1-month',
    description: '',
    required_skills: '',
    projectImage: null,
    files: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      files: e.target.files
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      projectImage: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Préparer les données pour l'API
      const projectData = new FormData();
      
      // Champs obligatoires
      projectData.append('title', formData.title);
      projectData.append('description', formData.description);
      projectData.append('category_id', formData.category_id);
      projectData.append('estimated_duration', formData.estimated_duration);
      projectData.append('required_skills', formData.required_skills);
      
      // Image optionnelle
      if (formData.projectImage) {
        projectData.append('main_image', formData.projectImage);
      }

      // Récupérer le token d'authentification
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Vous devez être connecté pour créer un projet');
      }

      // Envoyer la requête à l'API
      const response = await fetch('http://localhost:8000/api/projects/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: projectData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Erreur lors de la création du projet');
      }

      const newProject = await response.json();
      console.log('Projet créé avec succès:', newProject);

      // Rediriger vers la liste des projets ou le dashboard
      alert('Projet créé avec succès ! Il sera visible après validation par un administrateur.');
      navigate('/projets');

    } catch (err) {
      console.error('Erreur lors de la création du projet:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project">
      {/* Header Section */}
      <div className="header-section">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Retour
          </button>
          <h1>Créer un nouveau projet</h1>
          <p>Décrivez votre projet et trouvez les talents parfaits pour le réaliser</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <div className="container">
          {error && (
            <div className="error-message" style={{
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: '#721c24'
            }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Left Column - Informations sur le projet */}
              <div className="left-column">
                <div className="section-header">
                  <div className="form-header">
                    <div className="icon">📋</div>
                    <label>Titre du projet</label>
                  </div>
                  <div className="green-line"></div>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Développer une application mobile de gestion"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Description détaillée</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre projet en détail : objectifs, fonctionnalités attendues, contraintes techniques, contexte..."
                    rows="6"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Photo du projet</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      name="projectImage"
                      onChange={handleImageChange}
                      accept=".png,.jpg,.jpeg,.webp"
                      id="image-upload"
                      style={{ display: 'none' }}
                      disabled={loading}
                    />
                    <label htmlFor="image-upload" className="file-upload-label">
                      <div className="upload-icon">📷</div>
                      <div className="upload-text">
                        <span>
                          {formData.projectImage ? 
                            `Image sélectionnée: ${formData.projectImage.name}` : 
                            'Ajoutez une image pour votre projet'
                          }
                        </span>
                        <small>PNG, JPG, JPEG acceptés (max 5MB)</small>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Compétences et Détails */}
              <div className="right-column">
                <div className="section-header">
                  <div className="form-header">
                    <div className="icon">⚙️</div>
                    <label>Compétences recherchées</label>
                  </div>
                  <div className="green-line"></div>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="required_skills"
                    value={formData.required_skills}
                    onChange={handleInputChange}
                    placeholder="Ex: React, Node.js, MongoDB, Python..."
                    required
                    disabled={loading}
                  />
                  <small>Séparez les compétences par des virgules</small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Catégorie</label>
                    <select 
                      name="category_id" 
                      value={formData.category_id}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Durée estimée</label>
                    <select 
                      name="estimated_duration" 
                      value={formData.estimated_duration}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    >
                      <option value="1-week">1 semaine</option>
                      <option value="2-weeks">2 semaines</option>
                      <option value="1-month">1 mois</option>
                      <option value="2-months">2 mois</option>
                      <option value="3-months">3 mois</option>
                      <option value="6-months">6 mois</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Fichiers de référence (optionnel)</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      name="files"
                      onChange={handleFileChange}
                      multiple
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      id="file-upload"
                      style={{ display: 'none' }}
                      disabled={loading}
                    />
                    <label htmlFor="file-upload" className="file-upload-label">
                      <div className="upload-icon">📎</div>
                      <div className="upload-text">
                        <span>
                          {formData.files && formData.files.length > 0 ? 
                            `${formData.files.length} fichier(s) sélectionné(s)` :
                            'Glissez vos fichiers ici ou cliquez pour sélectionner'
                          }
                        </span>
                        <small>PDF, DOC, images acceptés (max 10MB)</small>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Buttons inside the form grid */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Création en cours...' : 'Publier le projet'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;
