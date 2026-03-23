from rest_framework import viewsets, permissions
from .models import Scholarship
from .serializers import ScholarshipSerializer

class ScholarshipViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    filterset_fields = ['level', 'country']

    def get_queryset(self):
        queryset = Scholarship.objects.all()
        # Optional: add eligibility filtering here
        return queryset
