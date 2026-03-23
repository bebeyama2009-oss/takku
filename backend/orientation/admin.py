from django.contrib import admin
from .models import OrientationQuestion, OrientationTest

@admin.register(OrientationQuestion)
class OrientationQuestionAdmin(admin.ModelAdmin):
    list_display = ('section', 'question_text', 'question_type', 'order')
    list_filter = ('section', 'question_type')
    ordering = ('order',)

@admin.register(OrientationTest)
class OrientationTestAdmin(admin.ModelAdmin):
    list_display = ('user', 'test_date', 'completed')
    list_filter = ('completed',)
