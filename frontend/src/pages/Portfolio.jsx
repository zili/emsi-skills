import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Portfolio.scss";
import apiService from "../services/api";

const Portfolio = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    photo: '',
    description: '',
    linkedin: '',
    cv: '',
    skills: [],
    languages: []
  });

  // Récupérer les données du profil depuis l'API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Vérifier si l'utilisateur est connecté
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('Vous devez être connecté pour voir votre portfolio');
          navigate('/login');
          return;
        }

        // Récupérer le profil depuis l'API
        const data = await apiService.getProfile();
        console.log('Données du profil reçues:', data);
        
        // Adapter les données pour l'affichage (avec admin.png par défaut pour la photo)
        const adaptedData = {
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username || '',
          photo: data.profile_picture || "/img/admin.png",
          description: data.bio || null,
          linkedin: data.linkedin_url || null,
          cv: data.cv_file || null,
          skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [],
          languages: data.languages ? data.languages.split(',').map(l => l.trim()).filter(l => l) : [],
          projects: data.projects || [],
          comments: data.comments || data.ratings || [],
          stats: {
            projets_termines: data.total_projects || 0,
            note_moyenne: data.rating_average || 0,
            total_evaluations: data.total_ratings || 0,
            taux_recommandation: data.success_rate || 0
          }
        };
        
        setProfileData(adaptedData);
        
        // Initialiser le formulaire d'édition
        setEditForm({
          photo: adaptedData.photo || "/img/admin.png",
          description: adaptedData.description || '',
          linkedin: adaptedData.linkedin || '',
          cv: adaptedData.cv || '',
          skills: Array.isArray(adaptedData.skills) ? adaptedData.skills : [],
          languages: Array.isArray(adaptedData.languages) ? adaptedData.languages : []
        });
        
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        setError(error.message || 'Erreur lors du chargement du profil');
        
        // Si erreur d'authentification, rediriger vers login
        if (error.message.includes('401') || error.message.includes('token')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLinkedIn = () => {
    if (profileData?.linkedin) {
      window.open(profileData.linkedin, '_blank');
      console.log('Ouverture du LinkedIn de', profileData.name);
    } else {
      alert('Aucun profil LinkedIn configuré. Modifiez votre profil pour ajouter votre lien LinkedIn.');
    }
  };

  const handleCV = () => {
    if (profileData?.cv) {
      window.open(profileData.cv, '_blank');
      console.log('Ouverture du CV de', profileData.name);
    } else {
      alert('Aucun CV configuré. Modifiez votre profil pour ajouter votre CV.');
    }
  };

  const handleEditProfile = () => {
    // Synchroniser editForm avec les données actuelles du profil
    console.log('🔄 Ouverture du modal - profileData:', profileData);
    setEditForm({
      photo: profileData?.photo || "/img/admin.png",
      description: profileData?.description || '',
      linkedin: profileData?.linkedin || '',
      cv: profileData?.cv || '',
      skills: Array.isArray(profileData?.skills) ? [...profileData.skills] : [],
      languages: Array.isArray(profileData?.languages) ? [...profileData.languages] : []
    });
    console.log('🔄 editForm synchronisé avec les données actuelles');
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      console.log('Données à envoyer:', editForm);
      
      // Validation côté client
      if (editForm.linkedin && editForm.linkedin.trim() && !editForm.linkedin.includes('linkedin.com')) {
        alert('❌ Veuillez entrer une URL LinkedIn valide');
        setLoading(false);
        return;
      }
      
      if (editForm.description && editForm.description.length > 1000) {
        alert('❌ La description est trop longue (maximum 1000 caractères)');
        setLoading(false);
        return;
      }
      
      // Préparer les données pour l'API (noms des champs Django)
      const updateData = {};
      
      // ✅ ÉTAPE 2 : Réactiver tous les champs texte (sans fichiers)
      if (editForm.description && editForm.description.trim()) {
        updateData.bio = editForm.description.trim();
      }
      
      if (editForm.linkedin && editForm.linkedin.trim()) {
        updateData.linkedin_url = editForm.linkedin.trim();
      }
      
      // 🔍 DEBUG : Vérifier le format des skills
      console.log('🔍 Skills dans editForm:', editForm.skills);
      console.log('🔍 Type de skills:', typeof editForm.skills);
      console.log('🔍 Is Array:', Array.isArray(editForm.skills));
      
      if (editForm.skills) {
        if (Array.isArray(editForm.skills) && editForm.skills.length > 0) {
          updateData.skills = editForm.skills.join(', ');
          console.log('✅ Skills envoyées (array):', updateData.skills);
        } else if (typeof editForm.skills === 'string' && editForm.skills.trim()) {
          updateData.skills = editForm.skills.trim();
          console.log('✅ Skills envoyées (string):', updateData.skills);
        }
      }
      
      // 🔍 DEBUG : Vérifier le format des languages
      console.log('🔍 Languages dans editForm:', editForm.languages);
      console.log('🔍 Type de languages:', typeof editForm.languages);
      console.log('🔍 Is Array:', Array.isArray(editForm.languages));
      
      if (editForm.languages) {
        if (Array.isArray(editForm.languages) && editForm.languages.length > 0) {
          updateData.languages = editForm.languages.join(', ');
          console.log('✅ Languages envoyées (array):', updateData.languages);
        } else if (typeof editForm.languages === 'string' && editForm.languages.trim()) {
          updateData.languages = editForm.languages.trim();
          console.log('✅ Languages envoyées (string):', updateData.languages);
        }
      }

      // 🔍 DEBUG : Vérifier les fichiers
      console.log('🔍 Photo dans editForm:', editForm.photo ? 'Présente' : 'Absente');
      console.log('🔍 CV dans editForm:', editForm.cv ? 'Présent' : 'Absent');
      console.log('🔍 Photo actuelle du profil:', profileData.photo);
      console.log('🔍 CV actuel du profil:', profileData.cv);

      // Si une nouvelle photo a été uploadée (base64 ou URL différente)
      if (editForm.photo && 
          editForm.photo !== profileData.photo && 
          editForm.photo !== "/img/admin.png" &&
          editForm.photo.startsWith('data:image/')) {
        
        console.log('📸 Nouvelle photo détectée, préparation de l\'upload...');
        
        // Vérifier la taille de l'image base64 (max 2MB)
        const base64Size = editForm.photo.length * 0.75; // Approximation de la taille en bytes
        console.log('📸 Taille estimée de la photo:', Math.round(base64Size / 1024) + 'KB');
        
        if (base64Size > 2 * 1024 * 1024) {
          alert('❌ Image trop volumineuse. Réduisez la taille de votre photo (max 2MB).');
          setLoading(false);
          return;
        }
        
        updateData.profile_picture = editForm.photo;
        console.log('✅ Photo ajoutée aux données à envoyer');
      }

      // Si un nouveau CV a été uploadé
      if (editForm.cv && 
          editForm.cv !== profileData.cv && 
          editForm.cv.startsWith('data:application/')) {
        
        console.log('📄 Nouveau CV détecté, préparation de l\'upload...');
        
        // Vérifier la taille du CV (max 5MB)
        const base64Size = editForm.cv.length * 0.75;
        console.log('📄 Taille estimée du CV:', Math.round(base64Size / 1024) + 'KB');
        
        if (base64Size > 5 * 1024 * 1024) {
          alert('❌ Fichier CV trop volumineux. Réduisez la taille (max 5MB).');
          setLoading(false);
          return;
        }
        
        updateData.cv_file = editForm.cv;
        console.log('✅ CV ajouté aux données à envoyer');
      }

      console.log('Données formatées pour l\'API:', updateData);
      
      // Vérifier qu'il y a au moins un champ à mettre à jour
      if (Object.keys(updateData).length === 0) {
        alert('ℹ️ Aucune modification détectée');
        setLoading(false);
        setShowEditModal(false);
        return;
      }

      // Envoyer les données à l'API
      const updatedData = await apiService.updateProfile(updateData);
      console.log('Réponse du serveur:', updatedData);
      
      // Mettre à jour les données locales avec la réponse du serveur
      const newProfileData = {
        ...profileData,
        photo: (updatedData && updatedData.profile_picture) || editForm.photo,
        description: (updatedData && updatedData.bio) || editForm.description,
        linkedin: (updatedData && updatedData.linkedin_url) || editForm.linkedin,
        cv: (updatedData && updatedData.cv_file) || editForm.cv,
        skills: (updatedData && updatedData.skills) ? 
          updatedData.skills.split(',').map(s => s.trim()).filter(s => s) : 
          editForm.skills,
        languages: (updatedData && updatedData.languages) ? 
          updatedData.languages.split(',').map(l => l.trim()).filter(l => l) : 
          editForm.languages
      };
      
      setProfileData(newProfileData);
      setShowEditModal(false);
      alert('✅ Profil mis à jour avec succès !');
      
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du profil:', error);
      
      // Messages d'erreur plus spécifiques
      let errorMessage = 'Erreur lors de la mise à jour du profil';
      if (error.message.includes('401')) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.message.includes('400')) {
        errorMessage = 'Erreur de validation des données.\n\nVérifiez que :\n- L\'URL LinkedIn est valide\n- Les compétences et langues sont bien formatées\n- La photo n\'est pas trop volumineuse';
        console.log('Données envoyées lors de l\'erreur 400:', updateData);
      } else if (error.message.includes('413')) {
        errorMessage = 'Fichier trop volumineux. Réduisez la taille de votre photo/CV.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert('❌ ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    console.log('🔍 Fichier sélectionné:', file ? file.name : 'Aucun fichier');
    
    if (!file) return;

    if (type === 'photo') {
      console.log('📷 Traitement de la photo:', file.name, 'Type:', file.type, 'Taille:', (file.size / 1024).toFixed(2) + 'KB');
      
      // Vérifier la taille et le type de l'image
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        alert('❌ L\'image est trop volumineuse. Taille maximum : 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('❌ Veuillez sélectionner un fichier image valide');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('✅ Photo encodée en base64, taille:', e.target.result.length, 'caractères');
        setEditForm({...editForm, photo: e.target.result});
        console.log('📷 Photo mise à jour dans editForm');
        alert('✅ Photo sélectionnée : ' + file.name);
      };
      reader.onerror = () => {
        console.error('❌ Erreur FileReader pour la photo');
        alert('❌ Erreur lors de la lecture du fichier image');
      };
      reader.readAsDataURL(file);
      
    } else if (type === 'cv') {
      console.log('📄 Traitement du CV:', file.name, 'Type:', file.type, 'Taille:', (file.size / 1024).toFixed(2) + 'KB');
      
      // Vérifier la taille et le type du CV
      if (file.size > 10 * 1024 * 1024) { // 10MB max
        alert('❌ Le fichier CV est trop volumineux. Taille maximum : 10MB');
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('❌ Format de fichier non supporté. Utilisez PDF, DOC ou DOCX');
        return;
      }

      // Pour le CV, on peut soit stocker le nom du fichier soit l'encoder en base64
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('✅ CV encodé en base64, taille:', e.target.result.length, 'caractères');
        setEditForm({...editForm, cv: e.target.result});
        console.log('📄 CV mis à jour dans editForm');
        alert('✅ CV sélectionné : ' + file.name);
      };
      reader.onerror = () => {
        console.error('❌ Erreur FileReader pour le CV');
        alert('❌ Erreur lors de la lecture du fichier CV');
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} style={{
        color: index < rating ? '#ffd700' : '#ccc',
        fontSize: '1.2rem',
        marginRight: '2px'
      }}>
        ★
      </span>
    ));
  };
  
  const getButtonStyle = (buttonName) => ({
    background: hoveredButton === buttonName ? '#0d5d33' : '#178f56',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '25px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    transform: hoveredButton === buttonName ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hoveredButton === buttonName ? '0 4px 15px rgba(23, 143, 86, 0.4)' : '0 2px 5px rgba(0,0,0,0.1)'
  });

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Chargement de votre portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        background: '#f8f9fa',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>Erreur</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#178f56',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Réessayer
          </button>
          <button 
            onClick={() => navigate('/login')}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

    return (
    <div style={{ 
      background: '#f8f9fa',
      minHeight: '100vh',
      paddingTop: '0'
    }}>
      {/* Header vert décalé à droite */}
      <div style={{
        background: '#124f31',
        padding: '2rem',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '2rem',
        paddingLeft: '8rem'
      }}>
        {/* Photo à gauche (admin.png par défaut) */}
        <img 
          src={profileData?.photo || "/img/admin.png"} 
          alt={profileData?.name || "Profil"}
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0
          }}
        />
        
        {/* Informations à droite */}
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: '0 0 0.5rem 0',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {profileData?.name || "Nom d'utilisateur"}
          </h1>
          
          <div style={{ marginBottom: '0.5rem' }}>
            {renderStars(Math.round(profileData?.stats?.note_moyenne || 0))}
          </div>
          
          <p style={{ 
            fontSize: '1.2rem', 
            margin: '0 0 1rem 0',
            color: '#a0d4b8'
          }}>
            4IIR G4 Tanger
          </p>
          
          {profileData?.description && (
            <p style={{ 
              fontSize: '1.1rem', 
              margin: '0 0 1.5rem 0',
              lineHeight: '1.5',
              maxWidth: '600px'
            }}>
              {profileData.description}
            </p>
          )}
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={handleLinkedIn}
              onMouseEnter={() => setHoveredButton('linkedin')}
              onMouseLeave={() => setHoveredButton(null)}
              style={getButtonStyle('linkedin')}
            >
              LinkedIn
            </button>
            <button 
              onClick={handleCV}
              onMouseEnter={() => setHoveredButton('cv')}
              onMouseLeave={() => setHoveredButton(null)}
              style={getButtonStyle('cv')}
            >
              CV
            </button>
            <button 
              onClick={handleEditProfile}
              onMouseEnter={() => setHoveredButton('modifier')}
              onMouseLeave={() => setHoveredButton(null)}
              style={getButtonStyle('modifier')}
            >
              ✏️ Modifier
            </button>
          </div>
          
          {profileData?.skills && Array.isArray(profileData.skills) && profileData.skills.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ 
                fontSize: '1.1rem', 
                marginBottom: '0.8rem',
                color: 'white',
                fontWeight: '500'
              }}>
                Compétences :
              </p>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.5rem'
              }}>
                {profileData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      border: '1px solid rgba(255,255,255,0.3)',
                      fontWeight: '500'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {profileData?.languages && Array.isArray(profileData.languages) && profileData.languages.length > 0 && (
            <div>
              <p style={{ 
                fontSize: '1.1rem', 
                marginBottom: '0.8rem',
                color: 'white',
                fontWeight: '500'
              }}>
                Langues :
              </p>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.5rem'
              }}>
                {profileData.languages.map((language, index) => (
                  <span 
                    key={index} 
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      border: '1px solid rgba(255,255,255,0.3)',
                      fontWeight: '500'
                    }}
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>

      {/* Modal d'édition du profil */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#124f31',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Header du modal */}
            <div style={{
              background: '#124f31',
              padding: '1.5rem',
              borderRadius: '12px 12px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '12px',
                  borderRadius: '8px'
                }}>
                  ⚙️
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Modifier mon profil</h2>
                  <p style={{ margin: 0, opacity: 0.8 }}>Personnalisez vos informations professionnelles</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                ✕
                </button>
            </div>
            
            {/* Contenu du modal */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '0 0 12px 12px'
            }}>
              {/* Section Photo de profil */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  color: '#333', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                      Photo de profil
                    </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={editForm.photo || "/img/admin.png"} 
                    alt="Photo de profil"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #178f56'
                    }}
                  />
                  <div>
                        <input
                          type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'photo')}
                      style={{ display: 'none' }}
                          id="photo-upload"
                    />
                    <label 
                      htmlFor="photo-upload"
                      style={{
                        background: '#178f56',
                        color: 'white',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: 'none',
                        fontSize: '1rem'
                      }}
                    >
                          📷 Choisir une photo
                        </label>
                    <p style={{ 
                      fontSize: '0.85rem', 
                      color: '#666', 
                      margin: '0.5rem 0 0 0',
                      fontStyle: 'italic'
                    }}>
                      Formats supportés : JPG, PNG, GIF (max 5MB)
                    </p>
                      </div>
                    </div>
                  </div>

              {/* Section Description professionnelle */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  color: '#333', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                      Description professionnelle
                    </h3>
                      <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Décrivez votre parcours professionnel..."
                />
              </div>

              {/* Section Compétences */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  color: '#333', 
                  marginBottom: '1rem'
                }}>
                  Compétences
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      id="skill-input"
                      type="text"
                      placeholder="Tapez une compétence et appuyez sur Entrée (ex: React, Python...)"
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          const newSkill = e.target.value.trim();
                          if (!editForm.skills.includes(newSkill)) {
                            setEditForm({
                              ...editForm, 
                              skills: [...editForm.skills, newSkill]
                            });
                            console.log('✅ Compétence ajoutée:', newSkill);
                          }
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('skill-input');
                        const newSkill = input.value.trim();
                        if (newSkill && !editForm.skills.includes(newSkill)) {
                          setEditForm({
                            ...editForm, 
                            skills: [...editForm.skills, newSkill]
                          });
                          console.log('✅ Compétence ajoutée:', newSkill);
                          input.value = '';
                        }
                      }}
                      style={{
                        background: '#178f56',
                        color: 'white',
                        border: 'none',
                        padding: '0.8rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      Ajouter
                    </button>
                  </div>
                  <p style={{ 
                    fontSize: '0.85rem', 
                    color: '#666', 
                    margin: '0.5rem 0 0 0',
                    fontStyle: 'italic'
                  }}>
                    💡 Tapez une compétence et appuyez sur Entrée ou cliquez sur "Ajouter"
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {editForm.skills.map((skill, index) => (
                    <span 
                      key={index}
                      style={{
                        background: '#e6f7f0',
                        color: '#178f56',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {skill}
                      <button
                        onClick={() => {
                          setEditForm({
                            ...editForm,
                            skills: editForm.skills.filter((_, i) => i !== index)
                          });
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#178f56',
                          cursor: 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Section Langues */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  color: '#333', 
                  marginBottom: '1rem'
                }}>
                  Langues
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      id="language-input"
                      type="text"
                      placeholder="Tapez une langue et appuyez sur Entrée (ex: Français, Anglais...)"
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          const newLanguage = e.target.value.trim();
                          if (!editForm.languages.includes(newLanguage)) {
                            setEditForm({
                              ...editForm, 
                              languages: [...editForm.languages, newLanguage]
                            });
                            console.log('✅ Langue ajoutée:', newLanguage);
                          }
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('language-input');
                        const newLanguage = input.value.trim();
                        if (newLanguage && !editForm.languages.includes(newLanguage)) {
                          setEditForm({
                            ...editForm, 
                            languages: [...editForm.languages, newLanguage]
                          });
                          console.log('✅ Langue ajoutée:', newLanguage);
                          input.value = '';
                        }
                      }}
                      style={{
                        background: '#178f56',
                        color: 'white',
                        border: 'none',
                        padding: '0.8rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      Ajouter
                    </button>
                  </div>
                  <p style={{ 
                    fontSize: '0.85rem', 
                    color: '#666', 
                    margin: '0.5rem 0 0 0',
                    fontStyle: 'italic'
                  }}>
                    💡 Tapez une langue et appuyez sur Entrée ou cliquez sur "Ajouter"
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {editForm.languages.map((language, index) => (
                    <span 
                      key={index}
                      style={{
                        background: '#e6f7f0',
                        color: '#178f56',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {language}
                      <button
                        onClick={() => {
                          setEditForm({
                            ...editForm,
                            languages: editForm.languages.filter((_, i) => i !== index)
                          });
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#178f56',
                          cursor: 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                  </div>

              {/* Section Liens professionnels */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  color: '#333', 
                  marginBottom: '1rem'
                }}>
                      Liens professionnels
                    </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* LinkedIn */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          LinkedIn
                        </label>
                        <input
                          type="url"
                      value={editForm.linkedin}
                      onChange={(e) => setEditForm({...editForm, linkedin: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="https://linkedin.com/in/yassine-zilili"
                        />
                      </div>

                  {/* CV */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          CV (Fichier)
                        </label>
                    <div>
                          <input
                            type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, 'cv')}
                        style={{ display: 'none' }}
                            id="cv-upload"
                      />
                      <label 
                        htmlFor="cv-upload"
                        style={{
                          background: editForm.cv ? '#178f56' : '#6c757d',
                          color: 'white',
                          padding: '0.8rem 1.5rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          border: 'none',
                          fontSize: '1rem',
                          width: '100%',
                          justifyContent: 'center'
                        }}
                      >
                            {editForm.cv ? '✅ CV Sélectionné' : '📄 Télécharger CV'}
                          </label>
                      <p style={{ 
                        fontSize: '0.85rem', 
                        color: '#666', 
                        margin: '0.5rem 0 0 0',
                        fontStyle: 'italic'
                      }}>
                        Formats supportés : PDF, DOC, DOCX (max 10MB)
                      </p>
                        </div>
                      </div>
                    </div>
                  </div>

              {/* Boutons d'action */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'flex-end',
                paddingTop: '1rem',
                borderTop: '1px solid #eee'
              }}>
                <button 
                  onClick={() => setShowEditModal(false)}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={loading}
                  style={{
                    background: loading ? '#94a3a0' : '#178f56',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? '⏳ Enregistrement...' : '💾 Enregistrer'}
                </button>
              </div>
                    </div>
                  </div>
                </div>
      )}

      {/* Sections projets et commentaires */}
      <div style={{ 
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Projets */}
        <div>
          <h2 style={{ 
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#333'
          }}>
            Projets réalisés
          </h2>
          {profileData.projects.map((project, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ 
                fontSize: '1.2rem',
                marginBottom: '0.5rem',
                color: '#333'
              }}>
                {project.titre}
              </h4>
              <p style={{ 
                color: '#666',
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {project.description}
              </p>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                {project.technologies.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    style={{
                      background: '#e6f7f0',
                      color: '#178f56',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <span style={{
                background: '#d4edda',
                color: '#155724',
                padding: '0.3rem 0.8rem',
                borderRadius: '15px',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                Terminé
              </span>
            </div>
          ))}
        </div>

        {/* Commentaires */}
        <div>
          <h2 style={{ 
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#333'
          }}>
            Commentaires
          </h2>
          {profileData.comments.map((comment, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <strong style={{ color: '#333' }}>{comment.client_nom}</strong>
                <div>
                  {renderStars(comment.note)}
                </div>
              </div>
              <p style={{ 
                color: '#666',
                marginBottom: '0.5rem',
                lineHeight: '1.5'
              }}>
                {comment.commentaire}
              </p>
              <span style={{ 
                color: '#999',
                fontSize: '0.9rem'
              }}>
                {comment.date}
              </span>
            </div>
          ))}
            </div>
          </div>
    </div>
  );
};

export default Portfolio; 