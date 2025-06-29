import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { redirectUserAfterAuth } from "../../utils/userRedirection";
import "./Login.scss";

const Login = () => {
  const [villes, setVilles] = useState([]);
  const [ville, setVille] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Charger les villes depuis l'API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        console.log('🔄 Tentative de chargement des villes...');
        
        // Utiliser uniquement les 5 villes spécifiées
        const allowedCities = [
          { id: 1, name: 'Tanger' },
          { id: 2, name: 'Casablanca' },
          { id: 3, name: 'Rabat' },
          { id: 4, name: 'Fès' },
          { id: 5, name: 'Marrakech' }
        ];
        
        setVilles(allowedCities);
        console.log('✅ Villes chargées avec succès:', allowedCities.length);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des villes:', error);
        
        // Fallback avec des villes par défaut si l'API ne répond pas
        console.log('🔄 Utilisation des villes par défaut...');
        const defaultCities = [
          { id: 1, name: 'Tanger' },
          { id: 2, name: 'Casablanca' },
          { id: 3, name: 'Rabat' },
          { id: 4, name: 'Fès' },
          { id: 5, name: 'Marrakech' }
        ];
        setVilles(defaultCities);
      }
    };
    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir l'email et le mot de passe.");
      return;
    }
    if (!email.endsWith("@emsi.ma") && !email.endsWith("@emsi-edu.ma")) {
      setError("L'adresse mail doit se terminer par @emsi.ma ou @emsi-edu.ma");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log('🔐 Tentative de connexion...');
      console.log('📧 Email:', email);
      console.log('🏙️ Ville:', ville);
      
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          city: ville 
        }),
      });

      console.log('📡 Réponse login:', response.status, response.statusText);
      const data = await response.json();
      console.log('📊 Données login:', data);

      if (response.ok) {
        console.log('✅ Connexion réussie!');
        console.log('📊 Données utilisateur reçues:', data.user);
        
        // Stocker les tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        // Déterminer le type d'utilisateur de manière plus robuste
        let userType = 'student'; // Par défaut
        
        // Vérifier admin en premier
        if (data.user.is_superuser === true) {
          userType = 'admin';
        } 
        // Vérifier staff
        else if (data.user.is_staff === true) {
          userType = 'staff';
        }
        // Vérifier les champs possibles du backend
        else if (data.user.user_type) {
          userType = data.user.user_type.toLowerCase();
        }
        else if (data.user.role) {
          userType = data.user.role.toLowerCase();
        }
        else if (data.user.type) {
          userType = data.user.type.toLowerCase();
        }
        // Analyser l'email comme fallback
        else if (data.user.email) {
          const email = data.user.email.toLowerCase();
          if (email.includes('admin')) {
            userType = 'admin';
          } else if (email.includes('staff')) {
            userType = 'staff';
          } else if (email.includes('club')) {
            userType = 'club';
          }
        }
        
        localStorage.setItem('user_type', userType);
        console.log('👤 Type d\'utilisateur défini:', userType);
        console.log('📝 Données complètes utilisateur:', data.user);
        
        // Redirection basée sur le type d'utilisateur
        redirectUserAfterAuth(navigate, data.user);
      } else {
        console.error('❌ Erreur de connexion:', data);
        setError(data.message || data.detail || 'Connexion échouée. Vérifiez vos identifiants.');
      }
    } catch (error) {
      console.error('💥 Erreur réseau lors de la connexion:', error);
      console.error('Type:', error.name);
      console.error('Message:', error.message);
      setError('Erreur de connexion au serveur - Vérifiez que le serveur Django fonctionne');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-logo-container">
          <img src="/img/logo blanc.png" alt="EMSI Logo" className="login-logo" />
        </div>
        <label>Ville</label>
        <select value={ville} onChange={e => setVille(e.target.value)} required disabled={loading}>
          <option value="">Choisir une ville</option>
          {villes.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
        </select>
        <label>Adresse mail</label>
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="prenom.nom@emsi-edu.ma" 
          required 
          disabled={loading}
        />
        <label>Mot de passe</label>
        <div className="password-input-container">
          <input 
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="••••••••" 
            required 
            disabled={loading}
          />
          <button 
            type="button" 
            className="toggle-password" 
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        <div className="contact-link">
          <a href="#">Contactez nous</a>
        </div>
      </form>
    </div>
  );
};

export default Login;