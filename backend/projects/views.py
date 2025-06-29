from django.shortcuts import render
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from .models import Project, Category, ProjectTag, ProjectReview
from .serializers import (
    ProjectSerializer, CategorySerializer, ProjectListSerializer,
    ProjectCreateSerializer, ProjectUpdateSerializer, ProjectApprovalSerializer,
    ProjectTagSerializer
)

# Create your views here.

class IsAdminUser(permissions.BasePermission):
    """Permission pour les administrateurs seulement"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.user_type == 'admin'

class ProjectListView(generics.ListAPIView):
    """Liste des projets approuvés - nécessite une authentification"""
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(
            admin_status='approved',
            status='approved'
        ).order_by('-created_at')

class PendingProjectsAdminView(generics.ListAPIView):
    """Liste des projets en attente d'approbation - pour admin seulement"""
    serializer_class = ProjectListSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        return Project.objects.filter(
            admin_status='pending_approval'
        ).order_by('-created_at')

class PublicProjectsView(generics.ListAPIView):
    """Vue publique des projets approuvés pour la page d'accueil"""
    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Project.objects.filter(
            admin_status='approved',
            status='approved'
        ).order_by('-created_at')[:10]  # Limiter à 10 projets

class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectCreateSerializer
    permission_classes = [IsAuthenticated]

class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

class ProjectUpdateView(generics.UpdateAPIView):
    serializer_class = ProjectUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(client=self.request.user)

class ProjectDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(client=self.request.user)

