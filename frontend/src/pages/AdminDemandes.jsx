import React, { useState } from 'react';
import './AdminDemandes.scss';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';

const AdminDemandes = () => {
  const mockData = [
    {
      id: 1,
      title: "Développement d'une application mobile",
      description: "Création d'une application mobile pour la gestion des étudiants",
      category: "Développement",
      client: "Ahmed Bennani",
      estimated_duration: "3 mois",
      required_skills: "React Native, JavaScript, API REST",
      status: "pending_approval",
      created_at: "2024-01-15",
      is_urgent: true
    },
    {
      id: 2,
      title: "Design d'interface utilisateur",
      description: "Conception d'une interface moderne pour une plateforme e-learning",
      category: "Design",
      client: "Fatima Zahra",
      estimated_duration: "2 mois",
      required_skills: "UI/UX, Figma, Adobe XD",
      status: "pending_approval",
      created_at: "2024-01-14",
      is_urgent: false
    }
  ];

  const [demandes, setDemandes] = useState(mockData);

  return (
    <div className="admin-layout-pro projets-layout">
      <AdminSidebar />
      <div className="admin-main-pro">
        <AdminNavbar />
        <div className="admin-content-pro">
          <h1>Gestion des Demandes</h1>
          <div className="demandes-list">
            {demandes.map(demande => (
              <div key={demande.id} className="demande-card">
                <h3>{demande.title}</h3>
                <p>{demande.description}</p>
                <span>{demande.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDemandes; 