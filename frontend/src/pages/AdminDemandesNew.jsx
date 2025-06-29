import React, { useState, useEffect } from 'react';
import './AdminDemandes.scss';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';

const AdminDemandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingProjects = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('Vous devez être connecté');
          return;
        }

        const response = await fetch('http://localhost:8000/api/projects/admin/pending/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDemandes(data.results || data || []);
        } else {
          setError('Erreur lors du chargement des demandes');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des demandes:', error);
        setError('Erreur lors du chargement des demandes');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingProjects();
  }, []);

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