import React, { useState, useEffect } from 'react';
import './AdminDemandes.scss';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

const AdminDemandes = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Données mockées pour les projets avec candidatures
  const mockProjects = [
    {
      id: 1,
      title: "Développement d'une application mobile",
      description: "Création d'une application mobile pour la gestion des étudiants avec React Native",
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: { name: "Développement" },
      owner: { first_name: "Ahmed", last_name: "Bennani", username: "abennani", email: "ahmed.bennani@emsi-edu.ma" },
      skills: ["React Native", "JavaScript", "TypeScript", "Redux", "API REST"],
      created_at: "2024-01-15T10:00:00Z",
      status: "En attente",
      candidatures_count: 12
    },
    {
      id: 2,
      title: "Design d'interface utilisateur",
      description: "Conception d'une interface moderne pour une plateforme e-learning avec Figma",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: { name: "Design" },
      owner: { first_name: "Fatima", last_name: "Zahra", username: "fzahra", email: "fatima.zahra@emsi-edu.ma" },
      skills: ["Figma", "Adobe XD", "UI/UX Design", "Prototyping", "User Research"],
      created_at: "2024-01-14T15:30:00Z", 
      status: "Approuvé",
      candidatures_count: 8
    },
    {
      id: 3,
      title: "Système de gestion des stocks",
      description: "Développement d'un système complet de gestion des stocks pour une entreprise",
      image: "https://images.pexels.com/photos/586103/pexels-photo-586103.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: { name: "Informatique" },
      owner: { first_name: "Omar", last_name: "Benali", username: "obenali", email: "omar.benali@emsi-edu.ma" },
      skills: ["Java", "Spring Boot", "MySQL", "Angular", "API REST"],
      created_at: "2024-01-13T09:15:00Z",
      status: "En attente",
      candidatures_count: 15
    },
    {
      id: 4,
      title: "Application de gestion événementielle",
      description: "Plateforme web pour la gestion complète d'événements universitaires",
      image: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: { name: "Web" },
      owner: { first_name: "Sara", last_name: "Khalil", username: "skhalil", email: "sara.khalil@emsi-edu.ma" },
      skills: ["React", "Node.js", "Express", "PostgreSQL", "Socket.io"],
      created_at: "2024-01-12T11:20:00Z",
      status: "Refusé",
      candidatures_count: 6
    },
    {
      id: 5,
      title: "Bot de trading automatisé",
      description: "Développement d'un bot intelligent pour le trading automatique des cryptomonnaies",
      image: "https://images.pexels.com/photos/7821921/pexels-photo-7821921.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: { name: "FinTech" },
      owner: { first_name: "Hamza", last_name: "Radi", username: "hradi", email: "hamza.radi@emsi-edu.ma" },
      skills: ["Python", "Machine Learning", "TensorFlow", "API Trading", "Blockchain"],
      created_at: "2024-01-10T16:45:00Z",
      status: "En attente",
      candidatures_count: 9
    },
    {
      id: 6,
      title: "Plateforme e-learning adaptative",
      description: "Système d'apprentissage en ligne avec intelligence artificielle pour personnaliser les parcours",
      image: "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: { name: "Education" },
      owner: { first_name: "Laila", last_name: "Hamidi", username: "lhamidi", email: "laila.hamidi@emsi-edu.ma" },
      skills: ["Python", "Django", "AI/ML", "React", "PostgreSQL", "Docker"],
      created_at: "2024-01-08T14:00:00Z",
      status: "En attente",
      candidatures_count: 18
    }
  ];



  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(search.toLowerCase()) ||
    project.description.toLowerCase().includes(search.toLowerCase()) ||
    project.category.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-layout-pro">
        <AdminSidebar />
        <div className="admin-main-pro">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Chargement des demandes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout-pro">
      <AdminSidebar />
      <div className="admin-main-pro" style={{padding:32, background:'#f8fffe'}}>
        <h1 style={{marginBottom:32, fontWeight:800, color:'#116b41'}}>Gestion des Demandes</h1>
        
        {/* Statistiques */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20, marginBottom:32}}>
          <div style={{background:'#fff', padding:20, borderRadius:12, textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color:'#116b41', margin:0, fontSize:24}}>{projects.length}</h3>
            <p style={{color:'#7a8c85', margin:'8px 0 0 0'}}>Total des projets</p>
          </div>
          <div style={{background:'#fff', padding:20, borderRadius:12, textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color:'#4caf50', margin:0, fontSize:24}}>
              {projects.filter(p => p.status === 'Approuvé').length}
            </h3>
            <p style={{color:'#7a8c85', margin:'8px 0 0 0'}}>Projets approuvés</p>
          </div>
          <div style={{background:'#fff', padding:20, borderRadius:12, textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color:'#ff9800', margin:0, fontSize:24}}>
              {projects.filter(p => p.status === 'En attente').length}
            </h3>
            <p style={{color:'#7a8c85', margin:'8px 0 0 0'}}>En attente</p>
          </div>
          <div style={{background:'#fff', padding:20, borderRadius:12, textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color:'#f44336', margin:0, fontSize:24}}>
              {projects.filter(p => p.status === 'Refusé').length}
            </h3>
            <p style={{color:'#7a8c85', margin:'8px 0 0 0'}}>Projets refusés</p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div style={{marginBottom:24}}>
          <input 
            type="text" 
            placeholder="Rechercher un projet..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding:'12px 16px', 
              borderRadius:8, 
              border:'2px solid #e6f4ee', 
              minWidth:400,
              fontSize:16,
              outline:'none',
              transition:'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#1dbf73'}
            onBlur={e => e.target.style.borderColor = '#e6f4ee'}
          />
        </div>

        <div style={{display:'grid', gridTemplateColumns: selectedProject ? '1fr 1fr' : '1fr', gap:24, alignItems:'start'}}>
          {/* Liste des projets */}
          <div style={{background:'#fff', borderRadius:12, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.1)'}}>
            <h2 style={{color:'#116b41', marginBottom:20, fontSize:20, fontWeight:700}}>
              Projets soumis ({filteredProjects.length})
            </h2>
            
            {filteredProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Aucun projet trouvé</p>
              </div>
            ) : (
              <div style={{display:'grid', gap:16}}>
                {filteredProjects.map(project => (
                  <div 
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    style={{
                      display:'flex',
                      alignItems:'center',
                      gap:16,
                      padding:16,
                      borderRadius:12,
                      border: selectedProject?.id === project.id ? '2px solid #1dbf73' : '2px solid #e6f4ee',
                      background: selectedProject?.id === project.id ? '#f8fffe' : '#fff',
                      cursor:'pointer',
                      transition:'all 0.3s ease'
                    }}
                    onMouseEnter={e => {
                      if (selectedProject?.id !== project.id) {
                        e.currentTarget.style.borderColor = '#1dbf73';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(29,191,115,0.1)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedProject?.id !== project.id) {
                        e.currentTarget.style.borderColor = '#e6f4ee';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <img 
                      src={project.image} 
                      alt={project.title}
                      style={{width:80, height:80, borderRadius:8, objectFit:'cover'}}
                    />
                    <div style={{flex:1}}>
                      <h3 style={{color:'#116b41', fontSize:16, fontWeight:700, margin:'0 0 4px 0'}}>
                        {project.title}
                      </h3>
                      <p style={{color:'#7a8c85', fontSize:14, margin:'0 0 8px 0', lineHeight:1.4}}>
                        {project.description.length > 100 ? project.description.substring(0, 100) + '...' : project.description}
                      </p>
                                                                   <div style={{display:'flex', alignItems:'center', gap:16, fontSize:13}}>
                        <span style={{color:'#178f56', fontWeight:600}}>
                          {project.category.name}
                        </span>
                        <span style={{
                          padding:'2px 8px',
                          borderRadius:10,
                          background: project.status === 'Approuvé' ? '#c8e6c9' : 
                                     project.status === 'Refusé' ? '#ffcdd2' : '#fff3e0',
                          color: project.status === 'Approuvé' ? '#2e7d32' : 
                                 project.status === 'Refusé' ? '#c62828' : '#f57c00',
                          fontSize:11,
                          fontWeight:600
                        }}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

                    {/* Détails du projet */}
          {selectedProject && (
            <div style={{background:'#fff', borderRadius:12, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.1)'}}>
              <h2 style={{color:'#116b41', marginBottom:20, fontSize:20, fontWeight:700}}>
                Détails du projet: {selectedProject.title}
              </h2>
              
              {/* Image du projet */}
              <div style={{marginBottom:24}}>
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  style={{width:'100%', height:250, borderRadius:12, objectFit:'cover'}}
                />
              </div>

              {/* Informations principales */}
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24}}>
                <div>
                  <h4 style={{color:'#116b41', margin:'0 0 8px 0', fontSize:16}}>Proposé par:</h4>
                  <div style={{display:'flex', alignItems:'center', gap:12, background:'#f8fffe', padding:16, borderRadius:8}}>
                    <div style={{
                      width:50,
                      height:50,
                      borderRadius:'50%',
                      background:'#1dbf73',
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      color:'white',
                      fontWeight:700,
                      fontSize:16
                    }}>
                      {selectedProject.owner.first_name[0]}{selectedProject.owner.last_name[0]}
                    </div>
                    <div>
                      <div style={{fontWeight:600, color:'#116b41', fontSize:16}}>
                        {selectedProject.owner.first_name} {selectedProject.owner.last_name}
                      </div>
                      <div style={{color:'#7a8c85', fontSize:14}}>
                        @{selectedProject.owner.username}
                      </div>
                      <div style={{color:'#178f56', fontSize:13}}>
                        {selectedProject.owner.email}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{color:'#116b41', margin:'0 0 8px 0', fontSize:16}}>Informations du projet:</h4>
                  <div style={{background:'#f8fffe', padding:16, borderRadius:8}}>
                    <div style={{marginBottom:12}}>
                      <strong style={{color:'#116b41'}}>Catégorie:</strong>
                      <span style={{marginLeft:8, color:'#7a8c85'}}>{selectedProject.category.name}</span>
                    </div>
                    <div style={{marginBottom:12}}>
                      <strong style={{color:'#116b41'}}>Compétences requises:</strong>
                      <div style={{marginTop:8, display:'flex', flexWrap:'wrap', gap:6}}>
                        {selectedProject.skills.map((skill, index) => (
                          <span 
                            key={index}
                            style={{
                              padding:'4px 8px',
                              background:'#e8f5e8',
                              color:'#116b41',
                              borderRadius:12,
                              fontSize:11,
                              fontWeight:600
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{marginBottom:12}}>
                      <strong style={{color:'#116b41'}}>Date de soumission:</strong>
                      <span style={{marginLeft:8, color:'#7a8c85'}}>
                        {new Date(selectedProject.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div>
                      <strong style={{color:'#116b41'}}>Statut actuel:</strong>
                      <span style={{
                        marginLeft:8,
                        padding:'4px 12px',
                        borderRadius:12,
                        background: selectedProject.status === 'Approuvé' ? '#c8e6c9' : 
                                   selectedProject.status === 'Refusé' ? '#ffcdd2' : '#fff3e0',
                        color: selectedProject.status === 'Approuvé' ? '#2e7d32' : 
                               selectedProject.status === 'Refusé' ? '#c62828' : '#f57c00',
                        fontSize:12,
                        fontWeight:600
                      }}>
                        {selectedProject.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{marginBottom:24}}>
                <h4 style={{color:'#116b41', margin:'0 0 12px 0', fontSize:16}}>Description du projet:</h4>
                <div style={{background:'#f8fffe', padding:20, borderRadius:8, lineHeight:1.6}}>
                  <p style={{margin:0, color:'#555', fontSize:15}}>
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              {/* Actions de l'admin */}
              {selectedProject.status === 'En attente' && (
                <div style={{display:'flex', gap:16, justifyContent:'center', paddingTop:20, borderTop:'1px solid #e6f4ee'}}>
                  <button
                    onClick={() => {
                      // Logique pour approuver le projet
                      setProjects(prev => 
                        prev.map(project => 
                          project.id === selectedProject.id 
                            ? { ...project, status: 'Approuvé' }
                            : project
                        )
                      );
                      setSelectedProject({...selectedProject, status: 'Approuvé'});
                      alert(`Projet "${selectedProject.title}" approuvé avec succès !`);
                    }}
                    style={{
                      padding:'12px 32px',
                      background:'#4caf50',
                      border:'none',
                      borderRadius:8,
                      color:'white',
                      fontSize:16,
                      fontWeight:600,
                      cursor:'pointer',
                      transition:'all 0.3s ease',
                      boxShadow:'0 2px 8px rgba(76,175,80,0.3)'
                    }}
                    onMouseEnter={e => {
                      e.target.style.background = '#45a049';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(76,175,80,0.4)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = '#4caf50';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(76,175,80,0.3)';
                    }}
                  >
                    ✅ Approuver le projet
                  </button>
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Êtes-vous sûr de vouloir refuser ce projet ?')) {
                        // Logique pour refuser le projet
                        setProjects(prev => 
                          prev.map(project => 
                            project.id === selectedProject.id 
                              ? { ...project, status: 'Refusé' }
                              : project
                          )
                        );
                        setSelectedProject({...selectedProject, status: 'Refusé'});
                        alert(`Projet "${selectedProject.title}" refusé.`);
                      }
                    }}
                    style={{
                      padding:'12px 32px',
                      background:'#f44336',
                      border:'none',
                      borderRadius:8,
                      color:'white',
                      fontSize:16,
                      fontWeight:600,
                      cursor:'pointer',
                      transition:'all 0.3s ease',
                      boxShadow:'0 2px 8px rgba(244,67,54,0.3)'
                    }}
                    onMouseEnter={e => {
                      e.target.style.background = '#d32f2f';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(244,67,54,0.4)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = '#f44336';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(244,67,54,0.3)';
                    }}
                  >
                    ❌ Refuser le projet
                  </button>
                </div>
              )}

              {selectedProject.status !== 'En attente' && (
                <div style={{textAlign:'center', paddingTop:20, borderTop:'1px solid #e6f4ee'}}>
                  <p style={{
                    margin:0, 
                    color: selectedProject.status === 'Approuvé' ? '#2e7d32' : '#c62828',
                    fontSize:16,
                    fontWeight:600
                  }}>
                    ✓ Ce projet a déjà été {selectedProject.status.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDemandes; 