from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Candidature, CandidatureFile
from accounts.serializers import UserSerializer
from projects.serializers import ProjectListSerializer
from projects.models import Project

User = get_user_model()


class CandidatureFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidatureFile
        fields = ['id', 'file', 'name', 'description', 'uploaded_at']


class CandidatureSerializer(serializers.ModelSerializer):
    candidate = UserSerializer(read_only=True)
    project_id = serializers.IntegerField(write_only=True)
    files = CandidatureFileSerializer(many=True, read_only=True)
    reviewed_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Candidature
        fields = [
            'id', 'project_id', 'candidate', 'cover_letter', 'motivation_message',
            'proposed_timeline', 'proposed_budget', 'availability', 'display_name',
            'candidate_photo', 'formatted_date', 'status', 'applied_at', 'updated_at',
            'reviewed_at', 'reviewed_by', 'rejection_reason', 'relevant_experience',
            'portfolio_links', 'files'
        ]
        read_only_fields = ['candidate', 'applied_at', 'updated_at', 'reviewed_at', 'reviewed_by']
    
    def create(self, validated_data):
        validated_data['candidate'] = self.context['request'].user
        return super().create(validated_data)


class CandidatureCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer une candidature"""
    
    class Meta:
        model = Candidature
        fields = [
            'project', 'cover_letter', 'proposed_timeline', 
            'proposed_budget', 'availability', 'relevant_experience', 
            'portfolio_links'
        ]
    
    def validate_project(self, value):
        """Vérifier que le projet existe et est approuvé"""
        if not value.admin_status == 'approved':
            raise serializers.ValidationError("Ce projet n'est pas disponible pour candidature")
        return value
    
    def validate(self, data):
        """Vérifier que l'utilisateur n'a pas déjà candidaté"""
        request = self.context.get('request')
        if request and request.user:
            if Candidature.objects.filter(
                project=data['project'], 
                candidate=request.user
            ).exists():
                raise serializers.ValidationError("Vous avez déjà candidaté pour ce projet")
        return data
    
    def create(self, validated_data):
        """Créer la candidature avec le candidat actuel"""
        request = self.context.get('request')
        validated_data['candidate'] = request.user
        return super().create(validated_data)


class CandidatureUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidature
        fields = [
            'cover_letter', 'proposed_timeline', 'proposed_budget',
            'availability', 'relevant_experience', 'portfolio_links'
        ]


class CandidateInfoSerializer(serializers.ModelSerializer):
    """Serializer pour les infos du candidat"""
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'profile_picture']


class ProjectBriefSerializer(serializers.ModelSerializer):
    """Serializer bref pour le projet dans les candidatures"""
    client = CandidateInfoSerializer(read_only=True)  # Ajout des infos du client/propriétaire
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'category', 'estimated_duration', 'client']


class CandidatureListSerializer(serializers.ModelSerializer):
    """Serializer pour lister les candidatures"""
    candidate = CandidateInfoSerializer(read_only=True)
    project = ProjectBriefSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Candidature
        fields = [
            'id', 'candidate', 'project', 'status', 'status_display',
            'cover_letter', 'proposed_timeline', 'proposed_budget',
            'availability', 'applied_at', 'display_name', 'formatted_date'
        ]


class CandidatureDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une candidature"""
    candidate = CandidateInfoSerializer(read_only=True)
    project = ProjectBriefSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Candidature
        fields = [
            'id', 'candidate', 'project', 'status', 'status_display',
            'cover_letter', 'motivation_message', 'proposed_timeline', 
            'proposed_budget', 'availability', 'relevant_experience',
            'portfolio_links', 'applied_at', 'updated_at', 'reviewed_at',
            'rejection_reason', 'display_name', 'formatted_date'
        ]


class CandidatureStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour mettre à jour le statut d'une candidature"""
    
    class Meta:
        model = Candidature
        fields = ['status', 'rejection_reason']
        
    def validate_status(self, value):
        if value not in ['accepted', 'rejected']:
            raise serializers.ValidationError("Le statut doit être 'accepted' ou 'rejected'")
        return value
 
 