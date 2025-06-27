import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useUsers, useCities } from "../hooks/useApi";
import "./projets/Projets.scss";

const annees = ["Toutes", "1ère année", "2ème année", "3ème année", "4ème année", "5ème année"];

const AdminComptes = () => {
  const [villeActive, setVilleActive] = useState(null);
  const [annee, setAnnee] = useState(annees[0]);
  const [search, setSearch] = useState("");
  const [etudiantDetail, setEtudiantDetail] = useState(null);

  // Charger les données depuis l'API
  const { data: users, loading: usersLoading, error: usersError } = useUsers();
  const { data: cities, loading: citiesLoading } = useCities();

  // Filtrer les utilisateurs
  const etudiantsFiltres = users ? users.filter(e => {
    const matchVille = !villeActive || e.city?.name === villeActive;
    const matchAnnee = annee === "Toutes" || e.academic_year === annee;
    const matchSearch = !search || 
      e.username?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.last_name?.toLowerCase().includes(search.toLowerCase());
    
    return matchVille && matchAnnee && matchSearch;
  }) : [];

  // Calculer les statistiques par ville
  const villesStats = cities ? cities.map(ville => {
    const count = users ? users.filter(u => u.city?.name === ville.name).length : 0;
    return { ...ville, count };
  }) : [];

  if (usersLoading || citiesLoading) {
    return (
      <div className="admin-layout-pro">
        <AdminSidebar />
        <div className="admin-main-pro">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="admin-layout-pro">
        <AdminSidebar />
        <div className="admin-main-pro">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <p>Erreur: {usersError}</p>
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
          <h1 style={{marginTop:32, marginBottom:24, fontWeight:800, color:'#116b41'}}>Comptes étudiants</h1>
          
          {/* Stats par ville */}
          <div style={{marginBottom:32}}>
            <h2 style={{color:'#116b41', marginBottom:16}}>Répartition par ville</h2>
            <div style={{display:'flex', gap:16, flexWrap:'wrap'}}>
              <div 
                onClick={() => setVilleActive(null)}
                style={{
                  padding:'12px 20px', 
                  borderRadius:12, 
                  background: !villeActive ? '#116b41' : '#e6f4ee', 
                  color: !villeActive ? '#fff' : '#116b41',
                  cursor:'pointer',
                  fontWeight:600,
                  transition:'all 0.2s'
                }}
              >
                Toutes ({users?.length || 0})
              </div>
              {villesStats.map(ville => (
                <div 
                  key={ville.id}
                  onClick={() => setVilleActive(ville.name)}
                  style={{
                    padding:'12px 20px', 
                    borderRadius:12, 
                    background: villeActive === ville.name ? '#116b41' : '#e6f4ee', 
                    color: villeActive === ville.name ? '#fff' : '#116b41',
                    cursor:'pointer',
                    fontWeight:600,
                    transition:'all 0.2s'
                  }}
                >
                  {ville.name} ({ville.count})
                </div>
              ))}
            </div>
          </div>

          {/* Filtres */}
          <div style={{display:'flex', gap:16, marginBottom:24, alignItems:'center'}}>
            <select 
              value={annee} 
              onChange={e => setAnnee(e.target.value)}
              style={{padding:'8px 12px', borderRadius:8, border:'1px solid #ccc'}}
            >
              {annees.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <input 
              type="text" 
              placeholder="Rechercher un étudiant..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{padding:'8px 12px', borderRadius:8, border:'1px solid #ccc', minWidth:250}}
            />
          </div>

          {/* Liste des étudiants */}
          <div style={{background:'#fff', borderRadius:12, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.1)'}}>
            {etudiantsFiltres.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Aucun étudiant trouvé</p>
              </div>
            ) : (
              <div style={{display:'grid', gap:16}}>
                {etudiantsFiltres.map(etudiant => (
                  <div 
                    key={etudiant.id} 
                    onClick={() => setEtudiantDetail(etudiant)}
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
                      src={etudiant.profile_picture || "/img/user-default.png"} 
                      alt={etudiant.username}
                      style={{width:50, height:50, borderRadius:'50%', objectFit:'cover'}}
                    />
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600, color:'#116b41'}}>
                        {etudiant.first_name} {etudiant.last_name} ({etudiant.username})
                      </div>
                      <div style={{color:'#7a8c85', fontSize:14}}>
                        {etudiant.email} • {etudiant.city?.name || 'Ville non définie'}
                      </div>
                      <div style={{color:'#178f56', fontSize:13}}>
                        {etudiant.academic_year || 'Année non définie'} • {etudiant.user_type || 'Type non défini'}
                      </div>
                    </div>
                    <div style={{
                      padding:'4px 12px', 
                      borderRadius:20, 
                      background: etudiant.is_active ? '#c8e6c9' : '#ffcdd2',
                      color: etudiant.is_active ? '#2e7d32' : '#c62828',
                      fontSize:12,
                      fontWeight:600
                    }}>
                      {etudiant.is_active ? 'Actif' : 'Inactif'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal détail étudiant */}
          {etudiantDetail && (
            <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}} onClick={() => setEtudiantDetail(null)}>
              <div style={{background:'#fff', borderRadius:16, padding:32, width:'90%', maxWidth:500}} onClick={e => e.stopPropagation()}>
                <h3 style={{marginBottom:16, color:'#116b41'}}>Détails de l'étudiant</h3>
                <div style={{marginBottom:12}}><strong>Nom:</strong> {etudiantDetail.first_name} {etudiantDetail.last_name}</div>
                <div style={{marginBottom:12}}><strong>Username:</strong> {etudiantDetail.username}</div>
                <div style={{marginBottom:12}}><strong>Email:</strong> {etudiantDetail.email}</div>
                <div style={{marginBottom:12}}><strong>Ville:</strong> {etudiantDetail.city?.name || 'Non définie'}</div>
                <div style={{marginBottom:12}}><strong>Année:</strong> {etudiantDetail.academic_year || 'Non définie'}</div>
                <div style={{marginBottom:12}}><strong>Type:</strong> {etudiantDetail.user_type || 'Non défini'}</div>
                <div style={{marginBottom:12}}><strong>Statut:</strong> {etudiantDetail.is_active ? 'Actif' : 'Inactif'}</div>
                <div style={{marginBottom:12}}><strong>Date d'inscription:</strong> {etudiantDetail.date_joined ? new Date(etudiantDetail.date_joined).toLocaleDateString('fr-FR') : 'Non définie'}</div>
                <button onClick={() => setEtudiantDetail(null)} style={{marginTop:16, padding:'8px 16px', borderRadius:8, border:'none', background:'#116b41', color:'#fff', cursor:'pointer'}}>
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminComptes; 