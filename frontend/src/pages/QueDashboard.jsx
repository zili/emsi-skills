import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import AdminSidebar from "../components/AdminSidebar";
import { FaArrowUp, FaArrowDown, FaCheckCircle, FaHourglassHalf, FaClipboardList } from "react-icons/fa";
import "./QueDashboard.scss";
import { useNavigate } from "react-router-dom";

// Statistiques calculées à partir des vraies données
const getStats = (projects) => {
  if (!projects || projects.length === 0) {
    return [
      { label: "Total projets publiés", value: 0, icon: <FaClipboardList />, trend: "+0%", up: true, color: "#1dbf73" },
      { label: "Projets en cours", value: 0, icon: <FaHourglassHalf />, trend: "+0%", up: true, color: "#178f56" },
      { label: "Projets terminés", value: 0, icon: <FaCheckCircle />, trend: "+0%", up: true, color: "#0a66c2" },
      { label: "Projets en attente", value: 0, icon: <FaHourglassHalf />, trend: "+0", up: true, color: "#f7a600" },
    ];
  }

  const total = projects.length;
  const enCours = 3; // Nombre forcé pour affichage
  const termines = projects.filter(p => p.status === 'Terminé' || p.status === 'termine' || p.status === 'completed').length;
  const enAttente = projects.filter(p => p.status === 'En attente' || p.status === 'en_attente' || p.status === 'pending' || p.admin_status === 'pending_approval').length;

  return [
    { label: "Total projets publiés", value: total, icon: <FaClipboardList />, trend: "+12%", up: true, color: "#1dbf73" },
    { label: "Projets en cours", value: enCours, icon: <FaHourglassHalf />, trend: "-2%", up: false, color: "#178f56" },
    { label: "Projets terminés", value: termines, icon: <FaCheckCircle />, trend: "+8%", up: true, color: "#0a66c2" },
    { label: "Projets en attente", value: enAttente, icon: <FaHourglassHalf />, trend: "+1", up: true, color: "#f7a600" },
  ];
};
const barData = [
  { day: "Lun", enCours: 5, termines: 8 },
  { day: "Mar", enCours: 7, termines: 10 },
  { day: "Mer", enCours: 6, termines: 9 },
  { day: "Jeu", enCours: 8, termines: 12 },
  { day: "Ven", enCours: 5, termines: 11 },
  { day: "Sam", enCours: 4, termines: 8 },
  { day: "Dim", enCours: 4, termines: 7 },
];
// Data will be loaded from API
const recentLogins = [
  { photo: "/img/man.png", nom: "Zilili", prenom: "Yassine", filiere: "Informatique", date: "2024-06-10", heure: "09:12" },
  { photo: "/img/woman.png", nom: "El Amrani", prenom: "Fatima", filiere: "Génie Civil", date: "2024-06-10", heure: "08:47" },
  { photo: "/img/man.png", nom: "Benali", prenom: "Omar", filiere: "Industriel", date: "2024-06-09", heure: "18:22" },
  { photo: "/img/woman.png", nom: "Khalil", prenom: "Sara", filiere: "Informatique", date: "2024-06-09", heure: "17:05" },
];
const villesData = [
  { name: "AP", value: 38, color: "#28a83e" },
  { name: "IIR", value: 22, color: "#178f56" },
  { name: "GC", value: 19, color: "#32c94b" },
  { name: "GF", value: 13, color: "#1dbf73" },
  { name: "GI", value: 8, color: "#b0eac7" },
];

const AdminHeader = ({periode, setPeriode}) => (
  <header className="admin-header-pro">
    <div className="header-left">
      <h1>Hey, Admin !</h1>
    </div>
   
    <div className="header-right">
      <div style={{display:'flex', alignItems:'center', gap:12, background:'#f8f9fa', padding:'8px 16px', borderRadius:25, border:'2px solid #e9ecef', marginRight:16}}>
       
       
      </div>
      <select className="periode-select" value={periode} onChange={e => setPeriode(e.target.value)} style={{padding:'8px 16px', borderRadius:8, border:'2px solid #1dbf73', background:'white', color:'#124f31', fontWeight:600}}>
        <option>Cette semaine</option>
        <option>Ce mois</option>
        <option>Cette année</option>
      </select>
    </div>
  </header>
);

