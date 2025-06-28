import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsi_project_platform.settings')
django.setup()

from accounts.models import User

def test_user_redirections():
    print("=== TEST DES RÈGLES DE REDIRECTION ===")
    print()
    
    # Règles de redirection définies
    redirection_rules = {
        'student': '/accueil-student',
        'staff': '/accueil-staff-club',
        'club': '/accueil-staff-club',
        'admin': '/admin'
    }
    
    print("📋 Règles de redirection définies :")
    for user_type, redirect_path in redirection_rules.items():
        print(f"   • {user_type.upper()} → {redirect_path}")
    
    print()
    print("👥 Utilisateurs dans la base de données :")
    print("-" * 60)
    
    users = User.objects.all()
    
    for user in users:
        user_type = user.user_type
        expected_redirect = redirection_rules.get(user_type, '/accueil-student')
        
        print(f"🔹 {user.first_name} {user.last_name}")
        print(f"   📧 Email: {user.email}")
        print(f"   👤 Username: {user.username}")
        print(f"   🏷️  Type: {user_type}")
        print(f"   🔄 Redirection: {expected_redirect}")
        
        # Vérifier si le type est valide
        if user_type in redirection_rules:
            print(f"   ✅ Type valide")
        else:
            print(f"   ⚠️  Type non reconnu, utilisera la redirection par défaut")
        
        print("-" * 60)
    
    print()
    print("=== RÉSUMÉ DES REDIRECTIONS ===")
    
    # Compter les utilisateurs par type
    type_counts = {}
    for user in users:
        user_type = user.user_type
        if user_type in type_counts:
            type_counts[user_type] += 1
        else:
            type_counts[user_type] = 1
    
    for user_type, count in type_counts.items():
        redirect_path = redirection_rules.get(user_type, '/accueil-student')
        print(f"📊 {count} utilisateur(s) de type '{user_type}' → {redirect_path}")
    
    print()
    print("🎯 TESTS DE CONNEXION RECOMMANDÉS :")
    print("Pour tester les redirections, connectez-vous avec :")
    
    # Prendre un exemple de chaque type
    tested_types = set()
    for user in users:
        if user.user_type not in tested_types:
            redirect_path = redirection_rules.get(user.user_type, '/accueil-student')
            print(f"   • {user.user_type.upper()}: {user.email} (password: student123 ou admin123)")
            print(f"     → Devrait rediriger vers: {redirect_path}")
            tested_types.add(user.user_type)

if __name__ == "__main__":
    test_user_redirections() 