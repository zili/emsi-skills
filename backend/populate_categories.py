import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsi_project_platform.settings')
django.setup()

from projects.models import Category, ProjectTag, Project
from django.utils import timezone

def populate_categories():
    """Populate categories based on frontend data"""
    
    categories_data = [
        {
            'name': 'Développement',
            'description': 'Projets de développement web, mobile et logiciels',
            'icon': 'code',
            'display_icon': 'fa-code',
            'color_theme': '#178f56'
        },
        {
            'name': 'Génie Civil',
            'description': 'Projets d\'ingénierie civile et construction',
            'icon': 'engineering',
            'display_icon': 'fa-hard-hat',
            'color_theme': '#f39c12'
        },
        {
            'name': 'Industriel',
            'description': 'Projets industriels et manufacturiers',
            'icon': 'factory',
            'display_icon': 'fa-industry',
            'color_theme': '#e74c3c'
        },
        {
            'name': 'Marketing',
            'description': 'Projets de marketing et communication',
            'icon': 'campaign',
            'display_icon': 'fa-bullhorn',
            'color_theme': '#9b59b6'
        },
        {
            'name': 'Bénévolat',
            'description': 'Projets bénévoles et associatifs',
            'icon': 'volunteer',
            'display_icon': 'fa-hands-helping',
            'color_theme': '#1abc9c'
        },
        {
            'name': 'Art',
            'description': 'Projets artistiques et créatifs',
            'icon': 'palette',
            'display_icon': 'fa-palette',
            'color_theme': '#ff6b6b'
        },
        {
            'name': 'Vidéo & Montage',
            'description': 'Projets de production vidéo et montage',
            'icon': 'videocam',
            'display_icon': 'fa-video',
            'color_theme': '#3498db'
        },
        {
            'name': 'Autres',
            'description': 'Autres types de projets',
            'icon': 'more',
            'display_icon': 'fa-ellipsis-h',
            'color_theme': '#95a5a6'
        }
    ]
    
    print("🎯 Création des catégories...")
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f"✅ Catégorie créée: {category.name}")
        else:
            # Mettre à jour les champs
            for field, value in cat_data.items():
                if field != 'name':
                    setattr(category, field, value)
            category.save()
            print(f"🔄 Catégorie mise à jour: {category.name}")


def populate_project_tags():
    """Populate project tags based on frontend skills data"""
    
    tags_data = [
        # Développement
        {'name': 'React', 'color': '#61dafb'},
        {'name': 'Vue.js', 'color': '#4fc08d'},
        {'name': 'Angular', 'color': '#dd0031'},
        {'name': 'Node.js', 'color': '#339933'},
        {'name': 'Python', 'color': '#3776ab'},
        {'name': 'Django', 'color': '#092e20'},
        {'name': 'Laravel', 'color': '#ff2d20'},
        {'name': 'PHP', 'color': '#777bb4'},
        {'name': 'JavaScript', 'color': '#f7df1e'},
        {'name': 'TypeScript', 'color': '#3178c6'},
        {'name': 'Java', 'color': '#007396'},
        {'name': 'C#', 'color': '#239120'},
        {'name': 'MySQL', 'color': '#4479a1'},
        {'name': 'PostgreSQL', 'color': '#336791'},
        {'name': 'MongoDB', 'color': '#47a248'},
        
        # Design & UI/UX
        {'name': 'UI/UX', 'color': '#ff6b6b'},
        {'name': 'Figma', 'color': '#f24e1e'},
        {'name': 'Adobe XD', 'color': '#ff61f6'},
        {'name': 'Photoshop', 'color': '#31a8ff'},
        {'name': 'Illustrator', 'color': '#ff9a00'},
        
        # Marketing
        {'name': 'SEO', 'color': '#9b59b6'},
        {'name': 'Google Ads', 'color': '#4285f4'},
        {'name': 'Facebook Ads', 'color': '#1877f2'},
        {'name': 'Content Marketing', 'color': '#e74c3c'},
        {'name': 'Email Marketing', 'color': '#f39c12'},
        
        # Vidéo & Montage
        {'name': 'Adobe Premiere', 'color': '#9999ff'},
        {'name': 'After Effects', 'color': '#9999ff'},
        {'name': 'Final Cut Pro', 'color': '#000000'},
        {'name': 'DaVinci Resolve', 'color': '#233a51'},
        
        # Génie Civil
        {'name': 'AutoCAD', 'color': '#f39c12'},
        {'name': 'Revit', 'color': '#f39c12'},
        {'name': 'SketchUp', 'color': '#f39c12'},
        {'name': 'ArchiCAD', 'color': '#f39c12'},
        
        # Général
        {'name': 'Gestion de projet', 'color': '#178f56'},
        {'name': 'Communication', 'color': '#1abc9c'},
        {'name': 'Recherche', 'color': '#95a5a6'},
        {'name': 'Rédaction', 'color': '#34495e'},
    ]
    
    print("\n🏷️  Création des tags...")
    for tag_data in tags_data:
        tag, created = ProjectTag.objects.get_or_create(
            name=tag_data['name'],
            defaults=tag_data
        )
        if created:
            print(f"✅ Tag créé: {tag.name}")
        else:
            # Mettre à jour la couleur
            tag.color = tag_data['color']
            tag.save()
            print(f"🔄 Tag mis à jour: {tag.name}")


def update_existing_projects():
    """Update existing projects with admin_status and other new fields"""
    
    print("\n📋 Mise à jour des projets existants...")
    
    projects = Project.objects.all()
    for project in projects:
        # Set admin_status based on current status
        if project.status == 'approved':
            project.admin_status = 'approved'
        elif project.status == 'rejected':
            project.admin_status = 'rejected'
        else:
            project.admin_status = 'pending_approval'
        
        # Set default display values if empty
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
        
        if not project.display_date:
            project.display_date = project.created_at.strftime("%d/%m/%Y")
        
        project.save()
        print(f"🔄 Projet mis à jour: {project.title}")


if __name__ == '__main__':
    print("🚀 Démarrage de la population des données...")
    
    try:
        populate_categories()
        populate_project_tags() 
        update_existing_projects()
        
        print("\n✅ Population des données terminée avec succès!")
        print(f"📊 Statistiques:")
        print(f"   - Catégories: {Category.objects.count()}")
        print(f"   - Tags: {ProjectTag.objects.count()}")
        print(f"   - Projets: {Project.objects.count()}")
        
    except Exception as e:
        print(f"\n❌ Erreur lors de la population: {e}")
        import traceback
        traceback.print_exc() 
 
 