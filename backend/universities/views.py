from rest_framework import viewsets, permissions
from .models import Country, University, Program
from .serializers import CountrySerializer, UniversitySerializer, ProgramSerializer

class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

class UniversityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    filterset_fields = ['country', 'type', 'is_partner']

class ProgramViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    filterset_fields = ['university', 'level']
