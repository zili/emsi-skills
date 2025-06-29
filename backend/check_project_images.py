import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsi_project_platform.settings')
django.setup()

from projects.models import Project

def check_project_images():
    print("🔍 Vérification des images des projets...")
    projects = Project.objects.all()
    print(f"📊 Total projets: {len(projects)}")
    print()
    
    for project in projects:
        print(f"📄 Projet {project.id}: {project.title}")
        print(f"   📂 Image: {project.main_image}")
        if project.main_image:
            print(f"   🔗 Chemin: {project.main_image.url}")
            # Vérifier si le fichier existe physiquement
            if project.main_image and hasattr(project.main_image, 'path'):
                file_exists = os.path.exists(project.main_image.path)
                print(f"   📁 Fichier existe: {file_exists}")
            else:
                print(f"   ❌ Pas de chemin physique")
        else:
            print(f"   ❌ Pas d'image")
        print(f"   📅 Statut admin: {project.admin_status}")
        print()

if __name__ == "__main__":
    check_project_images() 