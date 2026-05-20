from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.utils.crypto import get_random_string
from phonenumber_field.modelfields import PhoneNumberField

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()

    class Meta:
        verbose_name = 'Token de Recuperación'
        verbose_name_plural = 'Tokens de Recuperación'

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = get_random_string(length=64)
        if not self.expires_at:
            from django.utils import timezone
            self.expires_at = timezone.now() + timezone.timedelta(hours=1)
        super().save(*args, **kwargs)

    def is_valid(self):
        from django.utils import timezone
        return not self.used and self.expires_at > timezone.now()

    def __str__(self):
        return f"Token para {self.user.username} - {self.created_at}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = PhoneNumberField(blank=True, null=True, verbose_name='Número de teléfono')
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Perfil de Usuario'
        verbose_name_plural = 'Perfiles de Usuarios'

    def __str__(self):
        return f"Perfil de {self.user.username}"

class Materia(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['nombre']
        verbose_name = 'Materia'
        verbose_name_plural = 'Materias'
    
    def __str__(self):
        return self.nombre


class Tutor(models.Model):
    NIVELES = [
        ('principiante', 'Principiante'),
        ('intermedio', 'Intermedio'),
        ('avanzado', 'Avanzado'),
        ('experto', 'Experto'),
    ]
    
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil_tutor')
    especialidad = models.CharField(max_length=100)
    materias = models.ManyToManyField(Materia, related_name='tutores')
    nivel_experiencia = models.CharField(max_length=20, choices=NIVELES, default='principiante')
    bio = models.TextField(blank=True, null=True)
    tarifa_por_hora = models.DecimalField(max_digits=8, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    calificacion = models.FloatField(default=5.0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    foto = models.URLField(blank=True, null=True)
    teléfono = models.CharField(max_length=15, blank=True, null=True)
    disponible = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-calificacion']
        verbose_name = 'Tutor'
        verbose_name_plural = 'Tutores'
    
    def __str__(self):
        return f"{self.usuario.get_full_name() or self.usuario.username} - {self.especialidad}"


class Tutoria(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('en_progreso', 'En Progreso'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
    ]
    
    tutor = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name='tutorias')
    materia = models.ForeignKey(Materia, on_delete=models.SET_NULL, null=True, blank=True, related_name='tutorias')
    estudiante = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tutorias_recibidas')
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField(blank=True, null=True)
    duracion_minutos = models.IntegerField(validators=[MinValueValidator(15)])
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    descripcion = models.TextField(blank=True, null=True)
    lugar = models.CharField(max_length=200, blank=True, null=True)
    tarifa = models.DecimalField(max_digits=8, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    nota = models.TextField(blank=True, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-fecha_inicio']
        verbose_name = 'Tutoría'
        verbose_name_plural = 'Tutorías'
    
    def __str__(self):
        return f"Tutoría de {self.estudiante.username} con {self.tutor.usuario.username}"
    
    def save(self, *args, **kwargs):
        if self.fecha_fin and self.fecha_inicio:
            duracion = (self.fecha_fin - self.fecha_inicio).total_seconds() / 60
            self.duracion_minutos = int(duracion)
        super().save(*args, **kwargs)


class Disponibilidad(models.Model):
    DIAS_SEMANA = [
        (0, 'Lunes'),
        (1, 'Martes'),
        (2, 'Miércoles'),
        (3, 'Jueves'),
        (4, 'Viernes'),
        (5, 'Sábado'),
        (6, 'Domingo'),
    ]

    tutor = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name='disponibilidades')
    dia_semana = models.IntegerField(choices=DIAS_SEMANA)
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ['dia_semana', 'hora_inicio']
        verbose_name = 'Disponibilidad'
        verbose_name_plural = 'Disponibilidades'

    def __str__(self):
        return f"{self.tutor.usuario.username} - {self.get_dia_semana_display()} {self.hora_inicio}-{self.hora_fin}"


class GrupoTutoria(models.Model):
    """Grupo de tutoría con cupos múltiples para estudiantes"""
    tutor = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name='grupos')
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name='grupos')
    nombre = models.CharField(max_length=100, verbose_name='Nombre del grupo')
    descripcion = models.TextField(blank=True, null=True, verbose_name='Descripción')
    cupos_maximos = models.IntegerField(default=10, validators=[MinValueValidator(1)], verbose_name='Cupos máximos')
    cupos_disponibles = models.IntegerField(default=10, validators=[MinValueValidator(0)], verbose_name='Cupos disponibles')
    fecha_inicio = models.DateTimeField(verbose_name='Fecha y hora de inicio')
    fecha_fin = models.DateTimeField(verbose_name='Fecha y hora de fin')
    duracion_minutos = models.IntegerField(validators=[MinValueValidator(15)], verbose_name='Duración en minutos')
    lugar = models.CharField(max_length=200, blank=True, null=True, verbose_name='Lugar (presencial o link virtual)')
    modalidad = models.CharField(
        max_length=20,
        choices=[('presencial', 'Presencial'), ('virtual', 'Virtual'), ('hibrida', 'Híbrida')],
        default='presencial',
        verbose_name='Modalidad'
    )
    estado = models.CharField(
        max_length=20,
        choices=[('programado', 'Programado'), ('en_curso', 'En curso'), ('completado', 'Completado'), ('cancelado', 'Cancelado')],
        default='programado',
        verbose_name='Estado'
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-fecha_inicio']
        verbose_name = 'Grupo de Tutoría'
        verbose_name_plural = 'Grupos de Tutoría'

    def __str__(self):
        return f"{self.nombre} - {self.materia.nombre} ({self.tutor.usuario.username})"

    def save(self, *args, **kwargs):
        if self.fecha_fin and self.fecha_inicio:
            duracion = (self.fecha_fin - self.fecha_inicio).total_seconds() / 60
            self.duracion_minutos = int(duracion)
        super().save(*args, **kwargs)

    @property
    def esta_lleno(self):
        return self.cupos_disponibles <= 0


class InscripcionGrupo(models.Model):
    """Inscripción de un estudiante en un grupo de tutoría"""
    grupo = models.ForeignKey(GrupoTutoria, on_delete=models.CASCADE, related_name='inscripciones')
    estudiante = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inscripciones_grupos')
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(
        max_length=20,
        choices=[('inscrito', 'Inscrito'), ('cancelado', 'Cancelado'), ('completado', 'Completado')],
        default='inscrito',
        verbose_name='Estado de inscripción'
    )
    asistio = models.BooleanField(default=False, verbose_name='Asistió')

    class Meta:
        unique_together = ('grupo', 'estudiante')
        ordering = ['-fecha_inscripcion']
        verbose_name = 'Inscripción en Grupo'
        verbose_name_plural = 'Inscripciones en Grupos'

    def __str__(self):
        return f"{self.estudiante.username} - {self.grupo.nombre}"


class Resena(models.Model):
    tutor = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name='resenas')
    estudiante = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resenas')
    tutoria = models.ForeignKey(Tutoria, on_delete=models.SET_NULL, null=True, blank=True, related_name='resenas')
    grupo = models.ForeignKey(GrupoTutoria, on_delete=models.SET_NULL, null=True, blank=True, related_name='resenas')
    calificacion = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    comentario = models.TextField(blank=True, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-creado_en']
        verbose_name = 'Reseña'
        verbose_name_plural = 'Reseñas'

    def __str__(self):
        return f"Reseña de {self.estudiante.username} para {self.tutor.usuario.username}"