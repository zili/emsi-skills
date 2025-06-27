from rest_framework import serializers
from .models import Project, Category, ProjectImage, ProjectFile
from accounts.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon']


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'description', 'uploaded_at']


class ProjectFileSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectFile
        fields = ['id', 'file', 'name', 'description', 'uploaded_by', 'uploaded_at']


class ProjectSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    files = ProjectFileSerializer(many=True, read_only=True)
    required_skills_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'category', 'category_id', 'client',
            'assigned_to', 'budget_range', 'estimated_duration', 'required_skills',
            'required_skills_list', 'status', 'is_urgent', 'is_featured',
            'deadline', 'start_date', 'completion_date', 'created_at', 'updated_at',
            'views_count', 'applications_count', 'rejection_reason', 'approved_by',
            'approved_at', 'images', 'files'
        ]
        read_only_fields = [
            'client', 'views_count', 'applications_count', 'approved_by',
            'approved_at', 'created_at', 'updated_at'
        ]
    
    def get_required_skills_list(self, obj):
        return obj.get_required_skills_list()
    
    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)


class ProjectCreateSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(required=True)
    
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'category_id', 'budget_range',
            'estimated_duration', 'required_skills', 'is_urgent', 'deadline'
        ]
    
    def validate_category_id(self, value):
        try:
            Category.objects.get(id=value)
        except Category.DoesNotExist:
            raise serializers.ValidationError("Catégorie non trouvée.")
        return value
    
    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        validated_data['status'] = 'pending'  # Needs admin approval
        return super().create(validated_data)


class ProjectUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(required=False)
    
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'category_id', 'budget_range',
            'estimated_duration', 'required_skills', 'is_urgent', 'deadline'
        ]
    
    def validate_category_id(self, value):
        if value:
            try:
                Category.objects.get(id=value)
            except Category.DoesNotExist:
                raise serializers.ValidationError("Catégorie non trouvée.")
        return value


class ProjectApprovalSerializer(serializers.Serializer):
    reason = serializers.CharField(required=False, allow_blank=True)


class ProjectListSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'category', 'client', 'budget_range',
            'estimated_duration', 'status', 'is_urgent', 'is_featured',
            'deadline', 'created_at', 'views_count', 'applications_count'
        ] 