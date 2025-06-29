import requests
import json

def test_approval_api():
    """Test de l'API d'approbation des projets"""
    
    # Configuration
    base_url = "http://localhost:8000"
    
    print("🧪 Test de l'API d'approbation des projets...")
    
    # 1. Tester l'obtention d'un token (simuler une connexion)
    print("\n1️⃣ Test connexion utilisateur...")
    login_data = {
        "email": "admin@emsi.ma",  # Utilisateur admin
        "password": "admin123"     # Mot de passe par défaut
    }
    
    try:
        login_response = requests.post(f"{base_url}/api/token/", json=login_data)
        print(f"Status connexion: {login_response.status_code}")
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            access_token = token_data['access']
            print(f"✅ Token obtenu: {access_token[:50]}...")
        else:
            print(f"❌ Échec connexion: {login_response.text}")
            return
    except Exception as e:
        print(f"❌ Erreur connexion: {e}")
        return
    
    # 2. Récupérer la liste des projets
    print("\n2️⃣ Test récupération projets...")
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        projects_response = requests.get(f"{base_url}/api/projects/simple/", headers=headers)
        print(f"Status projets: {projects_response.status_code}")
        
        if projects_response.status_code == 200:
            projects = projects_response.json()
            print(f"✅ {len(projects)} projets récupérés")
            
            # Trouver un projet en attente
            pending_projects = [p for p in projects if p.get('admin_status') == 'pending_approval']
            if pending_projects:
                test_project = pending_projects[0]
                print(f"📄 Projet de test: {test_project['title']} (ID: {test_project['id']})")
            else:
                print("❌ Aucun projet en attente trouvé")
                return
        else:
            print(f"❌ Échec récupération projets: {projects_response.text}")
            return
    except Exception as e:
        print(f"❌ Erreur récupération projets: {e}")
        return
    
    # 3. Tester l'approbation
    print(f"\n3️⃣ Test approbation projet {test_project['id']}...")
    
    try:
        approve_response = requests.patch(
            f"{base_url}/api/projects/{test_project['id']}/approve/", 
            headers=headers
        )
        print(f"Status approbation: {approve_response.status_code}")
        
        if approve_response.status_code == 200:
            result = approve_response.json()
            print(f"✅ Approbation réussie: {result.get('message', 'OK')}")
        else:
            print(f"❌ Échec approbation: {approve_response.text}")
            
    except Exception as e:
        print(f"❌ Erreur approbation: {e}")
    
    print("\n🏁 Test terminé")

if __name__ == "__main__":
    test_approval_api() 