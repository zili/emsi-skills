from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Rating(models.Model):
    # Who is rating whom
    rater = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='given_ratings')
    rated_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_ratings')
    
    # What project this rating is for
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='ratings')
    
    # Rating details
    score = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Note de 1 à 5 étoiles"
    )
    
    # Specific criteria ratings
    communication = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Qualité de la communication"
    )
    quality = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Qualité du travail"
    )
    timeliness = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Respect des délais"
    )
    professionalism = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Professionnalisme"
    )
    
    # Written feedback
    comment = models.TextField(blank=True, help_text="Commentaire détaillé")
    
    # Recommendations
    would_recommend = models.BooleanField(default=True)
    would_work_again = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=True, help_text="Visible publiquement")
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ('rater', 'rated_user', 'project')  # Une seule évaluation par projet par utilisateur
    
    def __str__(self):
        return f"{self.rater.full_name} → {self.rated_user.full_name} ({self.score}★)"
    
    @property
    def average_criteria_score(self):
        return (self.communication + self.quality + self.timeliness + self.professionalism) / 4
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update the rated user's average rating
        self.update_user_rating_average()
    
    def update_user_rating_average(self):
        from django.db.models import Avg
        avg_rating = Rating.objects.filter(rated_user=self.rated_user).aggregate(
            avg_score=Avg('score')
        )['avg_score']
        
        if avg_rating:
            self.rated_user.rating_average = round(avg_rating, 2)
            self.rated_user.save(update_fields=['rating_average'])


class RatingResponse(models.Model):
    """Response from the rated user to a rating"""
    rating = models.OneToOneField(Rating, on_delete=models.CASCADE, related_name='response')
    response_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Response to rating by {self.rating.rated_user.full_name}"
