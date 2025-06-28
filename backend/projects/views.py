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