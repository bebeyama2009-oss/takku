from django.contrib import admin
from .models import Country, University, Program

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'flag_emoji', 'language')

@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'city', 'type', 'is_partner')
    list_filter = ('country', 'type', 'is_partner')
    search_fields = ('name', 'city')

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'university', 'level', 'duration_years')
    list_filter = ('level', 'university__country')
