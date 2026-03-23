from rest_framework import serializers
from .models import Country, University, Program

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = '__all__'

class UniversitySerializer(serializers.ModelSerializer):
    programs = ProgramSerializer(many=True, read_only=True)
    country_name = serializers.CharField(source='country.name', read_only=True)
    country_flag = serializers.CharField(source='country.flag_emoji', read_only=True)
    
    class Meta:
        model = University
        fields = '__all__'

class CountrySerializer(serializers.ModelSerializer):
    universities = UniversitySerializer(many=True, read_only=True)
    
    class Meta:
        model = Country
        fields = '__all__'
