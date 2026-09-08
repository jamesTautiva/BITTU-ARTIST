BITTU - Artist Portal
Plataforma web independiente y de alto rendimiento diseñada específicamente para artistas, agrupaciones musicales y creadores de contenido del ecosistema BITTU.
Este portal proporciona un entorno de trabajo unificado donde los artistas pueden gestionar sus perfiles públicos, cargar y estructurar lanzamientos discográficos, audicionar métricas de reproducción en tiempo real y controlar sus derechos y distribución multimedia de manera autónoma.

Tabla de Contenidos
Descripción General y Propósito
Arquitectura del Frontend
Estructura del Proyecto
Funcionalidades Principales del Portal
Flujos de Trabajo del Artista
Integración con BITTU Ecosystem API
Stack Tecnológico
Instalación y Configuración
Variables de Entorno
Despliegue y Optimización

Descripción General y Propósito
BITTU Artist Portal soluciona la necesidad de autogestión para los creadores de contenido dentro de la red BITTU. En lugar de depender de intermediarios o procesos manuales, el portal ofrece herramientas avanzadas para la gestión directa de catálogos musicales y la consulta de analíticas.
Diseñado con un enfoque primordial en la experiencia de usuario (UX/UI), el portal combina una interfaz moderna con una comunicación fluida y segura hacia el backend (BITTU Ecosystem API), garantizando que las actualizaciones de perfil y las cargas de contenido se reflejen instantáneamente en las aplicaciones de streaming.

Arquitectura del Frontend
La aplicación sigue los principios de una Single Page Application (SPA) escalable, construida modularmente sobre React con empaquetamiento rápido mediante Vite:
Gestión de Estado Centralizada: Control global de la sesión del artista, estado de subida de archivos y temas visuales mediante Context API / Redux.
Capa de Servicios y Cliente HTTP: Abstracción completa de las llamadas a la API con interceptores para renovación automática de credenciales JWT.
Diseño Responsivo e Inmersivo: Layout adaptable optimizado para pantallas de escritorio, tablets y dispositivos móviles.
Manejo de Formularios Avanzados: Validaciones síncronas/asíncronas en el cliente para metadatos musicales, formatos de archivo e imágenes de portada.

Estructura del Proyecto
bittu-artist/
├── public/                 # Archivos estáticos, favicons y manifest
├── src/
│   ├── assets/             # Recursos gráficos, estilos globales e iconos vectoriales
│   ├── components/         # Componentes reutilizables (Player preview, Modales, Uploader, Cards)
│   ├── context/            # Proveedores de estado (AuthContext, ArtistContext, UIContext)
│   ├── hooks/              # Custom hooks para peticiones, reproducción de audio y validaciones
│   ├── layouts/            # Estructura de navegación para usuarios autenticados y visitantes
│   ├── pages/              # Vistas principales del portal (Dashboard, Catalog, Analytics, Profile)
│   ├── services/           # Módulos de conexión con BITTU Ecosystem API
│   ├── utils/              # Formateadores de audio, conversor de fechas y constantes
│   ├── App.jsx             # Enrutamiento principal y capas de protección
│   └── main.jsx            # Punto de entrada de la aplicación React
├── .env.example            # Plantilla de variables de entorno
├── package.json            # Scripts de compilación y dependencias del proyecto
└── vite.config.js          # Configuración de empaquetado y alias de rutas



