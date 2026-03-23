from django.contrib import admin
from .models import Career, CareerPath

@admin.register(Career)
class CareerAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'market_demand')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'category')

@admin.register(CareerPath)
class CareerPathAdmin(admin.ModelAdmin):
    list_display = ('career', 'level', 'degree_name', 'duration_years')
    list_filter = ('level', 'available_senegal')
