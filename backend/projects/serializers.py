from rest_framework import serializers
from .models import Project, Category, ProjectImage, ProjectFile, ProjectTag, ProjectReview, ProjectTagAssignment
from accounts.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'display_icon', 'color_theme']


class ProjectTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTag
        fields = ['id', 'name', 'color']


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'description', 'uploaded_at']


class ProjectFileSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectFile
        fields = ['id', 'file', 'name', 'description', 'uploaded_by', 'uploaded_at', 'file_type_display', 'is_reference_file']


class ProjectReviewSerializer(serializers.ModelSerializer):
    rated_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectReview
        fields = ['id', 'rating', 'comment', 'rated_by', 'created_at']


class ProjectSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    owner = serializers.SerializerMethodField()  # Alias pour compatibilité frontend
    assigned_to = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()  # Image principale pour compatibilité frontend
    files = ProjectFileSerializer(many=True, read_only=True)
    required_skills_list = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField()  # Alias pour compatibilité frontend
    rating = serializers.SerializerMethodField()  # Note moyenne pour compatibilité frontend
    tags = serializers.SerializerMethodField()  # Tags du projet
    project_reviews = ProjectReviewSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'category', 'category_id', 'client', 'owner',
            'assigned_to', 'estimated_duration', 'required_skills', 'skills',
            'required_skills_list', 'status', 'admin_status', 'is_urgent', 'is_featured',
            'main_image', 'client_photo', 'display_duration', 'display_date', 'technology_used',
            'deadline', 'start_date', 'completion_date', 'created_at', 'updated_at',
            'views_count', 'applications_count', 'rating_average', 'rating', 'rejection_reason', 
            'approved_by', 'approved_at', 'images', 'image', 'files', 'tags', 'project_reviews'
        ]
        read_only_fields = [
            'client', 'views_count', 'applications_count', 'approved_by',
            'approved_at', 'created_at', 'updated_at'
        ]
    
    def get_required_skills_list(self, obj):
        return obj.get_required_skills_list()
    
    def get_owner(self, obj):
        # Alias pour 'client' pour compatibilité avec le frontend
        if obj.client:
            return UserSerializer(obj.client).data
        return None
    
    def get_skills(self, obj):
        # Alias pour 'required_skills' pour compatibilité avec le frontend
        return obj.required_skills
    
    def get_tags(self, obj):
        # Retourner les tags du projet
        tags = []
        for assignment in obj.tag_assignments.all():
            tags.append({
                'id': assignment.tag.id,
                'name': assignment.tag.name,
                'color': assignment.tag.color
            })
        return tags
    
    def get_image(self, obj):
        # Priorité: main_image > première image > image par défaut
        if obj.main_image:
            return obj.main_image.url
        if obj.images.exists():
            return obj.images.first().image.url
        # Images par défaut selon la catégorie
        default_images = {
            'Développement': 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1600',
            'Génie Civil': 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=1600',
            'Marketing': 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1600',
            'Art': 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?auto=compress&cs=tinysrgb&w=1600',
            'Vidéo & Montage': 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1600',
        }
        return default_images.get(obj.category.name if obj.category else None, 
                                'https://images.pexels.com/photos/1462935/pexels-photo-1462935.jpeg?auto=compress&cs=tinysrgb&w=1600')
    
    def get_rating(self, obj):
        # Retourner une note par défaut ou calculée
        if obj.rating_average > 0:
            return float(obj.rating_average)
        # Note par défaut basée sur le statut du projet
        if obj.status == 'completed':
            return 4.5
        elif obj.status == 'approved':
            return 4.0
        return 0.0
    
    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)


class ProjectCreateSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(required=True)
    
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'category_id',
            'estimated_duration', 'required_skills', 'is_urgent', 'deadline',
            'main_image', 'display_duration', 'display_date', 'technology_used'
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
        validated_data['admin_status'] = 'pending_approval'
        return super().create(validated_data)


class ProjectUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(required=False)
    
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'category_id',
            'estimated_duration', 'required_skills', 'is_urgent', 'deadline',
            'main_image', 'display_duration', 'display_date', 'technology_used'
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
    image = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'category', 'client',
            'estimated_duration', 'status', 'admin_status', 'is_urgent', 'is_featured',
            'deadline', 'created_at', 'views_count', 'applications_count',
            'main_image', 'image', 'display_duration', 'display_date', 'technology_used', 'tags'
        ] 
    
    def get_image(self, obj):
        if obj.main_image:
            return obj.main_image.url
        return None
    
    def get_tags(self, obj):
        tags = []
        for assignment in obj.tag_assignments.all():
            tags.append({
                'id': assignment.tag.id,
                'name': assignment.tag.name,
                'color': assignment.tag.color
            })
        return tags 