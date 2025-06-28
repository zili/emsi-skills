import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsi_project_platform.settings')
django.setup()

from accounts.models import User, City

def create_new_users():
    print("=== AJOUT DE NOUVEAUX UTILISATEURS ===")
    print()
    
    # Récupérer des villes
    casablanca = City.objects.get(name="Casablanca")
    tanger = City.objects.filter(name__icontains="Tanger").first()
    if not tanger:
        # Créer Tanger si elle n'existe pas
        tanger = City.objects.create(name="Tanger", country="Morocco")
        print("✅ Ville Tanger créée")
    
    # Utilisateur 1: Staff
    staff_user, created = User.objects.get_or_create(
        email="khaoula.ajbal@emsi-edu.ma",
        defaults={
            'username': 'khaoula_ajbal',
            'first_name': 'Khaoula',
            'last_name': 'Ajbal',
            'user_type': 'staff',
            'city': casablanca,
            'is_active': True,
            'bio': 'Membre du staff EMSI',
            'skills': 'Gestion, Administration, Support'
        }
    )
    
    if created:
        staff_user.set_password('student123')
        staff_user.save()
        print(f"✅ Utilisateur STAFF créé:")
        print(f"   📧 Email: {staff_user.email}")
        print(f"   👤 Username: {staff_user.username}")
        print(f"   📝 Nom: {staff_user.first_name} {staff_user.last_name}")
        print(f"   🏷️  Type: {staff_user.user_type}")
        print(f"   🔐 Mot de passe: student123")
    else:
        print(f"⚠️  Utilisateur staff {staff_user.email} existe déjà")
    
    print("-" * 50)
    
    # Utilisateur 2: Club
    club_user, created = User.objects.get_or_create(
        email="lions.tanger@emsi-edu.ma",
        defaults={
            'username': 'lions_tanger',
            'first_name': 'Lions',
            'last_name': 'Tanger',
            'user_type': 'club',
            'city': tanger,
            'is_active': True,
            'bio': 'Club Lions de Tanger - Organisation étudiante',
            'skills': 'Organisation, Événements, Leadership'
        }
    )
    
    if created:
        club_user.set_password('student123')
        club_user.save()
        print(f"✅ Utilisateur CLUB créé:")
        print(f"   📧 Email: {club_user.email}")
        print(f"   👤 Username: {club_user.username}")
        print(f"   📝 Nom: {club_user.first_name} {club_user.last_name}")
        print(f"   🏷️  Type: {club_user.user_type}")
        print(f"   🔐 Mot de passe: student123")
    else:
        print(f"⚠️  Utilisateur club {club_user.email} existe déjà")
    
    print()
    print("=== RÉSUMÉ DES UTILISATEURS ===")
    total_users = User.objects.count()
    print(f"📊 Total utilisateurs: {total_users}")
    
    # Compter par type
    for user_type in ['admin', 'student', 'staff', 'club']:
        count = User.objects.filter(user_type=user_type).count()
        print(f"   - {user_type.capitalize()}: {count}")

if __name__ == "__main__":
    create_new_users() 