from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FavoriteViewSet, CalendarEventViewSet

router = DefaultRouter()
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'calendar', CalendarEventViewSet, basename='calendar')

urlpatterns = [
    path('', include(router.urls)),
]
