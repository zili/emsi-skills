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

  // Charger tous les projets (admin peut voir tous les projets)
  const { data: projects, loading, error, refetch } = useProjects({ admin_view: true });

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
    enCours: projects.filter(p => p.status === 'En cours').length,
    enAttente: projects.filter(p => p.status === 'En attente').length,
    termines: projects.filter(p => p.status === 'Terminé').length
  } : { total: 0, enCours: 0, enAttente: 0, termines: 0 };

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
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        refetch(); // Recharger les données
        setSelectedProject(null);
      } else {
        alert('Erreur lors de la suppression du projet');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du projet');
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="admin-layout-pro">
        <AdminSidebar />
        <div className="admin-main-pro">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <p>Erreur: {error}</p>
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
            <div style={{display:'grid', gap:16}}>
              {filteredProjects.map(project => (
                <div 
                  key={project.id} 
                  onClick={() => setSelectedProject(project)}
                  style={{
                    display:'flex', 
                    alignItems:'center', 
                    gap:16, 
                    padding:16, 
                    borderRadius:8, 
                    border:'1px solid #e6f4ee',
                    cursor:'pointer',
                    transition:'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e6f4ee'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <img 
                    src={project.image || "https://images.pexels.com/photos/580151/pexels-photo-580151.jpeg?auto=compress&cs=tinysrgb&w=1600"} 
                    alt={project.title}
                    style={{width:60, height:60, borderRadius:8, objectFit:'cover'}}
                  />
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600, color:'#116b41', marginBottom:4}}>
                      {project.title || 'Projet sans titre'}
                    </div>
                    <div style={{color:'#7a8c85', fontSize:14, marginBottom:4}}>
                      Par {project.owner?.username || 'Utilisateur inconnu'} • {project.owner?.email}
                    </div>
                    <div style={{color:'#178f56', fontSize:13}}>
                      {project.category?.name || 'Catégorie non définie'} • 
                      {project.budget ? ` ${project.budget}€` : ' Budget non défini'} • 
                      {project.created_at ? new Date(project.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </div>
                  </div>
                  <div style={{
                    padding:'4px 12px', 
                    borderRadius:20, 
                    background: project.status === 'Terminé' ? '#c8e6c9' : 
                               project.status === 'En cours' ? '#fff3e0' : '#ffecb3',
                    color: project.status === 'Terminé' ? '#2e7d32' : 
                           project.status === 'En cours' ? '#f57c00' : '#ff9800',
                    fontSize:12,
                    fontWeight:600
                  }}>
                    {project.status || 'En attente'}
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
      </div>
    </div>
  );
};

export default AdminProjet; 