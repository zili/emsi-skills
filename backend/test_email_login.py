import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsi_project_platform.settings')
django.setup()

from accounts.models import User
from django.contrib.auth import authenticate

def test_email_authentication():
    print("=== TEST D'AUTHENTIFICATION PAR EMAIL ===")
    print()
    
    # Liste des emails à tester
    test_accounts = [
        {"email": "khaoula.ajbal@emsi-edu.ma", "password": "student123", "type": "staff"},
        {"email": "lions.tanger@emsi-edu.ma", "password": "student123", "type": "club"},
        {"email": "yassine.zilili@emsi-edu.ma", "password": "student123", "type": "student"},
        {"email": "admin@emsi.ma", "password": "admin123", "type": "admin"}
    ]
    
    for account in test_accounts:
        email = account["email"]
        password = account["password"]
        user_type = account["type"]
        
        print(f"🔍 Test de connexion pour {user_type.upper()}:")
        print(f"   📧 Email: {email}")
        print(f"   🔐 Mot de passe: {password}")
        
        # Vérifier si l'utilisateur existe
        try:
            user = User.objects.get(email=email)
            print(f"   ✅ Utilisateur trouvé: {user.username}")
            
            # Test d'authentification par email
            auth_user = authenticate(username=user.username, password=password)
            if auth_user:
                print(f"   ✅ Authentification réussie avec username")
            else:
                print(f"   ❌ Échec d'authentification avec username")
                
            # Test direct de vérification du mot de passe
            if user.check_password(password):
                print(f"   ✅ Mot de passe correct")
            else:
                print(f"   ❌ Mot de passe incorrect")
                
        except User.DoesNotExist:
            print(f"   ❌ Utilisateur non trouvé")
        
        print("-" * 60)
    
    print()
    print("=== RÉSUMÉ POUR LA CONNEXION FRONTEND ===")
    print("Pour se connecter via l'API JWT, utilisez:")
    print()
    
    for account in test_accounts:
        user = User.objects.get(email=account["email"])
        print(f"📧 {account['email']} ({account['type'].upper()})")
        print(f"   Username: {user.username}")
        print(f"   Password: {account['password']}")
        print(f"   Connexion API: POST /api/token/ avec username='{user.username}' et password='{account['password']}'")
        print()

if __name__ == "__main__":
    test_email_authentication() 