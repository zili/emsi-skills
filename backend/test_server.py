#!/usr/bin/env python3
import requests
import json
import time

def test_server():
    """Tester la connectivité du serveur Django"""
    base_url = "http://127.0.0.1:8000"
    
    endpoints_to_test = [
        "/",
        "/health/",
        "/api/auth/cities/"
    ]
    
    print("🧪 TEST DE CONNECTIVITÉ DU SERVEUR")
    print("=" * 50)
    
    for endpoint in endpoints_to_test:
        url = f"{base_url}{endpoint}"
        print(f"\n📡 Test: {url}")
        
        try:
            response = requests.get(url, timeout=5)
            print(f"   ✅ Status: {response.status_code}")
            
            if response.headers.get('content-type', '').startswith('application/json'):
                data = response.json()
                print(f"   📄 Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
            else:
                print(f"   📄 Response: {response.text[:200]}...")
                
        except requests.exceptions.ConnectionError:
            print(f"   ❌ Erreur: Impossible de se connecter au serveur")
        except requests.exceptions.Timeout:
            print(f"   ⏰ Erreur: Timeout")
        except Exception as e:
            print(f"   ❌ Erreur: {e}")

if __name__ == "__main__":
    test_server() 