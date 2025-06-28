import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsi_project_platform.settings')
django.setup()

from accounts.models import User

print("=== UTILISATEURS DANS LA BASE DE DONNÉES ===")
print()

users = User.objects.all()

if not users.exists():
    print("❌ Aucun utilisateur trouvé dans la base de données")
else:
    print(f"✅ {users.count()} utilisateur(s) trouvé(s)")
    print()
    
    for user in users:
        print(f"🔹 ID: {user.id}")
        print(f"   📧 Email: {user.email}")
        print(f"   👤 Username: {user.username}")
        print(f"   📝 Nom complet: {user.first_name} {user.last_name}")
        print(f"   🏷️  Type: {user.user_type}")
        print(f"   ✅ Actif: {user.is_active}")
        print(f"   🏙️  Ville: {user.city.name if user.city else 'Non définie'}")
        print(f"   📅 Créé le: {user.created_at}")
        print(f"   🔐 Mot de passe hashé: {user.password[:20]}...")
        print("-" * 50)

print()
print("NOTE: Les mots de passe sont hashés pour la sécurité.")
print("Les mots de passe par défaut utilisés lors de la création sont:")
print("- Administrateurs: 'admin123'")
print("- Étudiants: 'student123'") 