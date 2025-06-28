import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsi_project_platform.settings')
django.setup()

from accounts.models import User, City

def create_admin_user():
    """Créer un utilisateur admin pour tester les fonctionnalités"""
    
    # Créer ou récupérer une ville
    city, created = City.objects.get_or_create(
        name='Casablanca',
        defaults={'country': 'Morocco'}
    )
    
    # Créer l'utilisateur admin
    admin_user, created = User.objects.get_or_create(
        email='admin@emsi.ma',
        defaults={
            'username': 'admin_emsi',
            'first_name': 'Admin',
            'last_name': 'EMSI',
            'user_type': 'admin',
            'city': city,
            'is_staff': True,
            'is_superuser': True,
            'is_verified': True
        }
    )
    
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print("✅ Utilisateur admin créé avec succès!")
        print(f"   Email: {admin_user.email}")
        print(f"   Mot de passe: admin123")
    else:
        print("⚠️  L'utilisateur admin existe déjà")
        print(f"   Email: {admin_user.email}")
    
    return admin_user

def create_test_users():
    """Créer des utilisateurs de test"""
    
    city = City.objects.get(name='Casablanca')
    
    # Étudiant de test
    student_user, created = User.objects.get_or_create(
        email='etudiant@emsi.ma',
        defaults={
            'username': 'etudiant_test',
            'first_name': 'Ahmed',
            'last_name': 'Alami',
            'user_type': 'student',
            'city': city,
            'skills': 'React, JavaScript, Python',
            'bio': 'Étudiant en informatique passionné par le développement web'
        }
    )
    
    if created:
        student_user.set_password('etudiant123')
        student_user.save()
        print("✅ Utilisateur étudiant créé!")
        print(f"   Email: {student_user.email}")
        print(f"   Mot de passe: etudiant123")
    else:
        print("⚠️  L'utilisateur étudiant existe déjà")

if __name__ == '__main__':
    print("🚀 Création des utilisateurs de test...")
    
    try:
        admin_user = create_admin_user()
        create_test_users()
        
        print(f"\n📊 Statistiques:")
        print(f"   - Total utilisateurs: {User.objects.count()}")
        print(f"   - Admins: {User.objects.filter(user_type='admin').count()}")
        print(f"   - Étudiants: {User.objects.filter(user_type='student').count()}")
        print(f"   - Professionnels: {User.objects.filter(user_type='professional').count()}")
        
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        import traceback
        traceback.print_exc() 
 
 