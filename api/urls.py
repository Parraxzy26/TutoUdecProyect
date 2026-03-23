# Rutas de la API REST.
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    TutorViewSet, MateriaViewSet, TutoriaViewSet,
    CustomTokenObtainPairView, RegisterView, UserProfileView
)

router = DefaultRouter()
router.register(r'tutores', TutorViewSet)
router.register(r'materias', MateriaViewSet)
router.register(r'tutorias', TutoriaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Authentication endpoints
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
]
