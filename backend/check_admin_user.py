import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsi_project_platform.settings')
django.setup()

from accounts.models import User

def check_admin_users():
    print("🔍 Vérification des utilisateurs admin...")
    
    # Vérifier le type d'utilisateur utilisé
    print("📊 Modèle utilisateur:", User)
    
    users = User.objects.all()
    print(f"📊 Total utilisateurs: {len(users)}")
    print()
    
    for user in users:
        print(f"👤 Utilisateur: {user.username}")
        print(f"   📧 Email: {user.email}")
        print(f"   🔑 Is admin: {user.is_staff}")
        print(f"   🔐 Is superuser: {user.is_superuser}")
        
        # Vérifier le user_type
        print(f"   👥 User type: {user.user_type}")
        print(f"   ✅ Is admin user: {user.user_type == 'admin'}")
        print()

if __name__ == "__main__":
    check_admin_users() 