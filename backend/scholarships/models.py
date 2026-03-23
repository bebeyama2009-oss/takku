from django.db import models
from careers.models import Career
from universities.models import Country

class Scholarship(models.Model):
    LEVEL_CHOICES = [
        ('LICENSE', 'Licence'),
        ('MASTER', 'Master'),
        ('DOCTORAT', 'Doctorat'),
    ]
    
    name = models.CharField(max_length=255)
    provider = models.CharField(max_length=255)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='scholarships')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    fields = models.ManyToManyField(Career, related_name='scholarships')
    
    coverage_percent = models.IntegerField(default=100)
    amount = models.IntegerField(null=True, blank=True)
    covers_tuition = models.BooleanField(default=True)
    covers_living = models.BooleanField(default=False)
    
    min_gpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    age_limit = models.IntegerField(null=True, blank=True)
    nationality_requirements = models.JSONField(default=list)
    financial_need_required = models.BooleanField(default=False)
    
    deadline = models.DateField()
    application_link = models.URLField()
    required_documents = models.JSONField(default=list)
    selection_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.provider})"
