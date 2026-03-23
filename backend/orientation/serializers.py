from rest_framework import serializers
from .models import OrientationQuestion, OrientationTest

class OrientationQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrientationQuestion
        fields = '__all__'

class OrientationTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrientationTest
        fields = '__all__'
        read_only_fields = ('user', 'test_date', 'recommended_careers', 'compatibility_scores', 'completed')
