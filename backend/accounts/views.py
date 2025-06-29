from django.shortcuts import render
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Count, Avg
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from datetime import datetime, timedelta
from django.utils import timezone

from .models import User, City
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    PasswordChangeSerializer, LoginSerializer, CitySerializer
)
from projects.models import Project
from ratings.models import Rating


class CityListView(generics.ListAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [AllowAny]


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Compte créé avec succès'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Connexion réussie'
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'message': 'Mot de passe modifié avec succès'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Admin views
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['user_type', 'is_verified', 'city']
    search_fields = ['first_name', 'last_name', 'email', 'username']
    ordering_fields = ['created_at', 'rating_average', 'total_projects']
    ordering = ['-created_at']
    
    def get_queryset(self):
        # Only admin users can access this
        if not self.request.user.user_type == 'admin':
            return User.objects.none()
        return super().get_queryset()


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only admin users can update other users
        if self.request.user.user_type == 'admin':
            return User.objects.all()
        return User.objects.none()


class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only admin users can delete users
        if self.request.user.user_type == 'admin':
            return User.objects.all()
        return User.objects.none()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats_view(request):
    if request.user.user_type != 'admin':
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    stats = {
        'total_users': User.objects.count(),
        'students': User.objects.filter(user_type='student').count(),
        'professionals': User.objects.filter(user_type='professional').count(),
        'admins': User.objects.filter(user_type='admin').count(),
        'verified_users': User.objects.filter(is_verified=True).count(),
        'users_by_city': list(
            City.objects.annotate(
                user_count=Count('user')
            ).values('name', 'user_count').order_by('-user_count')[:10]
        ),
        'recent_registrations': User.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=30)
        ).count(),
        'average_rating': User.objects.aggregate(
            avg_rating=Avg('rating_average')
        )['avg_rating'] or 0
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_portfolio(request, user_id):
    """
    Récupère toutes les données du portfolio d'un utilisateur
    """
    try:
        user = User.objects.get(id=user_id)
        
        # Données utilisateur de base
        user_data = {
            'id': user.id,
            'prenom': user.first_name,
            'nom': user.last_name,
            'email': user.email,
            'photo': user.profile_picture.url if user.profile_picture else None,
            'bio': user.bio,
            'phone': user.phone,
            'city': user.city.name if user.city else None,
            'linkedin_url': user.linkedin_url,
            'github_url': user.github_url,
            'portfolio_url': user.portfolio_url,
            'cv_file': user.cv_file.url if user.cv_file else None,
            'rating_average': float(user.rating_average),
            'experience_years': user.experience_years,
            'total_projects': user.total_projects,
            'created_at': user.created_at.strftime('%Y-%m-%d'),
        }
        
        # Compétences
        competences = user.get_skills_list()
        user_data['competences'] = competences
        
        # Langues (convertir la chaîne en liste)
        langues = []
        if user.languages:
            lang_list = [lang.strip() for lang in user.languages.split(',')]
            for lang in lang_list:
                langues.append({'nom': lang, 'niveau': 'Intermédiaire'})  # Par défaut
        user_data['langues'] = langues
        
        # Projets créés par l'utilisateur
        projets = Project.objects.filter(client=user).order_by('-created_at')[:5]  # 5 derniers projets
        projets_data = []
        for projet in projets:
            projet_data = {
                'id': projet.id,
                'titre': projet.title,
                'description': projet.description,
                'image': projet.main_image.url if projet.main_image else '/img/default-project.png',
                'budget': float(projet.budget),
                'duree': f"{projet.duration_days} jours",
                'statut': projet.status,
                'date_creation': projet.created_at.strftime('%Y-%m-%d'),
                'categories': [projet.category.name] if projet.category else [],
                'candidatures_count': projet.candidatures.count(),
            }
            projets_data.append(projet_data)
        user_data['projets_realises'] = projets_data
        
        # Témoignages/Commentaires reçus
        ratings = Rating.objects.filter(
            rated_user=user,
            is_public=True
        ).select_related('rater', 'project').order_by('-created_at')[:5]  # 5 derniers témoignages
        
        commentaires_data = []
        for rating in ratings:
            if rating.comment:  # Seulement ceux avec commentaires
                commentaire_data = {
                    'id': rating.id,
                    'auteur': rating.rater.full_name,
                    'poste': f"Projet : {rating.project.title}",
                    'commentaire': rating.comment,
                    'note': rating.score,
                    'date': rating.created_at.strftime('%Y-%m-%d'),
                    'avatar': rating.rater.profile_picture.url if rating.rater.profile_picture else '/img/default-avatar.png',
                    'criteria': {
                        'communication': rating.communication,
                        'quality': rating.quality,
                        'timeliness': rating.timeliness,
                        'professionalism': rating.professionalism,
                    }
                }
                commentaires_data.append(commentaire_data)
        user_data['commentaires'] = commentaires_data
        
        # Statistiques
        stats = {
            'projets_termines': Project.objects.filter(client=user, status='completed').count(),
            'note_moyenne': float(user.rating_average),
            'total_evaluations': Rating.objects.filter(rated_user=user).count(),
            'taux_recommandation': 0
        }
        
        # Calculer le taux de recommandation
        total_ratings = Rating.objects.filter(rated_user=user).count()
        if total_ratings > 0:
            recommended = Rating.objects.filter(rated_user=user, would_recommend=True).count()
            stats['taux_recommandation'] = round((recommended / total_ratings) * 100, 1)
        
        user_data['statistiques'] = stats
        
        return Response({
            'success': True,
            'message': f'Portfolio de {user.full_name} chargé avec succès',
            'data': user_data
        })
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Utilisateur non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Erreur lors du chargement du portfolio: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
