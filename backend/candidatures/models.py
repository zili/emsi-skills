from django.db import models
from django.conf import settings


class Candidature(models.Model):
    STATUS_CHOICES = (
        ('pending', 'En attente'),
        ('accepted', 'Acceptée'),
        ('rejected', 'Rejetée'),
        ('withdrawn', 'Retirée'),
    )
    
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='candidatures')
    candidate = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='candidatures')
    
    # Application details
    cover_letter = models.TextField(help_text="Lettre de motivation")
    proposed_timeline = models.CharField(max_length=100, blank=True)
    proposed_budget = models.CharField(max_length=100, blank=True)
    availability = models.CharField(max_length=200, help_text="Disponibilité du candidat")
    
    # Status and dates
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    # Review details
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_candidatures')
    rejection_reason = models.TextField(blank=True)
    
    # Portfolio/experience
    relevant_experience = models.TextField(blank=True, help_text="Expérience pertinente")
    portfolio_links = models.TextField(blank=True, help_text="Liens vers portfolio/travaux précédents")
    
    class Meta:
        ordering = ['-applied_at']
        unique_together = ('project', 'candidate')  # Un candidat ne peut postuler qu'une fois par projet
    
    def __str__(self):
        return f"{self.candidate.full_name} - {self.project.title}"
    
    @property
    def is_pending(self):
        return self.status == 'pending'
    
    @property
    def is_accepted(self):
        return self.status == 'accepted'


class CandidatureFile(models.Model):
    candidature = models.ForeignKey(Candidature, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='candidature_files/')
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.candidature}"
