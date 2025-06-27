import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        const response = await fetch('http://localhost:8000/api/auth/cities/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Réponse reçue:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 Données reçues:', data);
        setVilles(data.results || []);
        console.log('✅ Villes chargées avec succès:', data.results?.length || 0);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des villes:', error);
        console.error('Type d\'erreur:', error.name);
        console.error('Message:', error.message);
        
        // Fallback avec des villes par défaut si l'API ne répond pas
        console.log('🔄 Utilisation des villes par défaut...');
        const defaultCities = [
          { id: 1, name: 'Casablanca' },
          { id: 2, name: 'Rabat' },
          { id: 3, name: 'Fès' },
          { id: 4, name: 'Marrakech' },
          { id: 5, name: 'Agadir' },
          { id: 6, name: 'Tanger' },
          { id: 7, name: 'Meknès' },
          { id: 8, name: 'Oujda' }
        ];
        setVilles(defaultCities);
        setError('Utilisation des villes par défaut - Serveur API non disponible');
      }
    };
    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ville || !email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (!email.endsWith("@emsi.ma") && !email.endsWith("@student.emsi.ma")) {
      setError("L'adresse mail doit se terminer par @emsi.ma ou @student.emsi.ma");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log('🔐 Tentative de connexion...');
      console.log('📧 Email:', email);
      console.log('🏙️ Ville:', ville);
      
      const response = await fetch('http://localhost:8000/api/token/', {
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
        // Stocker les tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        // Redirection vers l'accueil après connexion réussie
        console.log('✅ Redirection vers l\'accueil');
        navigate('/');
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
          placeholder="prenom.nom@emsi.ma" 
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