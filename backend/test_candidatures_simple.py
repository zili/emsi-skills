#!/usr/bin/env python
import os
import sys
import django
import requests

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsi_project_platform.settings')
django.setup()

def test_candidatures_api():
    print("🔍 TEST API CANDIDATURES")
    print("=" * 50)
    
    # 1. Test de connexion
    print("1️⃣ Connexion utilisateur...")
    login_data = {
        "email": "yassine.zilili@emsi-edu.ma",
        "password": "123456"
    }
    
    try:
        response = requests.post(
            'http://localhost:8000/api/auth/login/',
            json=login_data
        )
        print(f"   Status Login: {response.status_code}")
        
        if response.status_code == 200:
            token = response.json()['access']
            print(f"   ✅ Token obtenu: {token[:50]}...")
            
            # 2. Test API candidatures
            print("\n2️⃣ Test API Candidatures...")
            candidatures_response = requests.get(
                'http://localhost:8000/api/candidatures/',
                headers={'Authorization': f'Bearer {token}'}
            )
            print(f"   Status Candidatures: {candidatures_response.status_code}")
            
            if candidatures_response.status_code == 200:
                data = candidatures_response.json()
                print(f"   ✅ {len(data)} candidatures trouvées")
                
                if data:
                    print("   📋 Première candidature:")
                    candidature = data[0]
                    print(f"      - ID: {candidature.get('id')}")
                    print(f"      - Statut: {candidature.get('status')}")
                    print(f"      - Projet: {candidature.get('project', {}).get('title', 'N/A') if candidature.get('project') else 'N/A'}")
                    print(f"      - Date: {candidature.get('applied_at', 'N/A')}")
                else:
                    print("   ℹ️  Aucune candidature pour cet utilisateur")
                
                # Instructions pour le frontend
                print(f"\n🎯 INSTRUCTIONS POUR LE FRONTEND:")
                print("1. Ouvrez la console du navigateur (F12)")
                print("2. Tapez ces commandes:")
                print("   localStorage.clear()")
                print(f"   localStorage.setItem('token', '{token}')")
                print("   localStorage.setItem('userName', 'Yassine Zilili')")
                print("   localStorage.setItem('userEmail', 'yassine.zilili@emsi-edu.ma')")
                print("   window.location.reload()")
                print("3. Allez sur la page /candidature")
                print("\n✅ L'API candidatures fonctionne parfaitement !")
                
            else:
                print(f"   ❌ Erreur API: {candidatures_response.text[:200]}")
                
        else:
            print(f"   ❌ Erreur login: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_candidatures_api() 