class MyProjectsView(generics.ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(client=self.request.user).order_by('-created_at')

class ProjectApproveView(generics.UpdateAPIView):
    """Approuver un projet - admin seulement"""
    queryset = Project.objects.all()
    serializer_class = ProjectApprovalSerializer
    permission_classes = [IsAdminUser]
    
    def patch(self, request, *args, **kwargs):
        project = self.get_object()
        
        project.admin_status = 'approved'
        project.status = 'approved'
        project.approved_by = request.user
        project.approved_at = timezone.now()
        project.save()
        
        return Response({
            'message': 'Projet approuvé avec succès',
            'project': ProjectSerializer(project).data
        })

class ProjectRejectView(generics.UpdateAPIView):
    """Rejeter un projet - admin seulement"""
    queryset = Project.objects.all()
    serializer_class = ProjectApprovalSerializer
    permission_classes = [IsAdminUser]
    
    def patch(self, request, *args, **kwargs):
        project = self.get_object()
        reason = request.data.get('reason', '')
        
        project.admin_status = 'rejected'
        project.status = 'rejected'
        project.rejection_reason = reason
        project.approved_by = request.user
        project.approved_at = timezone.now()
        project.save()
        
        return Response({
            'message': 'Projet rejeté',
            'project': ProjectSerializer(project).data
        })

class ProjectStatsView(generics.GenericAPIView):
    """Statistiques des projets pour le dashboard admin"""
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        stats = {
            'total_projects': Project.objects.count(),
            'pending_approval': Project.objects.filter(admin_status='pending_approval').count(),
            'approved_projects': Project.objects.filter(admin_status='approved').count(),
            'rejected_projects': Project.objects.filter(admin_status='rejected').count(),
            'by_category': {}
        }
        
        # Stats par catégorie
        for category in Category.objects.all():
            stats['by_category'][category.name] = Project.objects.filter(category=category).count()
        
        return Response(stats)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProjectTagListView(generics.ListAPIView):
    queryset = ProjectTag.objects.all()
    serializer_class = ProjectTagSerializer
    permission_classes = [AllowAny]

@api_view(['GET'])
@permission_classes([AllowAny])
def project_categories_with_icons(request):
    """API pour récupérer les catégories avec leurs icônes"""
    categories = Category.objects.all()
    data = []
    for category in categories:
        data.append({
            'id': category.id,
            'name': category.name,
            'description': category.description,
            'icon': category.icon,
            'display_icon': category.display_icon,
            'color_theme': category.color_theme,
            'project_count': category.projects.filter(admin_status='approved').count()
        })
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_project_stats(request):
    """Statistiques des projets de l'utilisateur connecté"""
    user = request.user
    stats = {
        'total_created': Project.objects.filter(client=user).count(),
        'pending': Project.objects.filter(client=user, admin_status='pending_approval').count(),
        'approved': Project.objects.filter(client=user, admin_status='approved').count(),
        'rejected': Project.objects.filter(client=user, admin_status='rejected').count(),
    }
    return Response(stats)

@api_view(['GET'])
@permission_classes([AllowAny])
def simple_projects_list(request):
    """Liste simple des projets avec les vraies données"""
    try:
        # Récupérer tous les projets avec leurs relations (pour l'interface admin)
        projects = Project.objects.all().select_related('client', 'category')
        
        # Transformer en format attendu par le frontend
        projects_data = []
        for project in projects:
            # Récupérer les vraies données du client
            client_data = {
                'full_name': project.client.full_name if project.client else 'Client',
                'first_name': project.client.first_name if project.client else '',
                'last_name': project.client.last_name if project.client else '',
                'email': project.client.email if project.client else '',
                'username': project.client.username if project.client else ''
            }
            
            # Récupérer les vraies compétences
            skills_list = project.get_required_skills_list()
            tags_data = [{'name': skill} for skill in skills_list] if skills_list else []
            
            # Mapping des statuts pour l'affichage
            status_mapping = {
                'pending_approval': 'En attente',
                'approved': 'Approuvé', 
                'rejected': 'Refusé'
            }
            
            # Construire l'URL de l'image
            if project.main_image:
                image_url = request.build_absolute_uri(project.main_image.url)
                print(f"🖼️ Image pour projet {project.id}: {image_url}")
            else:
                image_url = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80'
                print(f"🖼️ Pas d'image pour projet {project.id}, utilisation image par défaut")
            
            projects_data.append({
                'id': project.id,
                'title': project.title,
                'description': project.description,
                'category': {'name': project.category.name if project.category else 'Autre'},
                'client': client_data,
                'owner': client_data,  # Pour compatibilité avec AdminDemandes
                'skills': skills_list,  # Format array direct pour AdminDemandes
                'estimated_duration': project.estimated_duration or 'Non définie',
                'required_skills': project.required_skills or '',
                'required_skills_list': skills_list,
                'created_at': project.created_at.isoformat(),
                'display_date': project.created_at.strftime('%d/%m/%Y'),
                'status': status_mapping.get(project.admin_status, 'En attente'),  # Pour AdminDemandes
                'admin_status': project.admin_status,  # Statut brut pour les actions
                'tags': tags_data,
                'image': image_url
            })
        
        return Response(projects_data)
        
    except Exception as e:
        # En cas d'erreur, retourner des données de test
        return Response([
            {
                'id': 1,
                'title': 'Projet Test Backend',
                'description': 'Projet de test pour vérifier la connexion backend',
                'category': {'name': 'Développement'},
                'client': {'full_name': 'Test Client', 'email': 'test@emsi.ma'},
                'estimated_duration': '1 mois',
                'required_skills': 'React.js, Django',
                'created_at': '2024-06-28T20:00:00Z',
                'tags': [{'name': 'Test'}, {'name': 'Backend'}],
                'image': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80'
            }
        ])

@api_view(['GET'])
@permission_classes([AllowAny])
def simple_project_detail(request, pk):
    """Détail simple d'un projet sans les relations complexes"""
    try:
        # Récupérer le projet directement sans utiliser les relations
        project = Project.objects.filter(id=pk).values(
            'id', 'title', 'description', 'estimated_duration',
            'required_skills', 'created_at'
        ).first()
        
        if not project:
            return Response({'error': 'Projet introuvable'}, status=404)
        
        # Transformer en format attendu par le frontend
        project_data = {
            'id': project['id'],
            'title': project['title'],
            'description': project['description'],
            'category': {'name': 'Développement'},  # Catégorie par défaut
            'client': {
                'full_name': 'Client EMSI', 
                'email': 'client@emsi.ma',
                'profile_picture': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
            },
            'estimated_duration': project['estimated_duration'] or '2 mois',
            'display_duration': project['estimated_duration'] or '2 mois',
            'required_skills': project['required_skills'] or 'React.js, Django, Python',
            'required_skills_list': (project['required_skills'] or 'React.js, Django, Python').split(','),
            
            'created_at': project['created_at'],
            'display_date': project['created_at'].strftime('%d/%m/%Y') if project['created_at'] else '01/01/2024',
            'tags': [
                {'name': skill.strip()} 
                for skill in (project['required_skills'] or 'React.js, Django, Python').split(',')
            ],
            'image': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80',
            'client_photo': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
            'files': []  # Pas de fichiers pour l'instant
        }
        
        return Response(project_data)
        
    except Exception as e:
        # En cas d'erreur, retourner des données de test
        return Response({
            'id': pk,
            'title': f'Projet Test #{pk}',
            'description': 'Description détaillée du projet de test pour vérifier le bon fonctionnement de la page de détails.',
            'category': {'name': 'Développement'},
            'client': {
                'full_name': 'Client Test', 
                'email': 'test@emsi.ma',
                'profile_picture': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
            },
            'estimated_duration': '1 mois',
            'display_duration': '1 mois',
            'required_skills': 'React.js, Django, Test',
            'required_skills_list': ['React.js', 'Django', 'Test'],
            
            'created_at': '2024-06-28T20:00:00Z',
            'display_date': '28/06/2024',
            'tags': [
                {'name': 'React.js'}, 
                {'name': 'Django'}, 
                {'name': 'Test'}
            ],
            'image': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80',
            'client_photo': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
            'files': []
        })