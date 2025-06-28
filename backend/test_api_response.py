import requests
import json

def test_projects_api():
    try:
        url = 'http://localhost:8000/api/projects/public/'
        response = requests.get(url)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\nNombre de projets: {data['count']}")
            
            if data['results']:
                print("\nPremier projet:")
                first_project = data['results'][0]
                print(json.dumps(first_project, indent=2, ensure_ascii=False))
                
                print("\nChamps disponibles:")
                for key in first_project.keys():
                    print(f"- {key}: {type(first_project[key])}")
        else:
            print(f"Erreur: {response.text}")
            
    except Exception as e:
        print(f"Erreur de connexion: {e}")

def test_categories_api():
    try:
        url = 'http://localhost:8000/api/projects/categories/'
        response = requests.get(url)
        
        print(f"\n=== CATEGORIES API ===")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Nombre de catégories: {len(data)}")
            
            for category in data:
                print(f"- {category['name']} (ID: {category['id']})")
        else:
            print(f"Erreur: {response.text}")
            
    except Exception as e:
        print(f"Erreur de connexion: {e}")

if __name__ == "__main__":
    test_projects_api()
    test_categories_api() 
 
 