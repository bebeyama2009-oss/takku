from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrientationQuestionViewSet, OrientationTestViewSet

router = DefaultRouter()
router.register(r'questions', OrientationQuestionViewSet, basename='question')
router.register(r'tests', OrientationTestViewSet, basename='test')

urlpatterns = [
    path('', include(router.urls)),
]
