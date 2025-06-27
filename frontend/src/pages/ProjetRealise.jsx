import React, { useState } from "react";
import { useProjects } from "../hooks/useApi";
import "./ProjetRealise.scss";

const categories = ["Catégorie", "IT", "Art", "Bénévole", "Civil"];
const statuts = ["Statut", "Terminé", "En cours"];

const ProjetRealise = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Statut");
  const [categoryFilter, setCategoryFilter] = useState("Catégorie");
  const [dateFilter, setDateFilter] = useState("Année");

  // Charger les projets de l'utilisateur connecté
  const { data: projects, loading, error } = useProjects({ my_projects: true });

  // Créer la liste des dates disponibles
  const dates = projects ? ["Année", ...Array.from(new Set(projects.map(p => 
    p.created_at ? new Date(p.created_at).getFullYear().toString() : '2024'
  )))] : ["Année"];

  // Filtrer les projets
  const filteredProjects = projects ? projects.filter((p) => {
    const matchSearch = !search || 
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Statut" || p.status === statusFilter;
    const matchCategory = categoryFilter === "Catégorie" || p.category?.name === categoryFilter;
    const matchDate = dateFilter === "Année" || 
      (p.created_at && new Date(p.created_at).getFullYear().toString() === dateFilter);
    
    return matchSearch && matchStatus && matchCategory && matchDate;
  }) : [];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Chargement de vos projets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <p>Erreur: {error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <div style={{padding:32, background:'#f8fffe', minHeight:'100vh'}}>
      <h1 style={{marginBottom:32, fontWeight:800, color:'#116b41'}}>Mes Projets Réalisés</h1>
      
      {/* Filtres */}
      <div style={{display:'flex', gap:16, marginBottom:24, flexWrap:'wrap'}}>
        <input 
          type="text" 
          placeholder="Rechercher un projet..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{padding:'8px 12px', borderRadius:8, border:'1px solid #ccc', minWidth:250}}
        />
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          style={{padding:'8px 12px', borderRadius:8, border:'1px solid #ccc'}}
        >
          {statuts.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select 
          value={categoryFilter} 
          onChange={e => setCategoryFilter(e.target.value)}
          style={{padding:'8px 12px', borderRadius:8, border:'1px solid #ccc'}}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select 
          value={dateFilter} 
          onChange={e => setDateFilter(e.target.value)}
          style={{padding:'8px 12px', borderRadius:8, border:'1px solid #ccc'}}
        >
          {dates.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Liste des projets */}
      <div style={{background:'#fff', borderRadius:12, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.1)'}}>
        {filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>
              {projects?.length === 0 
                ? "Vous n'avez encore réalisé aucun projet" 
                : "Aucun projet ne correspond aux filtres sélectionnés"
              }
            </p>
          </div>
        ) : (
          <div style={{display:'grid', gap:20}}>
            {filteredProjects.map((p) => (
              <div 
                key={p.id} 
                style={{
                  border:'1px solid #e6f4ee', 
                  borderRadius:12, 
                  padding:20,
                  transition:'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(17,107,65,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:12}}>
                  <h3 style={{color:'#116b41', margin:0}}>{p.title || 'Projet sans titre'}</h3>
                  <span style={{
                    padding:'4px 12px', 
                    borderRadius:20, 
                    background: p.status === 'Terminé' ? '#c8e6c9' : '#fff3e0',
                    color: p.status === 'Terminé' ? '#2e7d32' : '#f57c00',
                    fontSize:12,
                    fontWeight:600
                  }}>
                    {p.status || 'En cours'}
                  </span>
                </div>
                
                <p style={{color:'#7a8c85', marginBottom:12, lineHeight:1.5}}>
                  {p.description || 'Aucune description disponible'}
                </p>
                
                <div style={{display:'flex', gap:16, alignItems:'center', fontSize:14}}>
                  {p.category && (
                    <span style={{color:'#178f56', fontWeight:600}}>
                      📂 {p.category.name}
                    </span>
                  )}
                  {p.budget && (
                    <span style={{color:'#116b41', fontWeight:600}}>
                      💰 {p.budget}€
                    </span>
                  )}
                  {p.created_at && (
                    <span style={{color:'#7a8c85'}}>
                      📅 {new Date(p.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                  {p.rating && (
                    <span style={{color:'#ff9800'}}>
                      ⭐ {p.rating}/5
                    </span>
                  )}
                </div>
                
                {p.skills && (
                  <div style={{marginTop:12}}>
                    <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                      {p.skills.split(',').map((skill, idx) => (
                        <span 
                          key={idx}
                          style={{
                            padding:'2px 8px', 
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjetRealise; 