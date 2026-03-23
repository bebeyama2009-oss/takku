from rest_framework import serializers
from .models import Scholarship
from careers.serializers import CareerSerializer

class ScholarshipSerializer(serializers.ModelSerializer):
    fields_detail = CareerSerializer(source='fields', many=True, read_only=True)
    country_name = serializers.CharField(source='country.name', read_only=True)
    
    class Meta:
        model = Scholarship
        fields = '__all__'
