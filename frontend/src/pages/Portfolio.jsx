import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Portfolio.scss";

const Portfolio = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Données par défaut pour Yassine Zilili (sans authentification)
  useEffect(() => {
    setTimeout(() => {
      setProfileData({
        name: "Yassine Zilili",
        photo: "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "Étudiant en ingénierie informatique passionné par le développement web et l'innovation.",
        linkedin: "https://www.linkedin.com/in/yassine-zilili",
        cv: "https://drive.google.com/file/d/1example_cv_file/view",
        skills: ["React", "Node.js", "UI/UX", "MongoDB", "Figma", "Python"],
        languages: ["Français", "Anglais"],
        projects: [
          {
            titre: "Plateforme de gestion de projets",
            description: "Application web complète pour la gestion de projets étudiants avec système d'authentification.",
            technologies: ["React", "Django", "PostgreSQL"],
            statut: "completed"
          },
          {
            titre: "Site e-commerce",
            description: "Boutique en ligne avec panier, paiement et gestion des commandes.",
            technologies: ["JavaScript", "Node.js", "MongoDB"],
            statut: "completed"
          }
        ],
        comments: [
          {
            client_nom: "Prof. Ahmed Bennani",
            commentaire: "Excellent travail sur le projet final. Code propre et bien structuré.",
            note: 5,
            date: "Décembre 2024"
          },
          {
            client_nom: "Dr. Fatima El Alami",
            commentaire: "Très bon niveau technique et respect des délais.",
            note: 4,
            date: "Novembre 2024"
          }
        ],
        stats: {
          projets_termines: 12,
          note_moyenne: 4.5,
          total_evaluations: 8,
          taux_recommandation: 95
        }
      });
      setLoading(false);
    }, 500);
  }, []);

  const handleLinkedIn = () => {
    if (profileData?.linkedin && profileData.linkedin !== "#") {
      window.open(profileData.linkedin, '_blank');
      console.log('Ouverture du LinkedIn de', profileData.name);
    } else {
      // Recherche LinkedIn par nom
      const searchUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(profileData?.name || 'Yassine Zilili')}`;
      window.open(searchUrl, '_blank');
      console.log('Recherche LinkedIn pour:', profileData?.name);
    }
  };

  const handleCV = () => {
    if (profileData?.cv && profileData.cv !== "#") {
      window.open(profileData.cv, '_blank');
      console.log('Ouverture du CV de', profileData.name);
    } else {
      // Créer un CV d'exemple ou rediriger vers une page de création de CV
      const cvUrl = 'https://www.canva.com/create/resumes/';
      window.open(cvUrl, '_blank');
      console.log('Redirection vers création de CV');
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
        {/* Photo à gauche */}
        <img 
          src={profileData.photo} 
          alt={profileData.name}
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
            {profileData.name}
          </h1>
          
          <div style={{ marginBottom: '0.5rem' }}>
            {renderStars(Math.round(profileData.stats.note_moyenne || 0))}
          </div>
          
          <p style={{ 
            fontSize: '1.2rem', 
            margin: '0 0 1rem 0',
            color: '#a0d4b8'
          }}>
            4IIR G4 Tanger
          </p>
          
          <p style={{ 
            fontSize: '1.1rem', 
            margin: '0 0 1.5rem 0',
            lineHeight: '1.5',
            maxWidth: '600px'
          }}>
            {profileData.description}
          </p>
          
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
              onClick={() => {
                alert('Fonctionnalité de modification en cours de développement!');
                console.log('Clic sur modifier le profil');
              }}
              onMouseEnter={() => setHoveredButton('modifier')}
              onMouseLeave={() => setHoveredButton(null)}
              style={getButtonStyle('modifier')}
            >
              ✏️ Modifier
            </button>
          </div>
          
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
        </div>
      </div>

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