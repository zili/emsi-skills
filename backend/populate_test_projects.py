import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsi_project_platform.settings')
django.setup()

from projects.models import Category, Project, ProjectTag, ProjectTagAssignment
from accounts.models import User
from django.utils import timezone
from datetime import datetime, timedelta

def create_test_projects():
    """Create test projects matching the frontend mockProjects structure"""
    
    # Get or create a test user
    client_user, created = User.objects.get_or_create(
        email='client@emsi.ma',
        defaults={
            'username': 'client_test',
            'first_name': 'Ahmed',
            'last_name': 'Bennani',
            'user_type': 'professional'
        }
    )
    
    # Get categories
    categories = {cat.name: cat for cat in Category.objects.all()}
    
    # Test projects data matching frontend structure
    projects_data = [
        {
            'title': 'Plateforme EMSI Skills Share',
            'description': 'Une plateforme complète pour connecter les étudiants EMSI avec des projets professionnels. Interface moderne avec React et backend Django REST.',
            'category': 'Développement',
            'budget_range': '2000-5000',
            'estimated_duration': '3-months',
            'required_skills': 'React, Django, PostgreSQL, UI/UX',
            'display_duration': '3-4 mois',
            'display_date': '12/05/2024',
            'technology_used': 'React',
            'admin_status': 'pending_approval',
            'status': 'pending'
        },
        {
            'title': 'App Mobile Gestion Finances',
            'description': 'Application mobile pour la gestion des finances personnelles avec dashboard analytique et notifications intelligentes.',
            'category': 'Développement',
            'budget_range': '1000-2000',
            'estimated_duration': '2-months',
            'required_skills': 'React Native, Node.js, MongoDB',
            'display_duration': '2 mois',
            'display_date': '15/05/2024',
            'technology_used': 'React Native',
            'admin_status': 'pending_approval',
            'status': 'pending'
        },
        {
            'title': 'Étude structurelle pont urbain',
            'description': 'Analyse complète de la structure d\'un pont urbain avec modélisation 3D et calculs de résistance selon les normes marocaines.',
            'category': 'Génie Civil',
            'budget_range': '5000+',
            'estimated_duration': '6-months',
            'required_skills': 'AutoCAD, Revit, Calculs structures',
            'display_duration': '6 mois',
            'display_date': '18/05/2024',
            'technology_used': 'AutoCAD',
            'admin_status': 'pending_approval',
            'status': 'pending'
        },
        {
            'title': 'Campagne publicitaire eco-responsable',
            'description': 'Création d\'une campagne marketing complète pour promouvoir des produits éco-responsables avec stratégie multi-canal.',
            'category': 'Marketing',
            'budget_range': '1000-2000',
            'estimated_duration': '1-month',
            'required_skills': 'Content Marketing, Photoshop, SEO',
            'display_duration': '1 mois',
            'display_date': '20/05/2024',
            'technology_used': 'Adobe Creative',
            'admin_status': 'pending_approval',
            'status': 'pending'
        },
        {
            'title': 'Système automatisation production',
            'description': 'Conception d\'un système d\'automatisation pour ligne de production industrielle avec interface de monitoring.',
            'category': 'Industriel',
            'budget_range': '5000+',
            'estimated_duration': '6-months',
            'required_skills': 'PLC, AutoCAD, Gestion de projet',
            'display_duration': '4-6 mois',
            'display_date': '22/05/2024',
            'technology_used': 'Siemens PLC',
            'admin_status': 'pending_approval',
            'status': 'pending'
        },
        {
            'title': 'Site E-commerce artisanat marocain',
            'description': 'Plateforme e-commerce dédiée à l\'artisanat marocain avec paiement en ligne et gestion des stocks.',
            'category': 'Développement',
            'budget_range': '2000-5000',
            'estimated_duration': '3-months',
            'required_skills': 'Vue.js, Laravel, MySQL, Payment Integration',
            'display_duration': '3 mois',
            'display_date': '25/05/2024',
            'technology_used': 'Vue.js',
            'admin_status': 'pending_approval',
            'status': 'pending'
        }
    ]
    
    print("🚀 Création des projets de test...")
    
    for project_data in projects_data:
        category_name = project_data.pop('category')
        category = categories.get(category_name)
        
        if not category:
            print(f"❌ Catégorie '{category_name}' non trouvée")
            continue
        
        # Check if project already exists
        existing_project = Project.objects.filter(title=project_data['title']).first()
        if existing_project:
            print(f"⚠️  Projet '{project_data['title']}' existe déjà")
            continue
        
        project = Project.objects.create(
            client=client_user,
            category=category,
            **project_data
        )
        
        # Add tags based on required_skills
        skills = [skill.strip() for skill in project_data['required_skills'].split(',')]
        for skill_name in skills:
            try:
                tag = ProjectTag.objects.get(name=skill_name)
                ProjectTagAssignment.objects.get_or_create(
                    project=project,
                    tag=tag
                )
            except ProjectTag.DoesNotExist:
                print(f"⚠️  Tag '{skill_name}' non trouvé pour {project.title}")
        
        print(f"✅ Projet créé: {project.title}")


def update_project_fields():
    """Update existing projects with new field values"""
    
    print("\n🔄 Mise à jour des champs des projets...")
    
    projects = Project.objects.all()
    for project in projects:
        if not project.display_date:
            project.display_date = project.created_at.strftime("%d/%m/%Y")
        
        if not project.display_duration and project.estimated_duration:
            duration_map = {
                '1-week': '1 semaine',
                '2-weeks': '2 semaines',
                '1-month': '1 mois',
                '2-months': '2 mois',
                '3-months': '3 mois',
                '6-months': '6 mois',
                '1-year': '1 an',
            }
            project.display_duration = duration_map.get(project.estimated_duration, project.estimated_duration)
        
        if not project.admin_status:
            if project.status == 'approved':
                project.admin_status = 'approved'
            elif project.status == 'rejected':
                project.admin_status = 'rejected'
            else:
                project.admin_status = 'pending_approval'
        
        project.save()
        print(f"🔄 Mis à jour: {project.title}")


if __name__ == '__main__':
    print("🎯 Démarrage de la création des projets de test...")
    
    try:
        create_test_projects()
        update_project_fields()
        
        print(f"\n✅ Création terminée!")
        print(f"📊 Total projets: {Project.objects.count()}")
        print(f"📊 Projets en attente: {Project.objects.filter(admin_status='pending_approval').count()}")
        
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        import traceback
        traceback.print_exc() 
 
 