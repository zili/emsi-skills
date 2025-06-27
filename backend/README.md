# 🚀 EMSI Project Platform - Backend API

Backend Django REST Framework pour la plateforme de projets EMSI.

## 📋 **Configuration**

### **Base de Données**
- **Type:** SQLite (développement)
- **Fichier:** `db.sqlite3`
- **Données de test:** ✅ Disponibles

### **Applications Django**
- `accounts` - Gestion utilisateurs et authentification
- `projects` - Gestion des projets
- `candidatures` - Gestion des candidatures
- `ratings` - Système d'évaluation
- `messaging` - Système de messagerie

## 🔑 **Authentification**

L'API utilise **JWT (JSON Web Tokens)** pour l'authentification.

### **Endpoints d'authentification:**
- `POST /api/token/` - Obtenir les tokens (login)
- `POST /api/token/refresh/` - Rafraîchir le token
- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion (alternative)

## 👥 **Utilisateurs de Test**

| Email | Mot de passe | Type | Ville |
|-------|--------------|------|-------|
| `admin@emsi.ma` | `lina123` | admin | - |
| `youssef@emsi.ma` | `password123` | professional | Casablanca |
| `sara@emsi.ma` | `password123` | professional | Rabat |
| `hassan@student.emsi.ma` | `password123` | student | Casablanca |

## 🛠️ **Endpoints API**

### **🔐 Authentification (`/api/auth/`)**
```
GET    /api/auth/cities/           # Liste des villes
POST   /api/auth/register/         # Inscription
POST   /api/auth/login/            # Connexion
GET    /api/auth/profile/          # Profil utilisateur
PUT    /api/auth/profile/update/   # Mise à jour profil
POST   /api/auth/password/change/  # Changement mot de passe
GET    /api/auth/users/            # Liste utilisateurs (admin)
GET    /api/auth/stats/            # Statistiques (admin)
```

### **📂 Projets (`/api/projects/`)**
```
GET    /api/projects/              # Liste des projets
POST   /api/projects/create/       # Créer un projet
GET    /api/projects/{id}/         # Détail projet
PUT    /api/projects/{id}/update/  # Modifier projet
DELETE /api/projects/{id}/delete/  # Supprimer projet
GET    /api/projects/my-projects/  # Mes projets
POST   /api/projects/{id}/approve/ # Approuver (admin)
POST   /api/projects/{id}/reject/  # Rejeter (admin)
GET    /api/projects/categories/   # Liste catégories
```

### **📝 Candidatures (`/api/candidatures/`)**
```
GET    /api/candidatures/                    # Liste candidatures
POST   /api/candidatures/apply/{project_id}/ # Postuler
GET    /api/candidatures/{id}/               # Détail candidature
POST   /api/candidatures/{id}/accept/        # Accepter
POST   /api/candidatures/{id}/reject/        # Rejeter
POST   /api/candidatures/{id}/withdraw/      # Retirer
```

### **⭐ Évaluations (`/api/ratings/`)**
```
GET    /api/ratings/                 # Liste évaluations
POST   /api/ratings/create/          # Créer évaluation
GET    /api/ratings/user/{user_id}/  # Évaluations utilisateur
```

### **💬 Messages (`/api/messages/`)**
```
GET    /api/messages/                      # Liste messages
POST   /api/messages/send/                 # Envoyer message
GET    /api/messages/conversation/{user}/  # Conversation
```

## 🚀 **Démarrage**

### **1. Installation des dépendances**
```bash
pip install -r requirements.txt
```

### **2. Migrations de base de données**
```bash
python manage.py makemigrations
python manage.py migrate
```

### **3. Créer un superutilisateur**
```bash
python manage.py createsuperuser
```

### **4. Peupler avec des données de test**
```bash
python populate_data.py
```

### **5. Démarrer le serveur**
```bash
python manage.py runserver
```

**L'API sera disponible sur:** `http://localhost:8000/api/`

## 🧪 **Test de l'API**

### **Exemple de connexion:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "youssef@emsi.ma", "password": "password123"}'
```

### **Exemple avec token:**
```bash
curl -X GET http://localhost:8000/api/projects/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📊 **Données Actuelles**

- **15 villes** marocaines
- **8 catégories** de projets
- **4 utilisateurs** de test
- **2 projets** d'exemple

## 🔧 **Technologies**

- **Framework:** Django 4.2.7
- **API:** Django REST Framework 3.14.0
- **Authentification:** JWT (djangorestframework-simplejwt)
- **Base de données:** SQLite (dev) / PostgreSQL (prod)
- **CORS:** django-cors-headers
- **Filtres:** django-filter

## 📝 **Administration**

Interface d'administration Django disponible sur: `http://localhost:8000/admin/`

**Identifiants admin:**
- Email: `admin@emsi.ma`
- Mot de passe: `lina123` 