from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Career, CareerPath
from .serializers import CareerSerializer, CareerPathSerializer

class CareerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Career.objects.all()
    serializer_class = CareerSerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def path(self, request, slug=None):
        career = self.get_object()
        paths = career.paths.all()
        serializer = CareerPathSerializer(paths, many=True)
        return Response(serializer.data)

class CareerPathViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CareerPath.objects.all()
    serializer_class = CareerPathSerializer
