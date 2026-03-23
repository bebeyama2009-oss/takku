from django.db import models

class Country(models.Model):
    name = models.CharField(max_length=100)
    flag_emoji = models.CharField(max_length=10)
    language = models.CharField(max_length=100)
    currency = models.CharField(max_length=50)
    average_tuition_public = models.IntegerField(null=True)
    average_tuition_private = models.IntegerField(null=True)
    living_cost_monthly = models.IntegerField(null=True)
    visa_required = models.BooleanField(default=True)
    language_test_required = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"{self.flag_emoji} {self.name}"

class University(models.Model):
    TYPE_CHOICES = [
        ('PUBLIC', 'Publique'),
        ('PRIVATE', 'Privée'),
    ]
    
    name = models.CharField(max_length=255)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='universities')
    city = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    is_partner = models.BooleanField(default=False)
    
    tuition_fees_min = models.IntegerField(null=True)
    tuition_fees_max = models.IntegerField(null=True)
    application_fee = models.IntegerField(null=True)
    living_cost_monthly = models.IntegerField(null=True)
    
    academic_year_start = models.DateField(null=True, blank=True)
    application_deadline = models.DateField(null=True, blank=True)
    
    required_documents = models.JSONField(default=list)
    admission_procedure = models.TextField(blank=True)
    
    website = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    
    acceptance_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return self.name

class Program(models.Model):
    LEVEL_CHOICES = [
        ('LICENSE', 'Licence'),
        ('MASTER', 'Master'),
        ('DOCTORAT', 'Doctorat'),
        ('AUTRE', 'Autre'),
    ]
    
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='programs')
    name = models.CharField(max_length=255)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    duration_years = models.IntegerField()
    tuition_fees = models.IntegerField(null=True)
    requirements = models.JSONField(default=dict)
    
    def __str__(self):
        return f"{self.name} - {self.university.name}"
