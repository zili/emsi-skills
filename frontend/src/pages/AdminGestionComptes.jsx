import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const villes = ["Tanger", "Fès", "Casablanca", "Marrakech", "Rabat"];
const classes = ["1ère année", "2ème année", "3ème année", "4ème année", "5ème année"];
const types = ["Étudiant", "EMSI Staff", "Club"];

const AdminGestionComptes = () => {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    type: types[0],
    classe: classes[0],
    ville: villes[0],
    email: "",
    mdp: ""
  });

  // Générer l'email automatiquement
  React.useEffect(() => {
    if (form.nom && form.prenom) {
      setForm(f => ({ ...f, email: `${f.prenom.toLowerCase()}.${f.nom.toLowerCase()}@emsi-edu.ma` }));
    }
  }, [form.nom, form.prenom]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleTypeChange = e => {
    setForm(f => ({ ...f, type: e.target.value, classe: classes[0] }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert("Compte créé (mock) : " + JSON.stringify(form, null, 2));
  };

  return (
    <div className="admin-layout-pro projets-layout">
      <AdminSidebar />
      <div className="admin-main-pro">
        <div className="projets-main">
          <h1 style={{marginTop:32, marginBottom:24, fontWeight:800, color:'#116b41'}}>Gestion des comptes</h1>
          <div style={{display:'flex', gap:48, alignItems:'flex-start', flexWrap:'wrap', marginLeft:190}}>
            <form onSubmit={handleSubmit} style={{background:'#fff', borderRadius:18, boxShadow:'0 4px 24px rgba(17,143,86,0.09)', padding:32, minWidth:320, maxWidth:400, width:'100%', display:'flex', flexDirection:'column', gap:18}}>
              <div>
                <label style={{fontWeight:600, color:'#116b41'}}>Nom</label>
                <input name="nom" value={form.nom} onChange={handleChange} required style={{width:'100%', padding:10, borderRadius:8, border:'1.5px solid #e6f4ee', marginTop:4}} />
              </div>
              <div>
                <label style={{fontWeight:600, color:'#116b41'}}>Prénom</label>
                <input name="prenom" value={form.prenom} onChange={handleChange} required style={{width:'100%', padding:10, borderRadius:8, border:'1.5px solid #e6f4ee', marginTop:4}} />
              </div>
              <div>
                <label style={{fontWeight:600, color:'#116b41'}}>Type</label>
                <select name="type" value={form.type} onChange={handleTypeChange} style={{width:'100%', padding:10, borderRadius:8, border:'1.5px solid #e6f4ee', marginTop:4}}>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {form.type === "Étudiant" && (
                <div>
                  <label style={{fontWeight:600, color:'#116b41'}}>Classe</label>
                  <select name="classe" value={form.classe} onChange={handleChange} style={{width:'100%', padding:10, borderRadius:8, border:'1.5px solid #e6f4ee', marginTop:4}}>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label style={{fontWeight:600, color:'#116b41'}}>Ville</label>
                <select name="ville" value={form.ville} onChange={handleChange} style={{width:'100%', padding:10, borderRadius:8, border:'1.5px solid #e6f4ee', marginTop:4}}>
                  {villes.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontWeight:600, color:'#116b41'}}>Adresse mail</label>
                <input name="email" value={form.email} readOnly placeholder="prenom.nom@emsi-edu.ma" style={{width:'100%', padding:10, borderRadius:8, border:'1.5px solid #e6f4ee', marginTop:4, background:'#f4f6fa'}} />
              </div>
              <div>
                <label style={{fontWeight:600, color:'#116b41'}}>Mot de passe</label>
                <input name="mdp" value={form.mdp} onChange={handleChange} type="password" required style={{width:'100%', padding:10, borderRadius:8, border:'1.5px solid #e6f4ee', marginTop:4}} />
              </div>
              <button type="submit" style={{marginTop:12, background:'#1dbf73', color:'#fff', border:'none', borderRadius:8, padding:'12px 0', fontWeight:700, fontSize:16, cursor:'pointer'}}>Créer le compte</button>
            </form>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:18}}>
              <label style={{fontWeight:600, color:'#116b41', marginBottom:8}}>Import en masse</label>
              <input type="file" accept=".xlsx,.xls" style={{display:'none'}} id="excel-upload" />
              <label htmlFor="excel-upload" style={{background:'#e6f4ee', color:'#116b41', borderRadius:8, padding:'12px 24px', fontWeight:700, cursor:'pointer', border:'2px solid #1dbf73'}}>Importer un fichier Excel</label>
              <span style={{color:'#7a8c85', fontSize:14, marginTop:8}}>Format accepté : .xlsx, .xls</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGestionComptes; 