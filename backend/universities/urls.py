from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CountryViewSet, UniversityViewSet, ProgramViewSet

router = DefaultRouter()
router.register(r'countries', CountryViewSet, basename='country')
router.register(r'universities', UniversityViewSet, basename='university')
router.register(r'programs', ProgramViewSet, basename='program')

urlpatterns = [
    path('', include(router.urls)),
]
