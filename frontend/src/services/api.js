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
            throw new Error(data.message || 'Une erreur est survenue');
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
        return this.request('/auth/profile/', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
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
            method: 'POST',
        });
    }

    async rejectCandidature(id, reason) {
        return this.request(`/candidatures/${id}/reject/`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    }

    async withdrawCandidature(id) {
        return this.request(`/candidatures/${id}/withdraw/`, {
            method: 'POST',
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