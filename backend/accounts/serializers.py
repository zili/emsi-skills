from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, City


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'country']


class UserSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    city_id = serializers.IntegerField(write_only=True, required=False)
    skills_list = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'user_type', 'phone', 'city', 'city_id', 'profile_picture', 'bio',
            'skills', 'skills_list', 'experience_years', 'portfolio_url',
            'linkedin_url', 'github_url', 'is_verified', 'rating_average',
            'total_projects', 'created_at', 'updated_at'
        ]
        read_only_fields = ['rating_average', 'total_projects', 'is_verified', 'created_at', 'updated_at']
    
    def get_skills_list(self, obj):
        return obj.get_skills_list()


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    city_id = serializers.IntegerField(required=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm', 'first_name',
            'last_name', 'user_type', 'phone', 'city_id', 'bio', 'skills',
            'experience_years', 'portfolio_url', 'linkedin_url', 'github_url'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs
    
    def validate_city_id(self, value):
        try:
            City.objects.get(id=value)
        except City.DoesNotExist:
            raise serializers.ValidationError("Ville non trouvée.")
        return value
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        city_id = validated_data.pop('city_id')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(password=password, **validated_data)
        user.city_id = city_id
        user.save()
        
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    city_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'city_id', 'profile_picture',
            'bio', 'skills', 'experience_years', 'portfolio_url',
            'linkedin_url', 'github_url'
        ]
    
    def validate_city_id(self, value):
        if value:
            try:
                City.objects.get(id=value)
            except City.DoesNotExist:
                raise serializers.ValidationError("Ville non trouvée.")
        return value


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Les nouveaux mots de passe ne correspondent pas.")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Ancien mot de passe incorrect.")
        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)
    city = serializers.CharField(required=False)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Identifiants invalides.')
            if not user.is_active:
                raise serializers.ValidationError('Compte désactivé.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Email et mot de passe requis.')
        
        return attrs 