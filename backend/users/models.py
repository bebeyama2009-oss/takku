from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('STUDENT', 'Étudiant'),
        ('TEACHER', 'Enseignant'),
        ('UNIVERSITY', 'Université'),
        ('ADMIN', 'Administrateur'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')
    phone = models.CharField(max_length=20, blank=True, null=True)
    school = models.CharField(max_length=255, blank=True, null=True)
    grade = models.CharField(max_length=50, blank=True, null=True) # Seconde, Première, Terminale
    series = models.CharField(max_length=20, blank=True, null=True) # S, L, G
    interests = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
