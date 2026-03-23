from django.contrib import admin
from .models import Favorite, CalendarEvent

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'content_type', 'object_id', 'created_at')

@admin.register(CalendarEvent)
class CalendarEventAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'event_date', 'deadline_date', 'event_type', 'is_completed')
    list_filter = ('event_type', 'is_completed')
