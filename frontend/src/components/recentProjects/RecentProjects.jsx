import React from "react";
import "./RecentProjects.scss";

const projects = [
  {
    title: "Plateforme E-learning EMSI",
    img: "/img/project-elearning.png",
    desc: "Développement d'une plateforme d'apprentissage en ligne pour les étudiants EMSI."
  },
  {
    title: "Application de gestion de bibliothèque",
    img: "/img/project-library.png",
    desc: "Application web pour la gestion et l'emprunt de livres."
  },
  {
    title: "Site vitrine pour une startup",
    img: "/img/project-startup.png",
    desc: "Création d'un site vitrine moderne pour une jeune entreprise innovante."
  },
  {
    title: "Outil de suivi de projets",
    img: "/img/project-tracking.png",
    desc: "Dashboard pour le suivi de l'avancement des projets étudiants."
  },
];

const RecentProjects = () => {
  return (
    <section className="recent-projects">
      <h2>Projets récents</h2>
      <div className="projects-list">
        {projects.map((project, i) => (
          <div className="project-card" key={i}>
            <div className="project-img">
              <img src={project.img} alt={project.title} />
            </div>
            <div className="project-info">
              <div className="project-title">{project.title}</div>
              <div className="project-desc">{project.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentProjects; 