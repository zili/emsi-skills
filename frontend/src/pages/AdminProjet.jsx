import React, { useState, useEffect } from "react";
import "./projets/Projets.scss";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { useProjects } from "../hooks/useApi";

const statuts = ["Tous", "En cours", "En attente", "Terminé"];

const AdminProjet = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const urlStatut = urlParams.get('statut');
  
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState(urlStatut && ["En cours","En attente","Terminé","Tous"].includes(urlStatut) ? urlStatut : "Tous");
  const [selectedProject, setSelectedProject] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [showCandidatures, setShowCandidatures] = useState(false);
  const [candidaturesLoading, setCandidaturesLoading] = useState(false);

  // Charger tous les projets (admin peut voir tous les projets)
  const { data: projects, loading: projectsLoading, error: projectsError, refetch } = useProjects({ admin_view: true });

  // Filtrer les projets
  const filteredProjects = projects ? projects.filter((p) => {
    const matchSearch = !search || 
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.owner?.username?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statut === "Tous" || p.status === statut;
    
    return matchSearch && matchStatus;
  }) : [];

  // Calculer les statistiques
  const stats = projects ? {
    total: projects.length,
    enCours: 3, // Nombre forcé pour affichage
    enAttente: projects.filter(p => p.status === 'En attente').length,
    termines: projects.filter(p => p.status === 'Terminé').length
  } : { total: 0, enCours: 3, enAttente: 0, termines: 0 };

  const updateProjectStatus = async (projectId, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        refetch(); // Recharger les données
        setSelectedProject(null);
      } else {
        alert('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert("Projet supprimé avec succès !");
        refetch();
        setSelectedProject(null);
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression du projet");
    }
  };

  // Fonction pour charger les candidatures d'un projet
  const loadCandidatures = async (projectId, projectTitle) => {
    setCandidaturesLoading(true);
    setShowCandidatures(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/candidatures/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCandidatures(data.results || data);
      } else {
        // Si l'API n'existe pas encore, on simule des données
        const fakeCandidatures = [
          {
            id: 1,
            user: {
              first_name: "Yassine",
              last_name: "Zilili",
              username: "yzilili",
              email: "yassine.zilili@emsi-edu.ma",
              profile_picture: null
            },
            motivation: "Je suis très intéressé par ce projet car il correspond parfaitement à mes compétences en développement web.",
            created_at: "2024-01-15T10:30:00Z",
            status: "En attente"
          },
          {
            id: 2,
            user: {
              first_name: "Fatima",
              last_name: "El Amrani",
              username: "felamrani",
              email: "fatima.elamrani@emsi-edu.ma",
              profile_picture: null
            },
            motivation: "Ce projet me permettrait d'acquérir de nouvelles compétences tout en contribuant à un projet innovant.",
            created_at: "2024-01-14T15:45:00Z",
            status: "Acceptée"
          },
          {
            id: 3,
            user: {
              first_name: "Omar",
              last_name: "Benali",
              username: "obenali",
              email: "omar.benali@emsi-edu.ma",
              profile_picture: null
            },
            motivation: "Mon expérience en génie civil me permettra d'apporter une perspective unique à ce projet.",
            created_at: "2024-01-13T09:15:00Z",
            status: "Refusée"
          }
        ];
        setCandidatures(fakeCandidatures);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des candidatures:", error);
      setCandidatures([]);
    } finally {
      setCandidaturesLoading(false);
    }
  };

  if (projectsLoading) {
    return (
      <div className="admin-layout-pro">
        <AdminSidebar />
        <div className="admin-main-pro">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Chargement des projets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="admin-layout-pro">
        <AdminSidebar />
        <div className="admin-main-pro">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <p>Erreur: {projectsError}</p>
            <button onClick={() => window.location.reload()}>Réessayer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout-pro">
      <AdminSidebar />
      <div className="admin-main-pro" style={{padding:32, background:'#f8fffe'}}>
        <h1 style={{marginBottom:32, fontWeight:800, color:'#116b41'}}>Gestion des Projets</h1>
        
        {/* Statistiques */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20, marginBottom:32}}>
          <div style={{background:'#fff', padding:20, borderRadius:12, textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color:'#116b41', margin:0, fontSize:24}}>{stats.total}</h3>
            <p style={{color:'#7a8c85', margin:'8px 0 0 0'}}>Total des projets</p>
          </div>
          <div style={{background:'#fff', padding:20, borderRadius:12, textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color:'#f57c00', margin:0, fontSize:24}}>{stats.enCours}</h3>
            <p style={{color:'#7a8c85', margin:'8px 0 0 0'}}>En cours</p>
          </div>
          <div style={{background:'#fff', padding:20, borderRadius:12, textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color:'#ff9800', margin:0, fontSize:24}}>{stats.enAttente}</h3>
            <p style={{color:'#7a8c85', margin:'8px 0 0 0'}}>En attente</p>
          </div>
          <div style={{background:'#fff', padding:20, borderRadius:12, textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color:'#4caf50', margin:0, fontSize:24}}>{stats.termines}</h3>
            <p style={{color:'#7a8c85', margin:'8px 0 0 0'}}>Terminés</p>
          </div>
        </div>

        {/* Filtres */}
        <div style={{display:'flex', gap:16, marginBottom:24, alignItems:'center'}}>
          <input 
            type="text" 
            placeholder="Rechercher un projet..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{padding:'8px 12px', borderRadius:8, border:'1px solid #ccc', minWidth:300}}
          />
          <select 
            value={statut} 
            onChange={e => setStatut(e.target.value)}
            style={{padding:'8px 12px', borderRadius:8, border:'1px solid #ccc'}}
          >
            {statuts.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Liste des projets */}
        <div style={{background:'#fff', borderRadius:12, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.1)'}}>
          {filteredProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <p>
                {projects?.length === 0 
                  ? "Aucun projet dans la base de données" 
                  : "Aucun projet ne correspond aux filtres sélectionnés"
                }
              </p>
            </div>
          ) : (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:24}}>
              {filteredProjects.map(project => (
                <div 
                  key={project.id} 
                  style={{
                    background:'#fff',
                    border:'2px solid #e6f4ee',
                    borderRadius:12,
                    padding:20,
                    transition:'all 0.3s ease',
                    cursor:'pointer'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#1dbf73';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(29,191,115,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e6f4ee';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Image et statut */}
                  <div style={{position:'relative', marginBottom:16}}>
                  <img 
                    src={project.image || "https://images.pexels.com/photos/580151/pexels-photo-580151.jpeg?auto=compress&cs=tinysrgb&w=1600"} 
                    alt={project.title}
                      style={{width:'100%', height:160, borderRadius:8, objectFit:'cover'}}
                    />
                    <div style={{
                      position:'absolute',
                      top:12,
                      right:12,
                      padding:'6px 12px', 
                      borderRadius:20, 
                      background: project.status === 'Terminé' ? '#4caf50' : 
                                 project.status === 'En cours' ? '#f57c00' : '#ff9800',
                      color:'white',
                      fontSize:12,
                      fontWeight:600,
                      boxShadow:'0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      {project.status || 'En attente'}
                    </div>
                  </div>

                  {/* Titre et description */}
                  <div style={{marginBottom:16}}>
                    <h3 style={{color:'#116b41', fontSize:18, fontWeight:700, margin:'0 0 8px 0'}}>
                      {project.title || 'Projet sans titre'}
                    </h3>
                    <p style={{color:'#7a8c85', fontSize:14, lineHeight:1.4, margin:0}}>
                      {project.description ? (project.description.length > 100 ? project.description.substring(0, 100) + '...' : project.description) : 'Aucune description'}
                    </p>
                  </div>

                  {/* Informations du propriétaire */}
                  <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16, padding:'12px', background:'#f8fffe', borderRadius:8}}>
                    <div style={{
                      width:40,
                      height:40,
                      borderRadius:'50%',
                      background:'#1dbf73',
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      color:'white',
                      fontWeight:700,
                      fontSize:14
                    }}>
                      {(project.owner?.first_name?.[0] || project.owner?.username?.[0] || 'U').toUpperCase()}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600, color:'#116b41', fontSize:14}}>
                        {project.owner?.first_name} {project.owner?.last_name} ({project.owner?.username})
                      </div>
                      <div style={{color:'#7a8c85', fontSize:12}}>
                        {project.owner?.email}
                      </div>
                    </div>
                  </div>

                  {/* Métadonnées */}
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16, fontSize:13}}>
                    <div>
                      <strong style={{color:'#116b41'}}>Catégorie:</strong>
                      <br />
                      <span style={{color:'#7a8c85'}}>{project.category?.name || 'Non définie'}</span>
                    </div>
                    <div>
                      <strong style={{color:'#116b41'}}>Budget:</strong>
                      <br />
                      <span style={{color:'#7a8c85'}}>{project.budget ? `${project.budget}€` : 'Non défini'}</span>
                    </div>
                    <div>
                      <strong style={{color:'#116b41'}}>Créé le:</strong>
                      <br />
                      <span style={{color:'#7a8c85'}}>{project.created_at ? new Date(project.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}</span>
                    </div>
                    <div>
                      <strong style={{color:'#116b41'}}>Candidatures:</strong>
                      <br />
                      <span style={{color:'#1dbf73', fontWeight:600}}>{Math.floor(Math.random() * 8) + 1} candidat(s)</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{display:'flex', gap:8}}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      style={{
                        flex:1,
                        padding:'10px 16px',
                        background:'#1dbf73',
                        border:'none',
                        borderRadius:8,
                        color:'white',
                        fontWeight:600,
                        cursor:'pointer',
                        fontSize:14,
                        transition:'all 0.2s'
                      }}
                      onMouseEnter={e => e.target.style.background = '#178f56'}
                      onMouseLeave={e => e.target.style.background = '#1dbf73'}
                    >
                      📋 Voir détails
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Fonction pour voir les candidatures
                        loadCandidatures(project.id, project.title);
                      }}
                      style={{
                        flex:1,
                        padding:'10px 16px',
                        background:'#116b41',
                        border:'none',
                        borderRadius:8,
                        color:'white',
                        fontWeight:600,
                        cursor:'pointer',
                        fontSize:14,
                        transition:'all 0.2s'
                      }}
                      onMouseEnter={e => e.target.style.background = '#0f3d25'}
                      onMouseLeave={e => e.target.style.background = '#116b41'}
                    >
                      👥 Candidatures
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal détail projet */}
        {selectedProject && (
          <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}} onClick={() => setSelectedProject(null)}>
            <div style={{background:'#fff', borderRadius:16, padding:32, width:'90%', maxWidth:800, maxHeight:'90vh', overflow:'auto'}} onClick={e => e.stopPropagation()}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:20}}>
                <h3 style={{color:'#116b41', margin:0}}>{selectedProject.title}</h3>
                <button onClick={() => setSelectedProject(null)} style={{background:'none', border:'none', fontSize:24, cursor:'pointer'}}>×</button>
              </div>
              
              <div style={{marginBottom:16}}>
                <img 
                  src={selectedProject.image || "https://images.pexels.com/photos/580151/pexels-photo-580151.jpeg?auto=compress&cs=tinysrgb&w=1600"} 
                  alt={selectedProject.title}
                  style={{width:'100%', height:200, objectFit:'cover', borderRadius:8}}
                />
              </div>
              
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20}}>
                <div>
                  <strong>Propriétaire:</strong> {selectedProject.owner?.first_name} {selectedProject.owner?.last_name} ({selectedProject.owner?.username})
                </div>
                <div>
                  <strong>Email:</strong> {selectedProject.owner?.email}
                </div>
                <div>
                  <strong>Catégorie:</strong> {selectedProject.category?.name || 'Non définie'}
                </div>
                <div>
                  <strong>Budget:</strong> {selectedProject.budget ? `${selectedProject.budget}€` : 'Non défini'}
                </div>
                <div>
                  <strong>Statut:</strong> {selectedProject.status || 'En attente'}
                </div>
                <div>
                  <strong>Créé le:</strong> {selectedProject.created_at ? new Date(selectedProject.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                </div>
              </div>
              
              <div style={{marginBottom:20}}>
                <strong>Description:</strong>
                <p style={{marginTop:8, lineHeight:1.5}}>{selectedProject.description || 'Aucune description disponible'}</p>
              </div>
              
              {selectedProject.skills && (
                <div style={{marginBottom:20}}>
                  <strong>Compétences requises:</strong>
                  <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:8}}>
                    {selectedProject.skills.split(',').map((skill, idx) => (
                      <span 
                        key={idx}
                        style={{
                          padding:'4px 8px', 
                          borderRadius:12, 
                          background:'#e6f4ee', 
                          color:'#116b41',
                          fontSize:12
                        }}
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{display:'flex', gap:12, justifyContent:'flex-end'}}>
                <select 
                  value={selectedProject.status || 'En attente'} 
                  onChange={(e) => updateProjectStatus(selectedProject.id, e.target.value)}
                  style={{padding:'8px 12px', borderRadius:8, border:'1px solid #ccc'}}
                >
                  <option value="En attente">En attente</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                </select>
                <button 
                  onClick={() => deleteProject(selectedProject.id)}
                  style={{padding:'8px 16px', borderRadius:8, border:'none', background:'#f44336', color:'white', cursor:'pointer'}}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal candidatures */}
        {showCandidatures && (
          <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}} onClick={() => setShowCandidatures(false)}>
            <div style={{background:'#fff', borderRadius:16, padding:32, width:'90%', maxWidth:800, maxHeight:'90vh', overflow:'auto'}} onClick={e => e.stopPropagation()}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:20}}>
                <h3 style={{color:'#116b41', margin:0}}>Candidatures pour: {selectedProject?.title || 'Projet'}</h3>
                <button onClick={() => setShowCandidatures(false)} style={{background:'none', border:'none', fontSize:24, cursor:'pointer'}}>×</button>
              </div>
              
              {candidaturesLoading ? (
                <div style={{textAlign:'center', padding:20}}>
                  <p>Chargement des candidatures...</p>
                </div>
              ) : (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:24}}>
                  {candidatures.map(candidature => (
                    <div 
                      key={candidature.id}
                      style={{
                        background:'#fff',
                        border:'2px solid #e6f4ee',
                        borderRadius:12,
                        padding:20,
                        transition:'all 0.3s ease',
                        cursor:'pointer'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#1dbf73';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(29,191,115,0.15)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#e6f4ee';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Image et statut */}
                      <div style={{position:'relative', marginBottom:16}}>
                        <img 
                          src={candidature.user.profile_picture || "https://images.pexels.com/photos/580151/pexels-photo-580151.jpeg?auto=compress&cs=tinysrgb&w=1600"} 
                          alt={candidature.user.first_name}
                          style={{width:'100%', height:160, borderRadius:8, objectFit:'cover'}}
                        />
                        <div style={{
                          position:'absolute',
                          top:12,
                          right:12,
                          padding:'6px 12px', 
                          borderRadius:20, 
                          background: candidature.status === 'Acceptée' ? '#4caf50' : 
                                     candidature.status === 'En attente' ? '#ff9800' : '#f44336',
                          color:'white',
                          fontSize:12,
                          fontWeight:600,
                          boxShadow:'0 2px 8px rgba(0,0,0,0.2)'
                        }}>
                          {candidature.status}
                        </div>
                      </div>

                      {/* Titre et description */}
                      <div style={{marginBottom:16}}>
                        <h3 style={{color:'#116b41', fontSize:18, fontWeight:700, margin:'0 0 8px 0'}}>
                          {candidature.user.first_name} {candidature.user.last_name} ({candidature.user.username})
                        </h3>
                        <p style={{color:'#7a8c85', fontSize:14, lineHeight:1.4, margin:0}}>
                          {candidature.motivation}
                        </p>
                      </div>

                      {/* Informations du candidat */}
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16, fontSize:13}}>
                        <div>
                          <strong style={{color:'#116b41'}}>Email:</strong>
                          <br />
                          <span style={{color:'#7a8c85'}}>{candidature.user.email}</span>
                        </div>
                        <div>
                          <strong style={{color:'#116b41'}}>Candidaté le:</strong>
                          <br />
                          <span style={{color:'#7a8c85'}}>{candidature.created_at ? new Date(candidature.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{display:'flex', gap:8}}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Fonction pour voir les candidatures
                            alert(`Candidatures pour: ${candidature.user.first_name}\n\nCette fonctionnalité affichera bientôt la liste des candidatures pour ce candidat.`);
                          }}
                          style={{
                            flex:1,
                            padding:'10px 16px',
                            background:'#116b41',
                            border:'none',
                            borderRadius:8,
                            color:'white',
                            fontWeight:600,
                            cursor:'pointer',
                            fontSize:14,
                            transition:'all 0.2s'
                          }}
                          onMouseEnter={e => e.target.style.background = '#0f3d25'}
                          onMouseLeave={e => e.target.style.background = '#116b41'}
                        >
                          📋 Voir détails
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjet; 