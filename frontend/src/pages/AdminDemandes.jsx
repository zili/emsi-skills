import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const statusColors = {
  "En attente": "#f7a600",
  "pending": "#f7a600",
  "Accepté": "#1dbf73",
  "accepted": "#1dbf73",
  "approved": "#1dbf73",
  "Refusé": "#ff4d4d",
  "rejected": "#ff4d4d"
};

const statusList = ["Tous", "En attente", "Accepté", "Refusé"];

const AdminDemandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Charger les candidatures depuis l'API
  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const response = await fetch('http://localhost:8000/api/candidatures/', {
          headers
        });

        if (response.ok) {
          const data = await response.json();
          const candidatures = data.results || data || [];
          
          // Transformer les données pour correspondre au format attendu
          const transformedDemandes = candidatures.map(candidature => ({
            id: candidature.id,
            club: {
              name: candidature.project?.owner?.username || 'Utilisateur',
              type: candidature.project?.owner?.user_type === 'professional' ? 'Professionnel' : 'Étudiant',
              email: candidature.project?.owner?.email || 'email@emsi.ma',
              logo: candidature.project?.owner?.profile_picture || "/img/user-default.png"
            },
            titre: candidature.project?.title || 'Projet sans titre',
            description: candidature.cover_letter || candidature.project?.description || 'Aucune description',
            date: candidature.created_at ? new Date(candidature.created_at).toLocaleDateString('fr-FR') : 'N/A',
            statut: candidature.status === 'pending' ? 'En attente' : 
                   candidature.status === 'accepted' || candidature.status === 'approved' ? 'Accepté' : 
                   candidature.status === 'rejected' ? 'Refusé' : candidature.status,
            photoProjet: candidature.project?.image || "/img/projet-default.jpg",
            candidature_id: candidature.id,
            project_id: candidature.project?.id
          }));
          
          setDemandes(transformedDemandes);
        } else if (response.status === 401) {
          navigate('/login');
        } else {
          setError('Erreur lors du chargement des candidatures');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les candidatures');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, [navigate]);

  const handleAction = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const demande = demandes.find(d => d.id === id);
      if (!demande) return;

      const endpoint = newStatus === 'Accepté' ? 'accept' : 'reject';
      const apiStatus = newStatus === 'Accepté' ? 'accepted' : 'rejected';

      const response = await fetch(`http://localhost:8000/api/candidatures/${demande.candidature_id}/${endpoint}/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newStatus === 'Refusé' ? { reason: 'Candidature refusée par l\'administrateur' } : {})
      });

      if (response.ok) {
        setDemandes(demandes.map(d => d.id === id ? { ...d, statut: newStatus } : d));
        setSelected(null);
      } else {
        setError('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la mise à jour');
    }
  };

  const demandesFiltrees = filtreStatut === "Tous" ? demandes : demandes.filter(d => d.statut === filtreStatut);

  if (loading) {
    return (
      <div className="admin-layout-pro projets-layout">
        <AdminSidebar />
        <div className="admin-main-pro">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Chargement des candidatures...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout-pro projets-layout">
        <AdminSidebar />
        <div className="admin-main-pro">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Réessayer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout-pro projets-layout">
      <AdminSidebar />
      <div className="admin-main-pro">
        <div className="projets-main">
          <h1 style={{marginTop:32, marginBottom:24, fontWeight:800, color:'#116b41'}}>Candidatures aux projets</h1>

          {/* Filtre Statut */}
          <div style={{display:'flex', gap:12, marginBottom:24}}>
            {statusList.map(st => (
              <button
                key={st}
                onClick={()=>setFiltreStatut(st)}
                style={{
                  padding:'8px 18px',
                  borderRadius:20,
                  border:'none',
                  background: filtreStatut === st ? '#116b41' : '#e6f4ee',
                  color: filtreStatut === st ? '#fff' : '#116b41',
                  fontWeight:600,
                  fontSize:15,
                  cursor:'pointer',
                  transition:'all 0.2s'
                }}
              >
                {st} {st !== "Tous" && `(${demandes.filter(d => d.statut === st).length})`}
              </button>
            ))}
          </div>

          <div style={{background:'#fff', borderRadius:18, boxShadow:'0 4px 24px rgba(17,143,86,0.09)', padding:32, minWidth:320, maxWidth:1200, marginLeft:0, marginRight:'auto'}}>
            {demandesFiltrees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Aucune candidature {filtreStatut !== "Tous" && `avec le statut "${filtreStatut}"`}</p>
              </div>
            ) : (
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{color:'#116b41', fontWeight:700, fontSize:18}}>
                    <th style={{textAlign:'left', padding:'12px 8px'}}>Candidat</th>
                    <th style={{textAlign:'left', padding:'12px 8px'}}>Projet</th>
                    <th style={{textAlign:'left', padding:'12px 8px'}}>Type</th>
                    <th style={{textAlign:'left', padding:'12px 8px'}}>Date</th>
                    <th style={{textAlign:'left', padding:'12px 8px'}}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {demandesFiltrees.map(d => (
                    <tr
                      key={d.id}
                      style={{
                        cursor:'pointer',
                        background: selected && selected.id === d.id ? '#e6f4ee' : undefined,
                        transition:'background 0.2s'
                      }}
                      onClick={()=>setSelected(d)}
                      onMouseEnter={e=>e.currentTarget.style.background='#e6f4ee'}
                      onMouseLeave={e=>e.currentTarget.style.background=(selected && selected.id === d.id ? '#e6f4ee' : '#fff')}
                    >
                      <td style={{padding:'14px 8px', display:'flex', alignItems:'center', gap:12}}>
                        <img src={d.club.logo} alt={d.club.name} style={{width:36, height:36, borderRadius:'50%', objectFit:'cover', border:'2px solid #1dbf73'}} />
                        <div>
                          <div style={{fontWeight:700, color:'#116b41'}}>{d.club.name}</div>
                          <div style={{color:'#7a8c85', fontSize:13}}>{d.club.email}</div>
                        </div>
                      </td>
                      <td style={{padding:'14px 8px', fontWeight:600, color:'#178f56'}}>{d.titre}</td>
                      <td style={{padding:'14px 8px'}}>{d.club.type}</td>
                      <td style={{padding:'14px 8px'}}>{d.date}</td>
                      <td style={{padding:'14px 8px'}}>
                        <span style={{background:statusColors[d.statut]+"22", color:statusColors[d.statut], padding:'6px 16px', borderRadius:12, fontWeight:700, fontSize:14}}>{d.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Modal détail */}
          {selected && (
            <div className="modal-projet-overlay" onClick={()=>setSelected(null)} style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
              <div className="modal-projet" onClick={e=>e.stopPropagation()} style={{background:'#fff', borderRadius:20, padding:32, width:'90%', maxWidth:500, maxHeight:'90vh', overflow:'auto'}}>
                {/* Photo du projet */}
                {selected.photoProjet && (
                  <img src={selected.photoProjet} alt="Projet visuel" style={{width:'100%', maxHeight:180, objectFit:'cover', borderRadius:14, marginBottom:18}} />
                )}
                <div style={{display:'flex', gap:18, alignItems:'center', marginBottom:24}}>
                  <img src={selected.club.logo} alt={selected.club.name} style={{width:60, height:60, borderRadius:'50%', objectFit:'cover', border:'2px solid #1dbf73'}} />
                  <div>
                    <div style={{fontWeight:800, fontSize:22, color:'#116b41'}}>{selected.club.name}</div>
                    <div style={{color:'#178f56', fontWeight:600, fontSize:15}}>{selected.club.type}</div>
                    <div style={{color:'#7a8c85', fontSize:14}}>{selected.club.email}</div>
                  </div>
                </div>
                <div style={{marginBottom:18}}>
                  <div style={{fontWeight:700, color:'#116b41', fontSize:18, marginBottom:8}}>Projet concerné</div>
                  <div style={{color:'#178f56', fontWeight:600, fontSize:16}}>{selected.titre}</div>
                </div>
                <div style={{marginBottom:18}}>
                  <div style={{fontWeight:700, color:'#116b41', fontSize:18, marginBottom:8}}>Lettre de motivation</div>
                  <div style={{color:'#7a8c85', fontSize:15}}>{selected.description}</div>
                </div>
                <div style={{marginBottom:18}}>
                  <div style={{fontWeight:700, color:'#116b41', fontSize:18, marginBottom:8}}>Date de candidature</div>
                  <div style={{color:'#178f56', fontWeight:600, fontSize:16}}>{selected.date}</div>
                </div>
                <div style={{marginBottom:18}}>
                  <div style={{fontWeight:700, color:'#116b41', fontSize:18, marginBottom:8}}>Statut</div>
                  <span style={{background:statusColors[selected.statut]+"22", color:statusColors[selected.statut], padding:'6px 16px', borderRadius:12, fontWeight:700, fontSize:14}}>{selected.statut}</span>
                </div>
                {selected.statut === "En attente" && (
                  <div style={{display:'flex', gap:18, marginTop:24}}>
                    <button onClick={()=>handleAction(selected.id, "Accepté")} style={{padding:'12px 24px', borderRadius:10, border:'none', background:'#1dbf73', color:'#fff', fontWeight:700, fontSize:16, cursor:'pointer'}}>Accepter</button>
                    <button onClick={()=>handleAction(selected.id, "Refusé")} style={{padding:'12px 24px', borderRadius:10, border:'none', background:'#ff4d4d', color:'#fff', fontWeight:700, fontSize:16, cursor:'pointer'}}>Refuser</button>
                  </div>
                )}
                <button onClick={()=>setSelected(null)} style={{marginTop:32, padding:'10px 18px', borderRadius:8, border:'none', background:'#e6f4ee', color:'#116b41', fontWeight:600, width:'100%', cursor:'pointer'}}>Fermer</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDemandes; 