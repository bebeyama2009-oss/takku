from django.db import models
from django.conf import settings

class OrientationQuestion(models.Model):
    SECTION_CHOICES = [
        ('ACADEMIC', 'Académique'),
        ('INTERESTS', 'Centres d\'intérêt'),
        ('ASPIRATIONS', 'Aspirations professionnelles'),
    ]
    
    TYPE_CHOICES = [
        ('SINGLE', 'Choix unique'),
        ('MULTIPLE', 'Choix multiple'),
        ('SCALE', 'Échelle (1-5)'),
    ]
    
    section = models.CharField(max_length=20, choices=SECTION_CHOICES)
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    options = models.JSONField(default=list) # Liste d'options si applicable
    order = models.IntegerField(default=0)
    weight = models.FloatField(default=1.0)
    category_mapping = models.JSONField(default=dict) # Mapping option -> category score
    
    def __str__(self):
        return f"{self.section} - {self.question_text[:50]}..."

class OrientationTest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tests')
    test_date = models.DateTimeField(auto_now_add=True)
    answers = models.JSONField(default=dict)
    recommended_careers = models.JSONField(default=list)
    compatibility_scores = models.JSONField(default=dict)
    completed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Test for {self.user.username} - {self.test_date}"
