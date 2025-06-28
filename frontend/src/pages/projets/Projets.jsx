import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Projets.scss";
import { FaSearch, FaFilter } from "react-icons/fa";

const initialProjets = [
  {
    id: 1,
    nom: "Plateforme EMSI",
    categorie: "Développement",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    client: "Ahmed Benali",
    date: "12/05/2024",
    duree: "3-4 mois",
    tags: ["React.js", "React.js", "Node.js", "MongoDB", "TypeScript"],
  },
  {
    id: 2,
    nom: "App Mobile Gestion",
    categorie: "Développement",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    client: "Startup Y",
    date: "02/04/2024",
    duree: "2 mois",
    tags: ["Flutter"],
  },
  {
    id: 3,
    nom: "Étude de faisabilité pont",
    categorie: "Génie Civil",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
    client: "Municipalité",
    date: "15/03/2024",
    duree: "6 mois",
    tags: ["AutoCAD", "Calculs"],
  },
  {
    id: 4,
    nom: "Campagne publicitaire",
    categorie: "Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
    client: "Entreprise ABC",
    date: "18/05/2024",
    duree: "1 mois",
    tags: ["Social Media", "Design"],
  },
  {
    id: 5,
    nom: "Système de production",
    categorie: "Industriel",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
    client: "Usine XYZ",
    date: "10/06/2024",
    duree: "4 mois",
    tags: ["Lean", "Automatisation"],
  },
  {
    id: 6,
    nom: "Site vitrine association",
    categorie: "Art",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    client: "Association Z",
    date: "25/04/2024",
    duree: "1 mois",
    tags: ["HTML", "CSS", "Design"],
  },
  {
    id: 7,
    nom: "Montage vidéo événement",
    categorie: "Vidéo & Montage",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=400&q=80",
    client: "Event Pro",
    date: "08/05/2024",
    duree: "2 semaines",
    tags: ["Adobe Premiere", "After Effects"],
  },
  {
    id: 8,
    nom: "Aide aux devoirs",
    categorie: "Bénévolat",
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=400&q=80",
    client: "ONG Education",
    date: "20/05/2024",
    duree: "Ongoing",
    tags: ["Tutorat", "Mathématiques"],
  },
];

const categoriesSidebar = [
  { name: "Tous" },
  { name: "Développement" },
  { name: "Génie Civil" },
  { name: "Industriel" },
  { name: "Marketing" },
  { name: "Bénévolat" },
  { name: "Art" },
  { name: "Vidéo & Montage" },
  { name: "Autres" },
];

