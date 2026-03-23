from rest_framework import serializers
from .models import Career, CareerPath

class CareerPathSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerPath
        fields = '__all__'

class CareerSerializer(serializers.ModelSerializer):
    paths = CareerPathSerializer(many=True, read_only=True)
    
    class Meta:
        model = Career
        fields = '__all__'
