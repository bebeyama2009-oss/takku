from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'content_type', 'object_id')

class CalendarEvent(models.Model):
    TYPE_CHOICES = [
        ('INSCRIPTION', 'Inscription Université'),
        ('BOURSE', 'Bourse d\'études'),
        ('OPPORTUNITY', 'Opportunité communautaire'),
        ('EXAM', 'Examen/Concours'),
        ('OTHER', 'Autre'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='calendar_events')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    event_date = models.DateField(null=True, blank=True)
    deadline_date = models.DateField(null=True, blank=True)
    event_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    
    # Optional link to a specific object
    related_content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True)
    related_object_id = models.PositiveIntegerField(null=True, blank=True)
    related_object = GenericForeignKey('related_content_type', 'related_object_id')
    
    is_completed = models.BooleanField(default=False)
    reminder_sent = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title