const categoriesGrid = [
  { name: "Graphics & Design", icon: <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="10" rx="2" stroke="#116b41" strokeWidth="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#1dbf73" strokeWidth="2"/></svg> },
  { name: "Digital Marketing", icon: <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" stroke="#116b41" strokeWidth="2"/><path d="M8 14v-2m4 2v-4m4 4v-6" stroke="#1dbf73" strokeWidth="2"/></svg> },
  { name: "Writing & Translation", icon: <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2" stroke="#116b41" strokeWidth="2"/><path d="M9 8h6M9 12h6M9 16h2" stroke="#1dbf73" strokeWidth="2"/></svg> },
  { name: "Video & Animation", icon: <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke="#116b41" strokeWidth="2"/><path d="M10 10l4 2-4 2v-4z" fill="#1dbf73"/></svg> },
  { name: "Music & Audio", icon: <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="#116b41" strokeWidth="2"/><path d="M15 9v6a2 2 0 1 1-2-2h2" stroke="#1dbf73" strokeWidth="2"/></svg> },
  { name: "Programming & Tech", icon: <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" stroke="#116b41" strokeWidth="2"/><path d="M8 14v-2m4 2v-4m4 4v-6" stroke="#1dbf73" strokeWidth="2"/></svg> },
  { name: "Business", icon: <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke="#116b41" strokeWidth="2"/><path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="#1dbf73" strokeWidth="2"/></svg> },
  { name: "Lifestyle", icon: <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="#116b41" strokeWidth="2"/><path d="M12 8v4l3 3" stroke="#1dbf73" strokeWidth="2"/></svg> },
  { name: "Data", icon: <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" stroke="#116b41" strokeWidth="2"/><path d="M8 14v-2m4 2v-4m4 4v-6" stroke="#1dbf73" strokeWidth="2"/></svg> },
  { name: "Photography", icon: <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke="#116b41" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#1dbf73" strokeWidth="2"/></svg> },
];

const Projets = () => {
  const [categorie, setCategorie] = useState("Tous");
  const [search, setSearch] = useState("");
  const [annee, setAnnee] = useState("Toutes les années");
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Charger les projets depuis l'API
  useEffect(() => {
    const fetchProjets = async () => {
      try {
        console.log('🔄 Chargement des projets depuis l\'API...');
        const response = await fetch('http://localhost:8000/api/projects/simple/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Réponse projets:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📊 Données projets reçues:', data);
        
        // Transformer les données pour qu'elles correspondent au format attendu par le frontend
        const transformedProjets = data.map(projet => ({
          id: projet.id,
          nom: projet.title,
          categorie: projet.category?.name || 'Autre',
          image: projet.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
          client: projet.client?.full_name || projet.client?.email || 'Client',
          date: new Date(projet.created_at).toLocaleDateString('fr-FR'),
          duree: projet.estimated_duration || 'Non définie',
          tags: projet.tags?.map(tag => tag.name) || [],
        }));

        setProjets(transformedProjets);
        console.log('✅ Projets chargés avec succès:', transformedProjets.length);
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement des projets:', error);
        setError('Impossible de charger les projets. Utilisation des données de démonstration.');
        
        // Fallback avec les données mockées
        setProjets(initialProjets.map(p => ({
          ...p,
          nom: p.nom || p.title,
          categorie: p.categorie || p.category,
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchProjets();
  }, []);

  // Calculer les années dynamiquement basées sur les projets chargés
  const annees = [
    "Toutes les années",
    ...Array.from(new Set(projets.map((p) => p.date.split("/")[2]))).sort().reverse(),
  ];

  const filteredProjets = projets.filter((p) =>
    (categorie === "Tous" || p.categorie === categorie) &&
    (annee === "Toutes les années" || p.date.split("/")[2] === annee) &&
    (p.nom.toLowerCase().includes(search.toLowerCase()) ||
     p.client.toLowerCase().includes(search.toLowerCase()) ||
     p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="projets-layout">
      <aside className="projets-sidebar">
        <ul>
          {categoriesSidebar.map((cat) => (
            <li
              key={cat.name}
              className={categorie === cat.name ? "active" : ""}
              onClick={() => setCategorie(cat.name)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </aside>
      <div className="projets-main">
        <div className="projets-header">
          <div className="search-container">
            <div className="search-input">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="annee-select"
              value={annee}
              onChange={e => setAnnee(e.target.value)}
              style={{ minWidth: 140, height: 48, borderRadius: 12, border: '2px solid #e6f4ee', fontSize: '1.05rem', color: '#116b41', padding: '0 12px', background: '#fff', marginLeft: 12 }}
            >
              {annees.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <select
              className="categorie-select"
              value={categorie}
              onChange={e => setCategorie(e.target.value)}
              style={{ minWidth: 140, height: 48, borderRadius: 12, border: '2px solid #e6f4ee', fontSize: '1.05rem', color: '#116b41', padding: '0 12px', background: '#fff', marginLeft: 12 }}
            >
              {categoriesSidebar.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {error && (
          <div className="error-message" style={{
            background: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '8px', 
            padding: '12px', 
            margin: '20px 0', 
            color: '#856404'
          }}>
            ⚠️ {error}
          </div>
        )}
        
        {loading ? (
          <div className="loading-container" style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px',
            fontSize: '1.1rem',
            color: '#116b41'
          }}>
            🔄 Chargement des projets...
          </div>
        ) : (
          <div className="projets-grid">
            {filteredProjets.length === 0 ? (
              <div style={{
                textAlign: 'center', 
                padding: '40px', 
                color: '#666',
                fontSize: '1.1rem'
              }}>
                😔 Aucun projet trouvé pour les critères sélectionnés.
              </div>
            ) : (
              filteredProjets.map((p) => (
                <div className="projet-card" key={p.id} onClick={() => navigate(`/projets/${p.id}`)}>
                  <div className="projet-card-img" style={{backgroundImage: `url(${p.image})`}}>
                    <div className="projet-card-genre-badge">{p.categorie}</div>
                  </div>
                  <div className="projet-card-content">
                    <h3 className="projet-card-title">{p.nom}</h3>
                    <div className="projet-card-client">{p.client}</div>
                    <div className="projet-card-date">{p.date}</div>
                    <div className="projet-card-tags">
                      {p.tags.map((tag) => (
                        <span className="tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projets; 