# TutoUdec - Sistema de Tutorías

Sistema de gestión de tutorías académicas que conecta tutores y estudiantes. Incluye un backend en Django REST Framework, una aplicación móvil en React Native (Expo) y una versión web en Vue.js.

## Estructura del Proyecto

```
├── backend/          # API REST en Django
├── mobile/           # Aplicación móvil en React Native (Expo)
├── web/              # Aplicación web en Vue.js
├── API_DOCUMENTATION.md
└── README.md
```

## Requisitos Previos

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ (para el backend)
- Git

---

## 🚀 Inicio Rápido

### Backend

```powershell
# 1. Entrar a la carpeta
cd backend

# 2. Crear entorno virtual
python -m venv venv

# 3. Activar entorno virtual
# En Windows:
.\venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Configurar base de datos en settings.py
# Editar la sección DATABASES con tus credenciales de PostgreSQL

# 6. Crear migraciones
python manage.py makemigrations

# 7. Aplicar migraciones
python manage.py migrate

# 8. Crear superusuario (opcional)
python manage.py createsuperuser

# 9. Iniciar servidor
python manage.py runserver 0.0.0.0:8000
```

El backend estará disponible en: http://localhost:8000

---

### Aplicación Móvil

```powershell
# 1. Entrar a la carpeta
cd mobile

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Limpiar caché (si hay errores)
npx expo start -c

# 4. Iniciar con LAN (para conectar desde celular en la misma red)
npx expo start --lan
```

> **Nota:** Para conectar desde un dispositivo físico, asegúrate de que tu PC y celular estén en la misma red Wi-Fi.

---

### Aplicación Web

```powershell
# 1. Entrar a la carpeta
cd web

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

---

## 📁 Documentación por Carpeta

- **[backend/README.md](backend/README.md)** - Documentación completa del backend (modelos, vistas, configuración)
- **[backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)** - Referencia completa de endpoints de la API
- **[mobile/README.md](mobile/README.md)** - Documentación de la aplicación móvil (futuro)
- **[web/README.md](web/README.md)** - Documentación de la aplicación web Vue.js

---

## 🔧 Configuración Importante

### Variables de Entorno (Backend)

Crea un archivo `.env` en la carpeta `backend/` con:

```env
SECRET_KEY=tu-clave-secreta-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,tu-ip-local
DATABASE_NAME=tutoudec_db
DATABASE_USER=postgres
DATABASE_PASSWORD=tu-contraseña
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

### IP del Servidor (Móvil)

Si necesitas cambiar la IP del backend en la app móvil, edita:
```
mobile/src/config.js
```
Cambia el valor de `DEFAULT_LAN_HOST` por tu IP local.

---

## 📡 Endpoints Principales de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Iniciar sesión |
| POST | `/api/auth/register/` | Registrarse |
| GET | `/api/tutores/` | Listar tutores |
| GET | `/api/materias/` | Listar materias |
| POST | `/api/tutorias/` | Crear tutoría |
| GET | `/api/tutorias/mis_tutorias/` | Mis tutorías |

Documentación interactiva disponible en: http://localhost:8000/swagger/

---

## 👥 Roles de Usuario

- **Estudiante**: Puede buscar tutores, agendar tutorías y dejar reseñas
- **Tutor**: Además de lo anterior, puede gestionar su disponibilidad
- **Administrador**: Acceso total a todas las funcionalidades

---

## 📝 Notas de Desarrollo

- El proyecto usa **JWT** para autenticación
- El backend corre en `0.0.0.0:8000` para permitir conexiones desde otros dispositivos
- La app móvil requiere **Expo SDK 54** y **React 19.1.0**
- Para producción, cambiar `DEBUG=False` y usar HTTPS
