from rest_framework import serializers
from .models import Favorite, CalendarEvent
from django.contrib.contenttypes.models import ContentType

class FavoriteSerializer(serializers.ModelSerializer):
    content_object_detail = serializers.SerializerMethodField()
    
    class Meta:
        model = Favorite
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

    def get_content_object_detail(self, obj):
        # This would ideally return a serialized version of the target object
        # for simplicity in MVP, we can just return the string representation or basic info
        return str(obj.content_object)

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = '__all__'
        read_only_fields = ('user',)
