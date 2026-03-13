# Backend - Sistema de Tutorías

Este proyecto corresponde al backend del sistema de tutorías.  
El backend se encarga de gestionar la información del sistema y exponer servicios web que permiten realizar operaciones sobre los datos.

## Tecnologías utilizadas

- Python
- Django
- Django REST Framework
- PostgreSQL

## Configuración del proyecto

### 1. Clonar el repositorio

```sh
git clone URL_DEL_REPOSITORIO
```

### 2. Entrar a la carpeta del proyecto

```sh
cd tuto_backend
```

### 3. Crear entorno virtual

```sh
python -m venv venv
```

### 4. Activar entorno virtual

Windows:
```sh
venv\Scripts\activate
```

### 5. Instalar dependencias
```sh
pip install django  
pip install djangorestframework  
pip install psycopg2
```

### 6. Configurar base de datos

En el archivo settings.py configurar la base de datos PostgreSQL:
```sh
DATABASES = {
 'default': {
  'ENGINE': 'django.db.backends.postgresql',
  'NAME': 'tutorias_db',
  'USER': 'postgres',
  'PASSWORD': '1234',
  'HOST': 'localhost',
  'PORT': '5432',
 }
}
```

### 7. Crear migraciones

```sh
python manage.py makemigrations
```

### 8. Aplicar migraciones

```sh
python manage.py migrate
```

### 9. Crear usuario administrador

```sh
python manage.py createsuperuser
```

### 10. Ejecutar el servidor

```sh
python manage.py runserver
```

## Acceso al sistema

Servidor backend:

http://127.0.0.1:8000/

Panel de administración:

http://127.0.0.1:8000/admin

