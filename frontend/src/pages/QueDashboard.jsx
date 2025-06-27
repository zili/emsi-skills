import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import AdminSidebar from "../components/AdminSidebar";
import { FaArrowUp, FaArrowDown, FaCheckCircle, FaHourglassHalf, FaClipboardList } from "react-icons/fa";
import "./QueDashboard.scss";
import { useNavigate } from "react-router-dom";

// FAKE DATA
const stats = [
  { label: "Total projets publiés", value: 128, icon: <FaClipboardList />, trend: "+12%", up: true, color: "#1dbf73" },
  { label: "Projets en cours", value: 39, icon: <FaHourglassHalf />, trend: "-2%", up: false, color: "#178f56" },
  { label: "Projets terminés", value: 74, icon: <FaCheckCircle />, trend: "+8%", up: true, color: "#0a66c2" },
  { label: "Projets en attente", value: 15, icon: <FaHourglassHalf />, trend: "+1", up: true, color: "#f7a600" },
];
const barData = [
  { day: "Lun", enCours: 5, termines: 8 },
  { day: "Mar", enCours: 7, termines: 10 },
  { day: "Mer", enCours: 6, termines: 9 },
  { day: "Jeu", enCours: 8, termines: 12 },
  { day: "Ven", enCours: 5, termines: 11 },
  { day: "Sam", enCours: 4, termines: 8 },
  { day: "Dim", enCours: 4, termines: 7 },
];
const recentActivity = [
  { type: "Projet validé", user: "Yassine Zilili", date: "il y a 2h" },
  { type: "Projet en attente", user: "Fatima E.", date: "il y a 4h" },
  { type: "Projet publié", user: "Startup Y", date: "hier" },
  { type: "Connexion", user: "Sara Khalil", date: "hier 17:05" },
  { type: "Projet refusé", user: "Omar Benali", date: "08/06/2024" },
];
const recentLogins = [
  { photo: "/img/man.png", nom: "Zilili", prenom: "Yassine", filiere: "Informatique", ville: "Tanger", date: "2024-06-10", heure: "09:12" },
  { photo: "/img/woman.png", nom: "El Amrani", prenom: "Fatima", filiere: "Génie Civil", ville: "Casablanca", date: "2024-06-10", heure: "08:47" },
  { photo: "/img/man.png", nom: "Benali", prenom: "Omar", filiere: "Industriel", ville: "Rabat", date: "2024-06-09", heure: "18:22" },
  { photo: "/img/woman.png", nom: "Khalil", prenom: "Sara", filiere: "Informatique", ville: "Marrakech", date: "2024-06-09", heure: "17:05" },
];
const villesData = [
  { name: "Tanger", value: 38, color: "#28a83e" },
  { name: "Fès", value: 22, color: "#178f56" },
  { name: "Casablanca", value: 19, color: "#32c94b" },
  { name: "Marrakech", value: 13, color: "#1dbf73" },
  { name: "Rabat", value: 8, color: "#b0eac7" },
];

const AdminHeader = ({periode, setPeriode}) => (
  <header className="admin-header-pro">
    <div className="header-left">
      <h1>Bienvenue, Admin !</h1>
      <span className="header-sub">Voici les dernières statistiques de la plateforme.</span>
    </div>
    <div className="header-actions">
      <select className="periode-select" value={periode} onChange={e => setPeriode(e.target.value)}>
        <option>Cette semaine</option>
        <option>Ce mois</option>
        <option>Cette année</option>
      </select>
    </div>
  </header>
);

const QueDashboard = () => {
  const [periode, setPeriode] = useState("Cette semaine");
  const navigate = useNavigate();
  const handleStatClick = (statut) => {
    navigate("/adminprojet" + (statut ? `?statut=${encodeURIComponent(statut)}` : ""));
  };
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
            <div className="chart-title">Villes les plus actives</div>
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
            <div className="activity-title">Activité récente</div>
            <ul className="activity-list">
              {recentActivity.map((a, i) => (
                <li key={i}><span className="activity-user">{a.user}</span><span className="activity-type">{a.type}</span><span className="activity-date">{a.date}</span></li>
              ))}
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
                  <th>Ville</th>
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
                    <td>{u.ville}</td>
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