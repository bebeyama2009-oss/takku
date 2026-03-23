from django.contrib import admin
from .models import Opportunity, OpportunityLike

@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'category', 'organizer', 'deadline', 'is_approved')
    list_filter = ('type', 'category', 'is_approved')
    search_fields = ('title', 'organizer')

@admin.register(OpportunityLike)
class OpportunityLikeAdmin(admin.ModelAdmin):
    list_display = ('opportunity', 'user', 'created_at')
