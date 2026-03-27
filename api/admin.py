"""
Registro en Django Admin para operación y soporte (no es la API pública).
"""
from django.contrib import admin
from .models import Tutor, Materia, Tutoria


@admin.register(Materia)
class MateriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'creado_en')
    search_fields = ('nombre',)
    list_filter = ('creado_en',)


@admin.register(Tutor)
class TutorAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'especialidad', 'nivel_experiencia', 'calificacion', 'tarifa_por_hora', 'disponible')
    list_filter = ('nivel_experiencia', 'disponible', 'calificacion')
    search_fields = ('usuario__username', 'usuario__first_name', 'usuario__last_name', 'especialidad')
    filter_horizontal = ('materias',)
    readonly_fields = ('creado_en', 'actualizado_en')
    fieldsets = (
        ('Información del Usuario', {
            'fields': ('usuario', 'foto', 'teléfono')
        }),
        ('Experiencia', {
            'fields': ('especialidad', 'nivel_experiencia', 'bio', 'materias')
        }),
        ('Detalles', {
            'fields': ('tarifa_por_hora', 'calificacion', 'disponible')
        }),
        ('Fechas', {
            'fields': ('creado_en', 'actualizado_en'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Tutoria)
class TutoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'estudiante', 'tutor', 'materia', 'estado', 'fecha_inicio', 'duracion_minutos', 'tarifa')
    list_filter = ('estado', 'fecha_inicio', 'materia')
    search_fields = ('estudiante__username', 'tutor__usuario__username', 'materia__nombre')
    readonly_fields = ('creado_en', 'actualizado_en', 'duracion_minutos')
    fieldsets = (
        ('Participantes', {
            'fields': ('tutor', 'estudiante', 'materia')
        }),
        ('Horario', {
            'fields': ('fecha_inicio', 'fecha_fin', 'duracion_minutos', 'lugar')
        }),
        ('Detalles', {
            'fields': ('estado', 'descripcion', 'nota', 'tarifa')
        }),
        ('Auditoría', {
            'fields': ('creado_en', 'actualizado_en'),
            'classes': ('collapse',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        # Evita cambiar participantes una vez creada la tutoría (integridad de datos).
        if obj:
            return self.readonly_fields + ('tutor', 'estudiante')
        return self.readonly_fields