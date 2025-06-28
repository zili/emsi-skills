import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.scss";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/", label: "Projets" },
  { to: "/", label: "Utilisateurs" },
  { to: "/admindemandes", label: "Demandes" },
  { to: "/admin/gestion-comptes", label: "Gestion des comptes" },
];

const AdminSidebar = () => (
  <aside className="admin-sidebar-vert">
    <nav className="sidebar-nav-vert">
      {links.map(link => (
        <NavLink key={link.to} to={link.to} className={({isActive}) => isActive ? "sidebar-link-vert active" : "sidebar-link-vert"} end>
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar; 