from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Tutor, Materia, Tutoria
from .serializers import (
    TutorSerializer, TutorListSerializer, MateriaSerializer,
    TutoriaSerializer, UserSerializer
)


class MateriaViewSet(viewsets.ModelViewSet):
    queryset = Materia.objects.all()
    serializer_class = MateriaSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['nombre', 'creado_en']
    ordering = ['nombre']
    
    @action(detail=True, methods=['get'])
    def tutorias(self, request, pk=None):
        """Obtener todas las tutorías de una materia"""
        materia = self.get_object()
        tutorias = materia.tutorias.all()
        serializer = TutoriaSerializer(tutorias, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def tutores(self, request, pk=None):
        """Obtener todos los tutores de una materia"""
        materia = self.get_object()
        tutores = materia.tutores.filter(disponible=True)
        serializer = TutorListSerializer(tutores, many=True)
        return Response(serializer.data)


class TutorViewSet(viewsets.ModelViewSet):
    queryset = Tutor.objects.select_related('usuario').prefetch_related('materias')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['nivel_experiencia', 'disponible']
    search_fields = ['usuario__username', 'usuario__first_name', 'usuario__last_name', 'especialidad']
    ordering_fields = ['calificacion', 'tarifa_por_hora', 'creado_en']
    ordering = ['-calificacion']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TutorListSerializer
        return TutorSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mi_perfil(self, request):
        """Obtener el perfil de tutor del usuario autenticado"""
        try:
            tutor = Tutor.objects.get(usuario=request.user)
            serializer = self.get_serializer(tutor)
            return Response(serializer.data)
        except Tutor.DoesNotExist:
            return Response(
                {'error': 'No tienes un perfil de tutor'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def tutorias(self, request, pk=None):
        """Obtener todas las tutorías de un tutor"""
        tutor = self.get_object()
        tutorias = tutor.tutorias.all()
        estado = request.query_params.get('estado')
        
        if estado:
            tutorias = tutorias.filter(estado=estado)
        
        serializer = TutoriaSerializer(tutorias, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def estadisticas(self, request, pk=None):
        """Obtener estadísticas de un tutor"""
        tutor = self.get_object()
        tutorias_totales = tutor.tutorias.count()
        tutorias_completadas = tutor.tutorias.filter(estado='completada').count()
        tutorias_pendientes = tutor.tutorias.filter(estado='pendiente').count()
        
        return Response({
            'tutorias_totales': tutorias_totales,
            'tutorias_completadas': tutorias_completadas,
            'tutorias_pendientes': tutorias_pendientes,
            'calificacion_promedio': tutor.calificacion,
            'tarifa_por_hora': str(tutor.tarifa_por_hora),
            'materias': tutor.materias.count(),
        })
    
    @action(detail=True, methods=['post'])
    def marcar_disponible(self, request, pk=None):
        """Marcar tutor como disponible"""
        tutor = self.get_object()
        tutor.disponible = True
        tutor.save()
        return Response({'status': 'Tutor marcado como disponible'})
    
    @action(detail=True, methods=['post'])
    def marcar_no_disponible(self, request, pk=None):
        """Marcar tutor como no disponible"""
        tutor = self.get_object()
        tutor.disponible = False
        tutor.save()
        return Response({'status': 'Tutor marcado como no disponible'})


class TutoriaViewSet(viewsets.ModelViewSet):
    queryset = Tutoria.objects.select_related('tutor', 'estudiante', 'materia').all()
    serializer_class = TutoriaSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'tutor', 'estudiante', 'materia']
    search_fields = ['estudiante__username', 'tutor__usuario__username', 'materia__nombre']
    ordering_fields = ['fecha_inicio', 'creado_en', 'estado']
    ordering = ['-fecha_inicio']
    
    def perform_create(self, serializer):
        """Al crear una tutoría, calcular la tarifa"""
        tutoria = serializer.save()
        if not tutoria.tarifa and tutoria.tutor.tarifa_por_hora:
            duracion_horas = tutoria.duracion_minutos / 60
            tutoria.tarifa = tutoria.tutor.tarifa_por_hora * duracion_horas
            tutoria.save()
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mis_tutorias(self, request):
        """Obtener las tutorías del usuario actual"""
        tutorias = Tutoria.objects.filter(estudiante=request.user)
        estado = request.query_params.get('estado')
        
        if estado:
            tutorias = tutorias.filter(estado=estado)
        
        serializer = self.get_serializer(tutorias, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        """Confirmar una tutoría"""
        tutoria = self.get_object()
        if tutoria.estado != 'pendiente':
            return Response(
                {'error': 'Solo se pueden confirmar tutorías pendientes'},
                status=status.HTTP_400_BAD_REQUEST
            )
        tutoria.estado = 'confirmada'
        tutoria.save()
        serializer = self.get_serializer(tutoria)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def iniciar(self, request, pk=None):
        """Iniciar una tutoría"""
        tutoria = self.get_object()
        if tutoria.estado not in ['pendiente', 'confirmada']:
            return Response(
                {'error': 'La tutoría no puede ser iniciada en este estado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        tutoria.estado = 'en_progreso'
        tutoria.save()
        serializer = self.get_serializer(tutoria)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def completar(self, request, pk=None):
        """Completar una tutoría"""
        tutoria = self.get_object()
        if tutoria.estado != 'en_progreso':
            return Response(
                {'error': 'Solo se pueden completar tutorías en progreso'},
                status=status.HTTP_400_BAD_REQUEST
            )
        tutoria.estado = 'completada'
        tutoria.nota = request.data.get('nota', '')
        tutoria.save()
        serializer = self.get_serializer(tutoria)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        """Cancelar una tutoría"""
        tutoria = self.get_object()
        if tutoria.estado not in ['pendiente', 'confirmada']:
            return Response(
                {'error': 'La tutoría no puede ser cancelada en este estado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        tutoria.estado = 'cancelada'
        tutoria.save()
        serializer = self.get_serializer(tutoria)
        return Response(serializer.data)