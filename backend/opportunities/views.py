from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Opportunity, OpportunityLike
from .serializers import OpportunitySerializer

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.filter(is_approved=True).order_by('-created_at')
    serializer_class = OpportunitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        opportunity = self.get_object()
        like, created = OpportunityLike.objects.get_or_create(opportunity=opportunity, user=request.user)
        if not created:
            like.delete()
            opportunity.likes_count -= 1
            opportunity.save()
            return Response({'status': 'unliked'})
        opportunity.likes_count += 1
        opportunity.save()
        return Response({'status': 'liked'})
