from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name


class Project(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Brouillon'),
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
        ('in_progress', 'En cours'),
        ('completed', 'Terminé'),
        ('cancelled', 'Annulé'),
    )
    
    BUDGET_RANGES = (
        ('0-500', '0-500 DH'),
        ('500-1000', '500-1000 DH'),
        ('1000-2000', '1000-2000 DH'),
        ('2000-5000', '2000-5000 DH'),
        ('5000+', '5000+ DH'),
    )
    
    DURATION_CHOICES = (
        ('1-week', '1 semaine'),
        ('2-weeks', '2 semaines'),
        ('1-month', '1 mois'),
        ('2-months', '2 mois'),
        ('3-months', '3 mois'),
        ('6-months', '6 mois'),
        ('1-year', '1 an'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='projects')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_projects')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_projects')
    
    budget_range = models.CharField(max_length=20, choices=BUDGET_RANGES)
    estimated_duration = models.CharField(max_length=20, choices=DURATION_CHOICES)
    required_skills = models.TextField(help_text="Compétences requises séparées par des virgules")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_urgent = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    
    # Dates
    deadline = models.DateTimeField(null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    completion_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Stats
    views_count = models.IntegerField(default=0)
    applications_count = models.IntegerField(default=0)
    
    # Admin review
    rejection_reason = models.TextField(blank=True)
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_projects')
    approved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def get_required_skills_list(self):
        if self.required_skills:
            return [skill.strip() for skill in self.required_skills.split(',')]
        return []
    
    @property
    def is_active(self):
        return self.status in ['approved', 'in_progress']


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='project_images/')
    description = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.project.title}"


class ProjectFile(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='project_files/')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.project.title}"
