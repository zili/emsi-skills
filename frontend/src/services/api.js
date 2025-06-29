const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('access_token');
    }

    // Set auth token
    setToken(token) {
        this.token = token;
        localStorage.setItem('access_token', token);
    }

    // Clear auth token
    clearToken() {
        this.token = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    // Get auth headers
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Make API request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getAuthHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            // Handle token refresh if 401
            if (response.status === 401 && this.token) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    config.headers = this.getAuthHeaders();
                    const retryResponse = await fetch(url, config);
                    return this.handleResponse(retryResponse);
                }
            }
            
            return this.handleResponse(response);
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Handle response
    async handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            // Log détaillé de l'erreur pour debug
            console.error('❌ Erreur API:', {
                status: response.status,
                statusText: response.statusText,
                url: response.url,
                data: data
            });
            
            // Message d'erreur spécifique selon le statut
            let errorMessage = data.message || data.detail || 'Une erreur est survenue';
            if (response.status === 400 && data.errors) {
                errorMessage = `Erreurs de validation: ${JSON.stringify(data.errors)}`;
            }
            
            throw new Error(errorMessage);
        }
        
        return data;
    }

    // Refresh token
    async refreshToken() {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            this.clearToken();
            return false;
        }

        try {
            const response = await fetch(`${this.baseURL}/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                this.setToken(data.access);
                localStorage.setItem('refresh_token', data.refresh);
                return true;
            } else {
                this.clearToken();
                return false;
            }
        } catch (error) {
            this.clearToken();
            return false;
        }
    }

    // Authentication
    async login(email, password, city) {
        const response = await fetch(`${this.baseURL}/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, city }),
        });

        const data = await response.json();
        
        if (response.ok) {
            this.setToken(data.access);
            localStorage.setItem('refresh_token', data.refresh);
            return data;
        } else {
            throw new Error(data.message || 'Connexion échouée');
        }
    }

    async register(userData) {
        return this.request('/auth/register/', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getProfile() {
        return this.request('/auth/profile/');
    }

    async updateProfile(profileData) {
        // Vérifier s'il y a des fichiers (base64) dans les données
        const hasFiles = profileData.profile_picture?.startsWith('data:') || 
                         profileData.cv_file?.startsWith('data:');
        
        if (hasFiles) {
            console.log('🔄 Fichiers détectés, utilisation de FormData');
            
            // Utiliser FormData pour les fichiers
            const formData = new FormData();
            
            // Ajouter les champs texte et fichiers
            Object.keys(profileData).forEach(key => {
                if (key === 'profile_picture' || key === 'cv_file') {
                    // Traiter les fichiers séparément
                    if (profileData[key] && profileData[key].startsWith('data:')) {
                        // Convertir base64 en Blob
                        const base64Data = profileData[key];
                        const [header, data] = base64Data.split(',');
                        const mimeType = header.match(/data:([^;]+)/)[1];
                        
                        // Créer un Blob à partir du base64
                        const byteCharacters = atob(data);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], { type: mimeType });
                        
                        // Générer un nom de fichier approprié
                        const extension = mimeType.includes('image') ? 
                            (mimeType.includes('png') ? '.png' : '.jpg') : 
                            '.pdf';
                        const fileName = key === 'profile_picture' ? 
                            `profile${extension}` : 
                            `cv${extension}`;
                        
                        formData.append(key, blob, fileName);
                        console.log(`✅ Fichier ${key} ajouté au FormData:`, fileName);
                    }
                } else {
                    // Ajouter les champs texte normalement
                    formData.append(key, profileData[key]);
                    console.log(`📝 Champ texte ajouté:`, key, '=', profileData[key]);
                }
            });
            
            // Utiliser fetch directement pour éviter les problèmes de Content-Type
            const url = `${this.baseURL}/auth/profile/update/`;
            console.log('🚀 Envoi FormData à:', url);
            
            try {
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                        // Ne pas définir Content-Type - le navigateur le fait automatiquement pour FormData
                    },
                    body: formData
                });
                
                console.log('📡 Réponse serveur:', response.status, response.statusText);
                return this.handleResponse(response);
                
            } catch (error) {
                console.error('❌ Erreur lors de l\'upload:', error);
                throw error;
            }
        } else {
            console.log('🔄 Pas de fichiers, utilisation de JSON');
            // Pas de fichiers, utiliser JSON classique
            return this.request('/auth/profile/update/', {
                method: 'PATCH',
                body: JSON.stringify(profileData),
            });
        }
    }

    async changePassword(passwordData) {
        return this.request('/auth/password/change/', {
            method: 'POST',
            body: JSON.stringify(passwordData),
        });
    }

    // Cities
    async getCities() {
        return this.request('/auth/cities/');
    }

    // Projects
    async getProjects(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/projects/?${params}`);
    }

    async getProject(id) {
        return this.request(`/projects/${id}/`);
    }

    async createProject(projectData) {
        return this.request('/projects/create/', {
            method: 'POST',
            body: JSON.stringify(projectData),
        });
    }

    async updateProject(id, projectData) {
        return this.request(`/projects/${id}/update/`, {
            method: 'PUT',
            body: JSON.stringify(projectData),
        });
    }

    async deleteProject(id) {
        return this.request(`/projects/${id}/delete/`, {
            method: 'DELETE',
        });
    }

    async getMyProjects() {
        return this.request('/projects/my-projects/');
    }

    async approveProject(id) {
        return this.request(`/projects/${id}/approve/`, {
            method: 'POST',
        });
    }

    async rejectProject(id, reason) {
        return this.request(`/projects/${id}/reject/`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    }

    // Candidatures
    async getCandidatures(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/candidatures/?${params}`);
    }

    async getCandidature(id) {
        return this.request(`/candidatures/${id}/`);
    }

    async applyToProject(projectId, applicationData) {
        return this.request(`/candidatures/apply/${projectId}/`, {
            method: 'POST',
            body: JSON.stringify(applicationData),
        });
    }

    async acceptCandidature(id) {
        return this.request(`/candidatures/${id}/accept/`, {
            method: 'PATCH',
        });
    }

    async rejectCandidature(id, reason) {
        return this.request(`/candidatures/${id}/reject/`, {
            method: 'PATCH',
            body: JSON.stringify({ reason }),
        });
    }

    async withdrawCandidature(id) {
        return this.request(`/candidatures/${id}/withdraw/`, {
            method: 'PATCH',
        });
    }

    // Ratings
    async getRatings(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/ratings/?${params}`);
    }

    async createRating(ratingData) {
        return this.request('/ratings/', {
            method: 'POST',
            body: JSON.stringify(ratingData),
        });
    }

    async getUserRatings(userId) {
        return this.request(`/ratings/user/${userId}/`);
    }

    // Messages
    async getMessages() {
        return this.request('/messages/');
    }

    async getConversation(userId) {
        return this.request(`/messages/conversation/${userId}/`);
    }

    async sendMessage(messageData) {
        return this.request('/messages/send/', {
            method: 'POST',
            body: JSON.stringify(messageData),
        });
    }

    // Admin
    async getUsers(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/auth/users/?${params}`);
    }

    async getUser(id) {
        return this.request(`/auth/users/${id}/`);
    }

    async updateUser(id, userData) {
        return this.request(`/auth/users/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async deleteUser(id) {
        return this.request(`/auth/users/${id}/`, {
            method: 'DELETE',
        });
    }

    async getUserStats() {
        return this.request('/auth/stats/');
    }

    async getProjectStats() {
        return this.request('/projects/stats/');
    }
}

// Instance exportée pour utilisation dans les composants
const apiService = new ApiService();
export { apiService };
export default apiService; 