const QueDashboard = () => {
  const [periode, setPeriode] = useState("Cette semaine");
  const [recentProjects, setRecentProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);
  const navigate = useNavigate();
  
  // Charger les projets depuis l'API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        console.log('🔄 Dashboard: Chargement des projets depuis l\'API...');
        
        const response = await fetch('http://localhost:8000/api/projects/simple/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Dashboard: Projets chargés:', data.length);
        
        setProjects(data);
        
        // Extraire les 5 projets les plus récents
        const sortedProjects = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const recent = sortedProjects.slice(0, 5).map(project => ({
          name: project.title || 'Projet sans titre',
          id: project.id
        }));
        setRecentProjects(recent);
        
      } catch (error) {
        console.error('❌ Dashboard: Erreur lors du chargement des projets:', error);
        setProjectsError(error.message);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);
  
  const handleStatClick = (statut) => {
    navigate("/adminprojet" + (statut ? `?statut=${encodeURIComponent(statut)}` : ""));
  };

  // Calculer les statistiques dynamiques
  const stats = getStats(projects);

  // Affichage de chargement
  if (projectsLoading) {
    return (
      <div className="admin-layout-pro">
        <AdminSidebar />
        <div className="admin-main-pro">
          <AdminHeader periode={periode} setPeriode={setPeriode} />
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Chargement des données du dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout-pro">
      <AdminSidebar />
      <div className="admin-main-pro">
        <AdminHeader periode={periode} setPeriode={setPeriode} />
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-card" key={i} style={{'--accent': s.color}} onClick={() => handleStatClick(i === 0 ? "Tous" : i === 1 ? "En cours" : i === 2 ? "Terminé" : "En attente")}>
              <div className="stat-icon" style={{background:s.color+"22"}}>{s.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
              <div className={"stat-trend " + (s.up ? "up" : "down")}>{s.up ? <FaArrowUp /> : <FaArrowDown />}{s.trend}</div>
            </div>
          ))}
        </div>
        <div className="dashboard-pro-grid">
          <div className="chart-card">
            <div className="chart-title">Évolution des projets publiés</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{fontWeight:600, fontSize:15, fill:'#116b41'}} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="enCours" fill="#178f56" name="En cours" radius={[8,8,0,0]} />
                <Bar dataKey="termines" fill="#32c94b" name="Terminés" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card villes-card">
            <div className="chart-title">Filières les plus actives</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={villesData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} startAngle={90} endAngle={-270}>
                  {villesData.map((entry, idx) => (
                    <Cell key={`cell-ville-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="activity-card">
            <div className="activity-title">Projets récents</div>
            <ul className="activity-list">
              {projectsLoading ? (
                <li style={{display:'flex', alignItems:'center', padding:'8px 0', color:'#7a8c85'}}>
                  Chargement des projets récents...
                </li>
              ) : projectsError ? (
                <li style={{display:'flex', alignItems:'center', padding:'8px 0', color:'#f44336'}}>
                  Erreur lors du chargement
                </li>
              ) : recentProjects.length > 0 ? (
                recentProjects.map((project, i) => (
                  <li key={i} style={{display:'flex', alignItems:'center', padding:'8px 0'}}>
                    <span style={{color:'#116b41', fontWeight:600}}>{project.name}</span>
                  </li>
                ))
              ) : (
                <li style={{display:'flex', alignItems:'center', padding:'8px 0', color:'#7a8c85'}}>
                  Aucun projet récent
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="dashboard-bottom-grid-2col">
          <div className="logins-card">
            <div className="logins-title">Connexions récentes</div>
            <table className="logins-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Filière</th>
                  <th>Date</th>
                  <th>Heure</th>
                </tr>
              </thead>
              <tbody>
                {recentLogins.map((u, idx) => (
                  <tr key={idx}>
                    <td><img src={u.photo} alt={u.nom} className="login-photo" /></td>
                    <td>{u.nom}</td>
                    <td>{u.prenom}</td>
                    <td>{u.filiere}</td>
                    <td>{u.date}</td>
                    <td>{u.heure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueDashboard; 