from django.db import models

class Career(models.Model):
    CATEGORY_CHOICES = [
        ('SANTE', 'Santé'),
        ('TECH', 'Technologie'),
        ('COMMERCE', 'Commerce & Gestion'),
        ('DROIT', 'Droit & Science Politique'),
        ('ENSEIGNEMENT', 'Enseignement'),
        ('ARTS', 'Arts & Design'),
        ('INGENIERIE', 'Ingénierie'),
        ('AUTRE', 'Autre'),
    ]
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    required_education = models.CharField(max_length=255)
    salary_entry = models.IntegerField(help_text="Salaire débutant estimé au Sénégal (FCFA/mois)")
    salary_5years = models.IntegerField(help_text="Salaire après 5 ans estimé (FCFA/mois)")
    skills = models.JSONField(default=list)
    market_demand = models.IntegerField(default=3, help_text="Demande du marché (1-5)")
    
    def __str__(self):
        return self.name

class CareerPath(models.Model):
    LEVEL_CHOICES = [
        ('BAC', 'Baccalauréat'),
        ('LICENSE', 'Licence (Bac+3)'),
        ('MASTER', 'Master (Bac+5)'),
        ('DOCTORAT', 'Doctorat (Bac+8+)'),
    ]
    
    career = models.ForeignKey(Career, on_delete=models.CASCADE, related_name='paths')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    degree_name = models.CharField(max_length=255)
    duration_years = models.IntegerField()
    description = models.TextField()
    available_senegal = models.BooleanField(default=True)
    available_countries = models.JSONField(default=list) # Liste des pays recommandés
    requirements = models.JSONField(default=dict)
    
    class Meta:
        ordering = ['level'] # This might need a custom mapping for logical order

    def __str__(self):
        return f"{self.career.name} - {self.get_level_display()}"
