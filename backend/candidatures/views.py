from django.shortcuts import render
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import Candidature
from .serializers import (
    CandidatureCreateSerializer, CandidatureListSerializer,
    CandidatureDetailSerializer, CandidatureStatusUpdateSerializer
)

# Create your views here.

class CandidatureListView(generics.ListAPIView):
    """Liste des candidatures de l'utilisateur connecté"""
    serializer_class = CandidatureListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Candidature.objects.filter(candidate=self.request.user)

class CandidatureDetailView(generics.RetrieveAPIView):
    """Détail d'une candidature"""
    serializer_class = CandidatureDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Candidature.objects.filter(candidate=self.request.user)

class CandidatureCreateView(generics.CreateAPIView):
    """Créer une nouvelle candidature"""
    serializer_class = CandidatureCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            candidature = serializer.save()
            
            # Incrémenter le compteur de candidatures du projet
            candidature.project.increment_applications()
            
            return Response({
                'message': 'Candidature soumise avec succès',
                'candidature_id': candidature.id,
                'status': 'success'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'message': 'Erreur lors de la soumission de la candidature',
                'error': str(e),
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)

class CandidatureAcceptView(generics.UpdateAPIView):
    """Accepter une candidature (réservé au client du projet)"""
    serializer_class = CandidatureStatusUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Seul le client propriétaire du projet peut accepter/rejeter
        return Candidature.objects.filter(project__client=self.request.user)
    
    def patch(self, request, *args, **kwargs):
        candidature = self.get_object()
        candidature.status = 'accepted'
        candidature.reviewed_by = request.user
        candidature.reviewed_at = timezone.now()
        candidature.save()
        
        # Assigner le projet au candidat accepté
        candidature.project.assigned_to = candidature.candidate
        candidature.project.status = 'in_progress'
        candidature.project.save()
        
        return Response({
            'message': 'Candidature acceptée avec succès',
            'candidature_id': candidature.id,
            'status': 'success'
        })

class CandidatureRejectView(generics.UpdateAPIView):
    """Rejeter une candidature (réservé au client du projet)"""
    serializer_class = CandidatureStatusUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Candidature.objects.filter(project__client=self.request.user)
    
    def patch(self, request, *args, **kwargs):
        candidature = self.get_object()
        candidature.status = 'rejected'
        candidature.rejection_reason = request.data.get('rejection_reason', '')
        candidature.reviewed_by = request.user
        candidature.reviewed_at = timezone.now()
        candidature.save()
        
        return Response({
            'message': 'Candidature rejetée',
            'candidature_id': candidature.id,
            'status': 'success'
        })

class CandidatureWithdrawView(generics.UpdateAPIView):
    """Retirer sa propre candidature"""
    serializer_class = CandidatureStatusUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Candidature.objects.filter(candidate=self.request.user)
    
    def patch(self, request, *args, **kwargs):
        candidature = self.get_object()
        if candidature.status != 'pending':
            return Response({
                'message': 'Impossible de retirer cette candidature',
                'error': 'La candidature a déjà été traitée',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        candidature.status = 'withdrawn'
        candidature.save()
        
        return Response({
            'message': 'Candidature retirée avec succès',
            'candidature_id': candidature.id,
            'status': 'success'
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_candidature_status(request, project_id):
    """Vérifier si l'utilisateur a déjà candidaté pour ce projet"""
    try:
        candidature = Candidature.objects.get(
            project_id=project_id,
            candidate=request.user
        )
        return Response({
            'has_applied': True,
            'candidature_id': candidature.id,
            'status': candidature.status,
            'status_display': candidature.get_status_display(),
            'applied_at': candidature.applied_at
        })
    except Candidature.DoesNotExist:
        return Response({
            'has_applied': False,
            'can_apply': True
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_candidatures(request, project_id):
    """Liste des candidatures pour un projet (réservé au propriétaire du projet)"""
    from projects.models import Project
    
    try:
        project = Project.objects.get(id=project_id, client=request.user)
        candidatures = Candidature.objects.filter(project=project)
        serializer = CandidatureListSerializer(candidatures, many=True)
        
        return Response({
            'project_title': project.title,
            'candidatures_count': candidatures.count(),
            'candidatures': serializer.data
        })
    except Project.DoesNotExist:
        return Response({
            'error': 'Projet non trouvé ou vous n\'êtes pas autorisé à voir ses candidatures'
        }, status=status.HTTP_404_NOT_FOUND)
