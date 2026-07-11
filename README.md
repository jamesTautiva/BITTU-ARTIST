# BITU ARTIST

Plataforma para artistas musicales construida con React, Vite y TailwindCSS.

## 🚀 Características

- **Dashboard**: Estadísticas en tiempo real de tu música
- **Portafolio**: Gestiona tus álbumes y sencillos
- **Música**: Sube y organiza tus canciones
- **Análisis**: Métricas detalladas de rendimiento
- **Perfil**: Personaliza tu información de artista
- **Configuración**: Ajusta preferencias y privacidad

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, Vite 8
- **Estilos**: TailwindCSS 4
- **Estado**: Zustand
- **Rutas**: React Router DOM
- **Iconos**: Lucide React
- **Backend**: Conexión con BITU-API

## 📋 Requisitos

- Node.js 18+
- BITU-API corriendo en `http://localhost:3000`

## 🚀 Instalación

1. Clona el repositorio
2. Instala dependencias:
   ```bash
   npm install
   ```

3. Configura variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📁 Estructura del Proyecto

```
src/
├── app/                 # Configuración principal
│   ├── router.jsx      # Rutas de la aplicación
│   └── store.js        # Estado global (Zustand)
├── components/         # Componentes reutilizables
│   ├── layouts/        # Layouts principales
│   └── ui/            # Componentes UI
├── features/          # Funcionalidades por dominio
│   ├── auth/          # Autenticación
│   ├── dashboard/     # Dashboard principal
│   ├── portfolio/     # Gestión de portafolio
│   ├── music/         # Gestión de música
│   ├── analytics/     # Análisis y estadísticas
│   ├── profile/       # Perfil de artista
│   └── settings/      # Configuración
├── services/          # Servicios API
└── utils/            # Utilidades
```

## 🔗 Conexión con BITU-API

La aplicación se conecta automáticamente con BITU-API para:

- Autenticación de usuarios
- Gestión de artistas y canciones
- Análisis y estadísticas
- Gestión de álbumes

## 🎨 Temas

La aplicación soporta modo claro y oscuro, accesible desde:

- Botón en el navbar
- Configuración > Apariencia

## 📱 Responsive

BITU ARTIST está optimizado para:

- Desktop (1920px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🚀 Despliegue

1. Construye para producción:
   ```bash
   npm run build
   ```

2. Previsualiza el build:
   ```bash
   npm run preview
   ```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature
3. Realiza tus cambios
4. Envía un pull request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles
