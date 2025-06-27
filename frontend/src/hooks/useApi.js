import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000/api';

// Hook générique pour les appels API
export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      console.log(`🔍 Fetching ${endpoint}`, { 
        hasToken: !!token, 
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none' 
      });
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      // Ajouter le token seulement s'il existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        ...options,
        headers
      });

      console.log(`📡 Response for ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('🔐 Token invalide ou expiré, nettoyage du localStorage');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Data received for ${endpoint}:`, result);
      
      setData(result.results || result);
      setError(null);
    } catch (err) {
      console.error(`❌ Error fetching ${endpoint}:`, err);
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
};

// Hook spécialisé pour les projets
export const useProjects = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const endpoint = `/projects/${params ? `?${params}` : ''}`;
  return useApi(endpoint);
};

// Hook spécialisé pour les utilisateurs
export const useUsers = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const endpoint = `/users/${params ? `?${params}` : ''}`;
  return useApi(endpoint);
};

// Hook spécialisé pour les candidatures
export const useCandidatures = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const endpoint = `/candidatures/${params ? `?${params}` : ''}`;
  return useApi(endpoint);
};

// Hook spécialisé pour les villes
export const useCities = () => {
  return useApi('/auth/cities/');
};

// Hook spécialisé pour les catégories
export const useCategories = () => {
  return useApi('/categories/');
};

// Hook pour les projets publics (sans authentification)
export const usePublicProjects = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const endpoint = `/projects/public/${params ? `?${params}` : ''}`;
  return useApi(endpoint);
}; 