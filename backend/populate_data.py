#!/usr/bin/env python3
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsi_project_platform.settings')
django.setup()

from accounts.models import City, User
from projects.models import Category, Project

def create_cities():
    """Créer les villes du Maroc"""
    cities_data = [
        "Casablanca", "Rabat", "Fès", "Marrakech", "Agadir", 
        "Tanger", "Meknès", "Oujda", "Kenitra", "Tetouan",
        "Safi", "Mohammedia", "Khouribga", "Beni Mellal", "El Jadida"
    ]
    
    print("🏙️ Création des villes...")
    for city_name in cities_data:
        city, created = City.objects.get_or_create(
            name=city_name,
            defaults={'country': 'Morocco'}
        )
        if created:
            print(f"   ✅ {city_name}")
        else:
            print(f"   ⚠️ {city_name} (existe déjà)")

def create_categories():
    """Créer les catégories de projets"""
    categories_data = [
        {
            'name': 'Développement Web',
            'description': 'Sites web, applications web, e-commerce',
            'icon': 'web'
        },
        {
            'name': 'Développement Mobile',
            'description': 'Applications iOS, Android, Flutter',
            'icon': 'mobile'
        },
        {
            'name': 'Design Graphique',
            'description': 'Logos, branding, design UI/UX',
            'icon': 'design'
        },
        {
            'name': 'Marketing Digital',
            'description': 'SEO, réseaux sociaux, publicité en ligne',
            'icon': 'marketing'
        },
        {
            'name': 'Rédaction & Traduction',
            'description': 'Articles, traduction, correction',
            'icon': 'writing'
        },
        {
            'name': 'Data Science',
            'description': 'Analyse de données, machine learning, BI',
            'icon': 'data'
        },
        {
            'name': 'Vidéo & Animation',
            'description': 'Montage vidéo, animation, motion design',
            'icon': 'video'
        },
        {
            'name': 'Consulting',
            'description': 'Conseil en stratégie, audit, formation',
            'icon': 'consulting'
        }
    ]
    
    print("\n📂 Création des catégories...")
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={
                'description': cat_data['description'],
                'icon': cat_data['icon']
            }
        )
        if created:
            print(f"   ✅ {cat_data['name']}")
        else:
            print(f"   ⚠️ {cat_data['name']} (existe déjà)")

def create_test_users():
    """Créer quelques utilisateurs de test"""
    casablanca = City.objects.get(name="Casablanca")
    rabat = City.objects.get(name="Rabat")
    
    test_users = [
        {
            'username': 'youssef_dev',
            'email': 'youssef@emsi.ma',
            'first_name': 'Youssef',
            'last_name': 'Benali',
            'user_type': 'professional',
            'city': casablanca,
            'skills': 'Python, Django, React, PostgreSQL',
            'experience_years': 3,
            'bio': 'Développeur full-stack passionné avec 3 ans d\'expérience'
        },
        {
            'username': 'sara_design',
            'email': 'sara@emsi.ma',
            'first_name': 'Sara',
            'last_name': 'Alami',
            'user_type': 'professional',
            'city': rabat,
            'skills': 'Photoshop, Illustrator, Figma, UI/UX',
            'experience_years': 2,
            'bio': 'Designer UI/UX créative spécialisée en design mobile'
        },
        {
            'username': 'hassan_student',
            'email': 'hassan@student.emsi.ma',
            'first_name': 'Hassan',
            'last_name': 'Kettani',
            'user_type': 'student',
            'city': casablanca,
            'skills': 'Java, Spring Boot, MySQL',
            'experience_years': 1,
            'bio': 'Étudiant en informatique cherchant des projets pour acquérir de l\'expérience'
        }
    ]
    
    print("\n👥 Création des utilisateurs de test...")
    for user_data in test_users:
        user, created = User.objects.get_or_create(
            email=user_data['email'],
            defaults=user_data
        )
        if created:
            user.set_password('password123')
            user.save()
            print(f"   ✅ {user_data['first_name']} {user_data['last_name']} ({user_data['user_type']})")
        else:
            print(f"   ⚠️ {user_data['email']} (existe déjà)")

def create_sample_projects():
    """Créer quelques projets d'exemple"""
    try:
        # Récupérer les utilisateurs et catégories
        admin = User.objects.get(email='admin@emsi.ma')
        web_category = Category.objects.get(name='Développement Web')
        design_category = Category.objects.get(name='Design Graphique')
        
        sample_projects = [
            {
                'title': 'Site E-commerce pour Boutique',
                'description': 'Développement d\'un site e-commerce complet pour une boutique de vêtements avec panier, paiement en ligne et gestion des stocks.',
                'category': web_category,
                'client': admin,
                'budget_range': '2000-5000',
                'estimated_duration': '2-months',
                'required_skills': 'PHP, Laravel, MySQL, Payment Gateway',
                'status': 'approved',
                'is_featured': True
            },
            {
                'title': 'Design Logo et Identité Visuelle',
                'description': 'Création d\'un logo professionnel et d\'une charte graphique complète pour une startup tech.',
                'category': design_category,
                'client': admin,
                'budget_range': '500-1000',
                'estimated_duration': '2-weeks',
                'required_skills': 'Illustrator, Photoshop, Branding',
                'status': 'approved',
                'is_urgent': True
            }
        ]
        
        print("\n📋 Création des projets d'exemple...")
        for project_data in sample_projects:
            project, created = Project.objects.get_or_create(
                title=project_data['title'],
                defaults=project_data
            )
            if created:
                print(f"   ✅ {project_data['title']}")
            else:
                print(f"   ⚠️ {project_data['title']} (existe déjà)")
                
    except Exception as e:
        print(f"   ❌ Erreur lors de la création des projets: {e}")

if __name__ == '__main__':
    print("🚀 PEUPLEMENT DE LA BASE DE DONNÉES")
    print("=" * 50)
    
    try:
        create_cities()
        create_categories()
        create_test_users()
        create_sample_projects()
        
        print("\n✅ Base de données peuplée avec succès !")
        print("\n📊 Résumé:")
        print(f"   - Villes: {City.objects.count()}")
        print(f"   - Catégories: {Category.objects.count()}")
        print(f"   - Utilisateurs: {User.objects.count()}")
        print(f"   - Projets: {Project.objects.count()}")
        
    except Exception as e:
        print(f"❌ Erreur: {e}") 