# Rutas HTTP bajo /api/: router DRF + endpoints JWT personalizados.
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    TutorViewSet, MateriaViewSet, TutoriaViewSet,
    CustomTokenObtainPairView, RegisterView, UserProfileView
)

# Endpoints REST principales del dominio.
router = DefaultRouter()
router.register(r'tutores', TutorViewSet)
router.register(r'materias', MateriaViewSet)
router.register(r'tutorias', TutoriaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Endpoints de autenticación:
    # - login: entrega access/refresh token
    # - refresh: renueva access token
    # - register: registra usuario base
    # - profile: lectura/actualización del perfil autenticado
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
]
