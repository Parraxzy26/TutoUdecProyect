"""
Serializers DRF: validación, representación JSON y extensiones JWT (login con email).

Ver vistas en views.py para reglas de negocio que dependen de estos datos.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from .models import Tutor, Materia, Tutoria


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Login JWT que incluye datos del usuario para el cliente (web/móvil)."""

    def validate(self, attrs):
        # Permitir iniciar sesión con correo (el cliente sigue enviando la clave "username").
        identifier = attrs.get('username') or attrs.get('email')
        if identifier and '@' in str(identifier):
            try:
                # Decisión técnica: normalizar login por correo hacia username
                # para compatibilidad con JWT serializer estándar.
                u = User.objects.get(email__iexact=str(identifier).strip())
                attrs['username'] = u.username
            except User.DoesNotExist:
                # Se deja fallar en validate() del padre para mantener mensaje consistente.
                pass
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class MateriaSerializer(serializers.ModelSerializer):
    total_tutorias = serializers.SerializerMethodField()
    
    class Meta:
        model = Materia
        fields = ['id', 'nombre', 'descripcion', 'creado_en', 'total_tutorias']
        read_only_fields = ['id', 'creado_en']
    
    def get_total_tutorias(self, obj):
        return obj.tutorias.count()


class TutorSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='usuario',
        write_only=True
    )
    materias = MateriaSerializer(many=True, read_only=True)
    materias_ids = serializers.PrimaryKeyRelatedField(
        queryset=Materia.objects.all(),
        many=True,
        source='materias',
        write_only=True
    )
    total_tutorias = serializers.SerializerMethodField()
    promedio_calificacion = serializers.ReadOnlyField(source='calificacion')
    
    class Meta:
        model = Tutor
        fields = [
            'id', 'usuario', 'usuario_id', 'especialidad', 'nivel_experiencia',
            'bio', 'tarifa_por_hora', 'calificacion', 'foto', 'teléfono',
            'disponible', 'materias', 'materias_ids', 'total_tutorias',
            'promedio_calificacion', 'creado_en', 'actualizado_en'
        ]
        read_only_fields = ['id', 'creado_en', 'actualizado_en']
    
    def get_total_tutorias(self, obj):
        return obj.tutorias.count()


class TutoriaSerializer(serializers.ModelSerializer):
    # Campos denormalizados para UI: evitan llamadas adicionales por nombres legibles.
    tutor_nombre = serializers.CharField(source='tutor.usuario.get_full_name', read_only=True)
    estudiante_nombre = serializers.CharField(source='estudiante.get_full_name', read_only=True)
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)
    
    class Meta:
        model = Tutoria
        fields = [
            'id', 'tutor', 'tutor_nombre', 'estudiante', 'estudiante_nombre',
            'materia', 'materia_nombre', 'fecha_inicio', 'fecha_fin',
            'duracion_minutos', 'estado', 'descripcion', 'lugar', 'tarifa',
            'nota', 'creado_en', 'actualizado_en'
        ]
        read_only_fields = ['id', 'duracion_minutos', 'creado_en', 'actualizado_en']


class TutorListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar tutores"""
    usuario_nombre = serializers.CharField(source='usuario.get_full_name', read_only=True)
    total_tutorias = serializers.SerializerMethodField()
    
    class Meta:
        model = Tutor
        fields = [
            'id', 'usuario_nombre', 'especialidad', 'nivel_experiencia',
            'tarifa_por_hora', 'calificacion', 'disponible', 'total_tutorias'
        ]
    
    def get_total_tutorias(self, obj):
        return obj.tutorias.filter(estado='completada').count()



class RegisterSerializer(serializers.ModelSerializer):
    """Serializer para registro de usuarios"""
    password = serializers.CharField(write_only=True, required=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'password_confirm']
    
    def validate(self, attrs):
        # Validación crítica de seguridad/usabilidad en registro.
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user
