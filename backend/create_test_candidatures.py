#!/usr/bin/env python
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsi_project_platform.settings')
django.setup()

from candidatures.models import Candidature
from projects.models import Project
from accounts.models import User

try:
    # Récupérer le projet test
    projet = Project.objects.get(id=20)
    print(f"Projet trouvé: {projet.title}")
    
    # Récupérer quelques étudiants
    candidats = User.objects.filter(user_type='student')[:3]
    print(f"Candidats trouvés: {candidats.count()}")
    
    candidatures = []
    for candidat in candidats:
        # Vérifier si la candidature n'existe pas déjà
        if not Candidature.objects.filter(project=projet, candidate=candidat).exists():
            c = Candidature.objects.create(
                project=projet,
                candidate=candidat,
                cover_letter=f"Je suis très intéressé par ce projet car il correspond parfaitement à mes compétences. J'ai une expérience en développement web et je pense pouvoir apporter une valeur ajoutée à votre projet. - {candidat.first_name} {candidat.last_name}",
                availability="Disponible immédiatement",
                relevant_experience=f"Étudiant en informatique avec des projets en {candidat.first_name}"
            )
            candidatures.append(c)
            print(f"✅ Candidature créée pour {candidat.first_name} {candidat.last_name}")
        else:
            print(f"⚠️ Candidature existe déjà pour {candidat.first_name} {candidat.last_name}")
    
    print(f"\n🎉 Total candidatures créées: {len(candidatures)}")
    
except Exception as e:
    print(f"❌ Erreur: {e}") 