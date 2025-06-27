import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Projets.scss";

// Exemple de données, à remplacer par un fetch ou un context global si besoin
const projets = [
  {
    id: "1",
    nom: "Plateforme EMSI",
    categorie: "Web",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
    technologie: "Next.js",
    tags: ["React", "Node.js"],
    description:
      "Développement d'une plateforme d'apprentissage en ligne pour les étudiants EMSI. Gestion des cours, utilisateurs, et reporting avancé.",
    client: "Yassine Zilili",
    date: "12/05/2024",
  },
  // Ajoute d'autres projets ici si besoin
];

const ProjetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const projet = projets.find((p) => p.id === id);

  if (!projet) return <div style={{ padding: 40 }}>Projet introuvable.</div>;

  return (
    <div className="projet-detail-page">
      <div className="projet-detail-banner-full" style={{ backgroundImage: `url(${projet.image})` }}>
        <button className="projet-detail-retour" onClick={() => navigate(-1)}>
          &larr; Retour
        </button>
        <div className="projet-detail-badges">
          <span className="projet-detail-badge categorie">{projet.categorie}</span>
        </div>
        <h1 className="projet-detail-title">{projet.nom}</h1>
      </div>
      <div className="projet-detail-content">
        <div className="projet-detail-tags">
          {projet.tags.map((tag) => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>
        <div className="projet-detail-card collee">
          <h2 className="projet-detail-desc-title">Description du projet</h2>
          <div className="projet-detail-tech-date">
            <span className="projet-detail-tech">{projet.technologie}</span>
            <span className="projet-detail-date">{projet.date}</span>
            <span className="projet-detail-client">Posté par {projet.client}</span>
          </div>
          <p className="projet-detail-desc-text noir-fine">{projet.description}</p>
          <button className="projet-detail-candidater fonce">Candidater</button>
        </div>
      </div>
    </div>
  );
};

export default ProjetDetail; 