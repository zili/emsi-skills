import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import ApiService from "../services/api";

const villes = [
  { id: 6, name: "Tanger" },
  { id: 3, name: "Fès" },
  { id: 1, name: "Casablanca" },
  { id: 4, name: "Marrakech" },
  { id: 2, name: "Rabat" },
  { id: 5, name: "Agadir" },
  { id: 7, name: "Meknès" },
  { id: 8, name: "Oujda" }
];
const classes = ["1ère année", "2ème année", "3ème année", "4ème année", "5ème année"];
const types = [
  { value: "student", label: "Étudiant" },
  { value: "staff", label: "EMSI Staff" },
  { value: "club", label: "Club" }
];

const AdminGestionComptes = () => {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    type: types[0].value,
    classe: classes[0],
    ville: villes[0].id,
    email: "",
    mdp: "",
    mdpConfirm: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Générer l'email automatiquement
  React.useEffect(() => {
    if (form.nom && form.prenom) {
      setForm(f => ({ ...f, email: `${f.prenom.toLowerCase()}.${f.nom.toLowerCase()}@emsi-edu.ma` }));
    }
  }, [form.nom, form.prenom]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setMessage({ type: "", text: "" });
  };

  const handleTypeChange = e => {
    setForm(f => ({ ...f, type: e.target.value, classe: classes[0] }));
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Validation côté frontend
      if (form.mdp !== form.mdpConfirm) {
        setMessage({ type: "error", text: "Les mots de passe ne correspondent pas" });
        setLoading(false);
        return;
      }

      if (form.mdp.length < 6) {
        setMessage({ type: "error", text: "Le mot de passe doit contenir au moins 6 caractères" });
        setLoading(false);
        return;
      }

      // Préparer les données pour l'API
      const userData = {
        username: `${form.prenom.toLowerCase()}.${form.nom.toLowerCase()}`,
        email: form.email,
        password: form.mdp,
        password_confirm: form.mdpConfirm,
        first_name: form.prenom,
        last_name: form.nom,
        user_type: form.type,
        city_id: form.ville,
        phone: "", // Optionnel
        bio: "", // Optionnel
        skills: "", // Optionnel
        experience_years: 0, // Optionnel
        portfolio_url: "", // Optionnel
        linkedin_url: "", // Optionnel
        github_url: "" // Optionnel
      };

      console.log('🚀 Données à envoyer:', userData);

      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      console.log('📡 Statut de la réponse:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ Erreur du serveur:', errorData);
        throw { response: { data: errorData } };
      }

      const responseData = await response.json();
      console.log('✅ Réponse du serveur:', responseData);

      if (responseData.message) {
        setMessage({ type: "success", text: responseData.message });
        // Réinitialiser le formulaire
        setForm({
          nom: "",
          prenom: "",
          type: types[0].value,
          classe: classes[0],
          ville: villes[0].id,
          email: "",
          mdp: "",
          mdpConfirm: ""
        });
      }
    } catch (error) {
      console.error('❌ Erreur détaillée lors de la création:', error);
      let errorMessage = "Erreur lors de la création du compte";
      
      if (error.response && error.response.data) {
        // Afficher les erreurs spécifiques du backend
        console.log('📋 Données d\'erreur du backend:', error.response.data);
        const errors = error.response.data;
        if (typeof errors === 'object') {
          errorMessage = Object.values(errors).flat().join(', ');
        } else {
          errorMessage = errors.toString();
        }
      } else if (error.message) {
        errorMessage = error.message;
        console.log('📋 Message d\'erreur:', error.message);
      }
      
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
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
                  {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              {form.type === "student" && (
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
                  {villes.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
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
              <div>
                <label style={{fontWeight:600, color:'#116b41'}}>Confirmer le mot de passe</label>
                <input name="mdpConfirm" value={form.mdpConfirm} onChange={handleChange} type="password" required style={{width:'100%', padding:10, borderRadius:8, border:'1.5px solid #e6f4ee', marginTop:4}} />
              </div>
              {message.text && (
                <div style={{
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 8,
                  backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
                  color: message.type === "success" ? "#155724" : "#721c24",
                  border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`
                }}>
                  {message.text}
                </div>
              )}
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  marginTop:12, 
                  background: loading ? '#ccc' : '#1dbf73', 
                  color:'#fff', 
                  border:'none', 
                  borderRadius:8, 
                  padding:'12px 0', 
                  fontWeight:700, 
                  fontSize:16, 
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Création en cours...' : 'Créer le compte'}
              </button>
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