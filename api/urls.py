# Rutas de la API REST.
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TutorViewSet, MateriaViewSet, TutoriaViewSet

router = DefaultRouter()
router.register(r'tutores', TutorViewSet)
router.register(r'materias', MateriaViewSet)
router.register(r'tutorias', TutoriaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
