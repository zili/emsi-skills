import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Projects.scss";

const statusOptions = ["Tous", "En cours", "Terminé", "En attente", "Annulé"];
const ratingOptions = ["Toutes", 5, 4, 3, 2, 1];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Tous");
  const [rating, setRating] = useState("Toutes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Charger les projets depuis l'API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('http://localhost:8000/api/projects/', {
          headers
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data.results || data || []);
        } else if (response.status === 401) {
          // Token expiré, rediriger vers login
          navigate('/login');
        } else {
          setError('Erreur lors du chargement des projets');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les projets');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      (p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
      (p.client && p.client.toLowerCase().includes(search.toLowerCase())) ||
      (p.owner && p.owner.username && p.owner.username.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = status === "Tous" || p.status === status;
    const matchRating = rating === "Toutes" || (p.rating && p.rating >= rating);
    return matchSearch && matchStatus && matchRating;
  });

  if (loading) {
    return (
      <div className="projects-page">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Chargement des projets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-page">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <input
          type="text"
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value) || "Toutes")}> 
          {ratingOptions.map((r) => (
            <option key={r} value={r}>{r === "Toutes" ? "Toutes les notes" : "★".repeat(r)}</option>
          ))}
        </select>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Aucun projet trouvé</p>
        </div>
      ) : (
        <table className="projects-table">
          <thead>
            <tr>
              <th>Projet</th>
              <th>Propriétaire</th>
              <th>Date</th>
              <th>Note</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="project-name">{p.title || 'Sans titre'}</div>
                  <div className="project-tags">
                    {p.category && (
                      <span className="tag">{p.category.name}</span>
                    )}
                    {p.skills && p.skills.split(',').map((skill, idx) => (
                      <span className="tag" key={idx}>{skill.trim()}</span>
                    ))}
                  </div>
                </td>
                <td>{p.owner ? p.owner.username : 'Non défini'}</td>
                <td>{p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR') : 'N/A'}</td>
                <td>
                  {p.rating ? (
                    <span className="stars">
                      {"★".repeat(Math.floor(p.rating))}{"☆".repeat(5 - Math.floor(p.rating))}
                    </span>
                  ) : (
                    <span className="stars">{"☆".repeat(5)}</span>
                  )}
                </td>
                <td>
                  <span className={`status ${(p.status || '').toLowerCase()}`}>
                    {p.status || 'Non défini'}
                  </span>
                </td>
                <td>
                  <button className="view-btn" onClick={() => navigate(`/projects/${p.id}`)}>
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Projects; 