Funcionalidades Principales del Portal
1. Panel Principal del Artista (Artist Dashboard)
Resumen de Rendimiento: Vista general de reproducciones totales, oyentes mensuales, canciones más escuchadas y rendimiento de lanzamientos recientes.
Estado de Verificación: Indicador de estado del perfil del artista en la red BITTU.
Feed de Novedades y Notificaciones: Alertas de aprobaciones de lanzamientos, métricas destacadas e hitos alcanzados.
2. Gestión de Perfil e Identidad Visual (Profile Management)
Personalización de Perfil: Edición de biografía, nombre artístico, foto de perfil (avatar) y banner de cabecera.
Redes Sociales y Plataformas Externas: Vinculación directa con perfiles de Spotify, Instagram, YouTube, Apple Music y sitios web oficiales.
Integrantes y Créditos: Administración de información sobre los miembros de la banda o proyecto musical.
3. Centro de Carga y Gestión de Lanzamientos (Release Manager)
Carga de Audio en Alta Fidelidad: Subida de pistas de audio en formatos comprimidos y no comprimidos (WAV, FLAC, MP3).
Gestión de Metadatos Discográficos: Configuración de títulos, nombres de versión (Remix, Instrumental, Explicit), código ISRC, género principal y subgéneros.
Portadas y Material Gráfico: Carga de portadas de álbumes con validación automática de dimensiones y resolución mínima.
Pre-escucha Local: Reproductor de audio integrado para verificar la calidad y mezcla de las pistas antes del envío final.
4. Analítica Avanzada y Métricas de Audiencia (Analytics & Insights)
Estadísticas de Reproducción: Gráficos interactivos por período (diario, semanal, mensual, histórico).
Demografía de Oyentes: Desglose geográfico de escuchas y distribución por plataformas clientes (Web vs App Móvil).
Consumo de Catálogo: Métricas individuales por canción, álbum o EP para identificar las canciones con mejor rendimiento.
5. Control de Estado de Distribución
Seguimiento de Estado: Visualización del flujo de aprobación de cada lanzamiento (Borrador, En Revisión, Publicado, Rechazado).
Historial de Revisiones: Registro de modificaciones y observaciones realizadas por los administradores en el Management Cloud.

Flujos de Trabajo del Artista
Flujo de Creación y Publicación de un Nuevo Lanzamiento
[ Artista ] 
     │
     ▼
1. Selecciona "Nuevo Lanzamiento" (Sencillo / EP / Álbum)
     │
     ▼
2. Completa Metadatos (Título, Fecha de lanzamiento, Género, Créditos)
     │
     ▼
3. Adjunta Portada en Alta Resolución (Validación en cliente)
     │
     ▼
4. Sube Archivos de Audio + Asigna ISRC y estado Explícito
     │
     ▼
5. Pre-escucha en el Reproductor del Portal
     │
     ▼
6. Envío a BITTU Ecosystem API ──► Estado "En Revisión"



Integración con BITTU Ecosystem API
El portal se comunica exclusivamente con la API del ecosistema a través de las siguientes rutas y convenios:
Autenticación: /api/v1/auth/artist-login y /api/v1/auth/refresh-token
Perfil de Artista: /api/v1/artists/me (GET / PUT)
Catálogo: /api/v1/releases/artist (GET / POST / PUT / DELETE)
Carga Multimedia: /api/v1/media/upload (Procesamiento multipart/form-data)
Estadísticas: /api/v1/analytics/artist/metrics

Stack Tecnológico
Core Framework: React.js (v18+)
Build Tool: Vite
Enrutamiento: React Router DOM v6
Cliente HTTP: Axios con manejador global de peticiones e interceptores
Estilos y Maquetación: Tailwind CSS / CSS Modules
Gestión de Estado: React Context API / Redux Toolkit
Componentes de Audio: Web Audio API para pre-escucha

Instalación y Configuración
Requisitos Previos
Node.js: Versión 18.0.0 o superior.
Gestor de paquetes: npm (v9+) o yarn.
Instancia en ejecución de BITTU Ecosystem API.
Pasos de Instalación
Clonar el repositorio:
git clone https://github.com/jamesTautiva/BITU-ARTIST.git
cd BITU-ARTIST
Instalar dependencias:
npm install
Configurar variables de entorno:
cp .env.example .env
Iniciar el servidor de desarrollo:
npm run dev
La aplicación estará disponible en http://localhost:5173.

Variables de Entorno
Variable
Descripción
Ejemplo / Valor por Defecto
 
VITE_API_BASE_URL
Endpoint base de BITTU Ecosystem API
https://api.bittu.com/v1
VITE_APP_ENV
Entorno de ejecución (development, production)
development
VITE_MAX_UPLOAD_SIZE_MB
Tamaño máximo permitido para archivos de audio (MB)
50


Despliegue y Optimización
Para generar una compilación de producción optimizada:
Ejecutar la compilación:
npm run build
Previsualizar la compilación localmente:
npm run preview
Servidores Estáticos / Hosting Cloud: Los archivos resultantes dentro del directorio dist/ pueden desplegarse directamente en infraestructuras CDN como Netlify, Vercel, AWS CloudFront o servidores Nginx/Apache.

