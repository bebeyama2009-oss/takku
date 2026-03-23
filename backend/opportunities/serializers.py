from rest_framework import serializers
from .models import Opportunity, OpportunityLike
from users.serializers import UserSerializer

class OpportunitySerializer(serializers.ModelSerializer):
    posted_by_detail = UserSerializer(source='posted_by', read_only=True)
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Opportunity
        fields = '__all__'
        read_only_fields = ('posted_by', 'created_at', 'likes_count', 'is_approved', 'is_verified')

    def get_is_liked(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return OpportunityLike.objects.filter(opportunity=obj, user=user).exists()
        return False
