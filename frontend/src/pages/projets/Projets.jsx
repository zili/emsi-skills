import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Projets.scss";
import { FaSearch, FaFilter } from "react-icons/fa";

const initialProjets = [
  {
    id: 1,
    nom: "Plateforme EMSI",
    categorie: "Développement",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    client: "Yassine Zilili",
    date: "12/05/2024",
    tags: ["React", "Node.js"],
  },
  {
    id: 2,
    nom: "App Mobile Gestion",
    categorie: "Développement",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    client: "Startup Y",
    date: "02/04/2024",
    tags: ["Flutter"],
  },
  {
    id: 3,
    nom: "Dashboard RH",
    categorie: "Génie Civil",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    client: "RH Conseil",
    date: "15/03/2024",
    tags: ["Vue.js", "API"],
  },
  {
    id: 4,
    nom: "Site vitrine pour association",
    categorie: "Art",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    client: "Association Z",
    date: "18/05/2024",
    tags: ["HTML", "CSS"],
  },
];

const categoriesSidebar = [
  { name: "Tous" },
  { name: "Développement" },
  { name: "Génie Civil" },
  { name: "Art" },
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

const annees = [
  "Toutes les années",
  ...Array.from(new Set(initialProjets.map((p) => p.date.split("/")[2]))),
];

const Projets = () => {
  const [categorie, setCategorie] = useState("Tous");
  const [search, setSearch] = useState("");
  const [annee, setAnnee] = useState("Toutes les années");
  const navigate = useNavigate();

  const filteredProjets = initialProjets.filter((p) =>
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
        <div className="projets-grid">
          {filteredProjets.map((p) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projets; 