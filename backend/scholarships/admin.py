from django.contrib import admin
from .models import Scholarship

@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ('name', 'provider', 'country', 'level', 'deadline')
    list_filter = ('level', 'country')
    search_fields = ('name', 'provider')
