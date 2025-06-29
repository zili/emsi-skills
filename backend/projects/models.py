from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # Font Awesome icon class
    display_icon = models.CharField(max_length=50, blank=True)  # Alternative icon
    color_theme = models.CharField(max_length=20, blank=True)  # Color theme
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class ProjectTag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#007bff')  # Hex color
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Project(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('in_progress', 'En cours'),
        ('completed', 'Terminé'),
        ('cancelled', 'Annulé'),
        ('rejected', 'Rejeté'),
    ]
    
    ADMIN_STATUS_CHOICES = [
        ('pending_approval', 'En attente d\'approbation'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='projects')
    
    # Users
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_projects')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_projects')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_projects')
    
    # Project Details
    estimated_duration = models.CharField(max_length=100, blank=True)
    required_skills = models.TextField(blank=True, help_text="Compétences requises séparées par des virgules")
    
    # Status and Admin
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_status = models.CharField(max_length=20, choices=ADMIN_STATUS_CHOICES, default='pending_approval')
    rejection_reason = models.TextField(blank=True)
    
    # Flags
    is_urgent = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    
    # Media
    main_image = models.ImageField(upload_to='project_images/', null=True, blank=True)
    client_photo = models.URLField(blank=True)
    
    # Display fields for frontend compatibility
    display_duration = models.CharField(max_length=100, blank=True)
    display_date = models.CharField(max_length=100, blank=True)
    
    # Dates
    deadline = models.DateTimeField(null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    completion_date = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Stats
    views_count = models.PositiveIntegerField(default=0)
    applications_count = models.PositiveIntegerField(default=0)
    rating_average = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    
    # Many-to-many relationships
    tags = models.ManyToManyField(ProjectTag, through='ProjectTagAssignment', blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['admin_status']),
            models.Index(fields=['category']),
            models.Index(fields=['client']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return self.title
    
    def get_required_skills_list(self):
        """Retourne la liste des compétences requises"""
        if self.required_skills:
            return [skill.strip() for skill in self.required_skills.split(',') if skill.strip()]
        return []
    
    def increment_views(self):
        """Incrémenter le compteur de vues"""
        self.views_count += 1
        self.save(update_fields=['views_count'])
    
    def increment_applications(self):
        """Incrémenter le compteur de candidatures"""
        self.applications_count += 1
        self.save(update_fields=['applications_count'])
    
    def update_rating_average(self):
        """Mettre à jour la note moyenne basée sur les avis"""
        reviews = self.project_reviews.all()
        if reviews.exists():
            total_rating = sum(review.rating for review in reviews)
            self.rating_average = total_rating / reviews.count()
        else:
            self.rating_average = 0.00
        self.save(update_fields=['rating_average'])


class ProjectTagAssignment(models.Model):
    """Table de liaison pour les tags de projet"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tag_assignments')
    tag = models.ForeignKey(ProjectTag, on_delete=models.CASCADE, related_name='project_assignments')
    assigned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['project', 'tag']
    
    def __str__(self):
        return f"{self.project.title} - {self.tag.name}"


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='project_images/')
    description = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['uploaded_at']
    
    def __str__(self):
        return f"Image for {self.project.title}"


class ProjectFile(models.Model):
    FILE_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('doc', 'Document'),
        ('docx', 'Document Word'),
        ('xls', 'Excel'),
        ('xlsx', 'Excel'),
        ('ppt', 'PowerPoint'),
        ('pptx', 'PowerPoint'),
        ('zip', 'Archive ZIP'),
        ('rar', 'Archive RAR'),
        ('txt', 'Fichier texte'),
        ('other', 'Autre'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='project_files/')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES, default='other')
    is_reference_file = models.BooleanField(default=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['uploaded_at']
    
    def __str__(self):
        return f"{self.name} - {self.project.title}"
    
    @property
    def file_type_display(self):
        """Retourne le type de fichier formaté pour l'affichage"""
        return dict(self.FILE_TYPE_CHOICES).get(self.file_type, 'Autre').upper()
    
    def save(self, *args, **kwargs):
        # Auto-detect file type from extension if not set
        if self.file and not self.file_type:
            extension = self.file.name.split('.')[-1].lower()
            type_mapping = {
                'pdf': 'pdf',
                'doc': 'doc',
                'docx': 'docx',
                'xls': 'xls',
                'xlsx': 'xlsx',
                'ppt': 'ppt',
                'pptx': 'pptx',
                'zip': 'zip',
                'rar': 'rar',
                'txt': 'txt',
            }
            self.file_type = type_mapping.get(extension, 'other')
        
        super().save(*args, **kwargs)


class ProjectReview(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_reviews')
    rated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_reviews')
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Note de 1 à 5"
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['project', 'rated_by']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Review by {self.rated_by.username} for {self.project.title}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update project rating average after saving review
        self.project.update_rating_average()
