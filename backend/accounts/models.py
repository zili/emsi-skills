from django.contrib.auth.models import AbstractUser
from django.db import models


class City(models.Model):
    name = models.CharField(max_length=100, unique=True)
    country = models.CharField(max_length=100, default='Morocco')
    
    class Meta:
        verbose_name_plural = "Cities"
    
    def __str__(self):
        return self.name


class User(AbstractUser):
    USER_TYPES = (
        ('student', 'Étudiant'),
        ('professional', 'Professionnel'),
        ('admin', 'Administrateur'),
    )
    
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='student')
    phone = models.CharField(max_length=20, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    bio = models.TextField(blank=True)
    skills = models.TextField(blank=True, help_text="Compétences séparées par des virgules")
    experience_years = models.IntegerField(default=0)
    portfolio_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False)
    rating_average = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_projects = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Portfolio/CV
    cv_file = models.FileField(upload_to='cv_files/', blank=True, null=True)
    languages = models.TextField(blank=True)  # "Français, Anglais"
    
    # Stats pour dashboard
    projects_created_count = models.IntegerField(default=0)
    candidatures_received_count = models.IntegerField(default=0)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_skills_list(self):
        if self.skills:
            return [skill.strip() for skill in self.skills.split(',')]
        return []
