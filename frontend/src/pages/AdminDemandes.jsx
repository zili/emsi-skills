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
  const [error, setError] = useState('');

  // Charger les projets depuis l'API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('🔄 Chargement des projets depuis l\'API...');
        const token = localStorage.getItem('access_token');
        
        const response = await fetch('http://localhost:8000/api/projects/simple/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
        });

        console.log('📡 Réponse API projets:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📊 Données projets reçues:', data);
        console.log('📊 Nombre de projets:', data.length);
        
        setProjects(data);
        setError('');
        console.log('✅ Projets chargés avec succès:', data.length);
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement des projets:', error);
        setError(`Erreur lors du chargement des projets: ${error.message}`);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fonction pour approuver un projet
  const approveProject = async (projectId) => {
    try {
      console.log('🔄 Approbation du projet:', projectId);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/approve/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Projet approuvé:', data);
        
        // Recharger les projets pour avoir les données à jour
        const updatedResponse = await fetch('http://localhost:8000/api/projects/simple/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
        });
        
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setProjects(updatedData);
          
          // Mettre à jour le projet sélectionné
          const updatedProject = updatedData.find(p => p.id === projectId);
          if (selectedProject?.id === projectId && updatedProject) {
            setSelectedProject(updatedProject);
          }
        }
        
        alert('Projet approuvé avec succès !');
      } else {
        throw new Error('Erreur lors de l\'approbation');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'approbation:', error);
      alert('Erreur lors de l\'approbation du projet');
    }
  };

  // Fonction pour rejeter un projet
  const rejectProject = async (projectId, reason = '') => {
    try {
      console.log('🔄 Rejet du projet:', projectId);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/reject/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Projet rejeté:', data);
        
        // Recharger les projets pour avoir les données à jour
        const updatedResponse = await fetch('http://localhost:8000/api/projects/simple/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
        });
        
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setProjects(updatedData);
          
          // Mettre à jour le projet sélectionné
          const updatedProject = updatedData.find(p => p.id === projectId);
          if (selectedProject?.id === projectId && updatedProject) {
            setSelectedProject(updatedProject);
          }
        }
        
        alert('Projet rejeté avec succès !');
      } else {
        throw new Error('Erreur lors du rejet');
      }
    } catch (error) {
      console.error('❌ Erreur lors du rejet:', error);
      alert('Erreur lors du rejet du projet');
    }
  };

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
        
        {/* Indicateur de source des données */}
        <div style={{
          marginBottom: '16px',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          display: 'inline-block',
          backgroundColor: '#e6f7ff',
          color: '#1890ff',
          border: '1px solid #91d5ff'
        }}>
          🌐 Données en temps réel (API Backend)
        </div>

        {/* Message d'erreur si nécessaire */}
        {error && (
          <div style={{
            background: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '8px', 
            padding: '16px', 
            margin: '20px 0', 
            color: '#856404'
          }}>
            <div style={{ marginBottom: '12px' }}>⚠️ {error}</div>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1dbf73',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Recharger
            </button>
          </div>
        )}
        
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
                      {(selectedProject.owner?.first_name?.[0] || '') + (selectedProject.owner?.last_name?.[0] || '')}
                    </div>
                    <div>
                      <div style={{fontWeight:600, color:'#116b41', fontSize:16}}>
                        {selectedProject.owner?.full_name || 
                         `${selectedProject.owner?.first_name || ''} ${selectedProject.owner?.last_name || ''}`.trim() ||
                         selectedProject.owner?.username || 'Utilisateur'}
                      </div>
                      <div style={{color:'#7a8c85', fontSize:14}}>
                        @{selectedProject.owner?.username || 'username'}
                      </div>
                      <div style={{color:'#178f56', fontSize:13}}>
                        {selectedProject.owner?.email || 'email@emsi.ma'}
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
                        {selectedProject.skills && selectedProject.skills.map((skill, index) => (
                          <span 
                            key={`skill-${selectedProject.id}-${index}`}
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
                    onClick={() => approveProject(selectedProject.id)}
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
                      const reason = prompt('Raison du rejet (optionnel):');
                      if (reason !== null) { // null si utilisateur annule
                        rejectProject(selectedProject.id, reason);
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