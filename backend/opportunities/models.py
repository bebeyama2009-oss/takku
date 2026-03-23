from django.db import models
from django.conf import settings

class Opportunity(models.Model):
    TYPE_CHOICES = [
        ('CONCOURS', 'Concours'),
        ('EVENT', 'Événement'),
        ('STAGE', 'Stage'),
        ('PROGRAM', 'Programme'),
        ('FORMATION', 'Formation'),
        ('COMPETITION', 'Compétition'),
    ]
    
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    category = models.CharField(max_length=100) # Tech, Santé, Arts...
    organizer = models.CharField(max_length=255)
    
    description = models.TextField()
    target_audience = models.JSONField(default=list) # Niveaux concernés
    
    deadline = models.DateField(null=True, blank=True)
    event_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    is_online = models.BooleanField(default=False)
    
    prize = models.CharField(max_length=255, blank=True)
    link = models.URLField(blank=True)
    
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='opportunities')
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    
    likes_count = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title

class OpportunityLike(models.Model):
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('opportunity', 'user')
