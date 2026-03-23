from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CareerViewSet, CareerPathViewSet

router = DefaultRouter()
router.register(r'careers', CareerViewSet, basename='career')
router.register(r'paths', CareerPathViewSet, basename='path')

urlpatterns = [
    path('', include(router.urls)),
]
