from rest_framework import serializers
from .models import Candidature, CandidatureFile
from accounts.serializers import UserSerializer
from projects.serializers import ProjectListSerializer


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
    project_id = serializers.IntegerField(required=True)
    
    class Meta:
        model = Candidature
        fields = [
            'project_id', 'cover_letter', 'proposed_timeline', 'proposed_budget',
            'availability', 'relevant_experience', 'portfolio_links'
        ]
    
    def validate_project_id(self, value):
        from projects.models import Project
        try:
            project = Project.objects.get(id=value)
            if project.status != 'approved':
                raise serializers.ValidationError("Ce projet n'est pas disponible pour candidater.")
        except Project.DoesNotExist:
            raise serializers.ValidationError("Projet non trouvé.")
        return value
    
    def create(self, validated_data):
        validated_data['candidate'] = self.context['request'].user
        return super().create(validated_data)


class CandidatureUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidature
        fields = [
            'cover_letter', 'proposed_timeline', 'proposed_budget',
            'availability', 'relevant_experience', 'portfolio_links'
        ]


class CandidatureListSerializer(serializers.ModelSerializer):
    candidate = UserSerializer(read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = Candidature
        fields = [
            'id', 'candidate', 'project_title', 'status', 'applied_at',
            'display_name', 'formatted_date'
        ] 
 
 