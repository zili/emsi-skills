import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/adminprojet", label: "Projets" },
  { to: "/admincomptes", label: "Comptes" },
  { to: "/admindemandes", label: "Demandes" },
  { to: "/admin/gestion-comptes", label: "Gestion des comptes" },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Ici tu peux ajouter la logique de suppression du token/session
    navigate("/login");
  };
  return (
    <header style={{background:'#fff', boxShadow:'0 2px 12px rgba(17,143,86,0.09)', padding:'0 32px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100}}>
      <div style={{flex:1}}></div>
      <div style={{flex:2, display:'flex', justifyContent:'center', gap:32}}>
        <span style={{fontWeight:800, fontSize:22, color:'#116b41', letterSpacing:1}}>Espace Administration</span>
        {links.map(link => (
          <NavLink key={link.to} to={link.to} style={({isActive}) => ({
            color: isActive ? '#1dbf73' : '#116b41',
            fontWeight:600,
            textDecoration:'none',
            fontSize:16,
            marginLeft:24
          })}>
            {link.label}
          </NavLink>
        ))}
      </div>
      <div style={{flex:1, display:'flex', justifyContent:'flex-end', alignItems:'center', gap:16}}>
        <div style={{display:'flex', alignItems:'center', gap:12, background:'#f8f9fa', padding:'8px 16px', borderRadius:25, border:'2px solid #e9ecef'}}>
          <img 
            src="/img/admin.png" 
            alt="Admin" 
            style={{width:40, height:40, borderRadius:'50%', objectFit:'cover', border:'2px solid #116b41'}}
          />
          <span style={{fontWeight:700, color:'#116b41', fontSize:16}}>Admin</span>
        </div>
        <button onClick={handleLogout} style={{background:'#ff4d4d', color:'#fff', border:'none', borderRadius:8, padding:'8px 18px', fontWeight:700, cursor:'pointer'}}>Se déconnecter</button>
      </div>
    </header>
  );
};

export default AdminNavbar; 