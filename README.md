# BITTU - Artist Portal

Plataforma web independiente y de alto rendimiento diseñada específicamente para artistas, agrupaciones musicales y creadores de contenido del ecosistema BITTU[cite: 3].

Este portal proporciona un entorno de trabajo unificado donde los artistas pueden gestionar sus perfiles públicos, cargar y estructurar lanzamientos discográficos, audicionar métricas de reproducción en tiempo real y controlar sus derechos y distribución multimedia de manera autónoma[cite: 3].

---

## Tabla de Contenidos

1. [Descripción General y Propósito](#descripción-general-y-propósito)
2. [Arquitectura del Frontend](#arquitectura-del-frontend)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Funcionalidades Principales del Portal](#funcionalidades-principales-del-portal)
5. [Flujos de Trabajo del Artista](#flujos-de-trabajo-del-artista)
6. [Integración con BITTU Ecosystem API](#integración-con-bittu-ecosystem-api)
7. [Stack Tecnológico](#stack-tecnológico)
8. [Instalación y Configuración](#instalación-y-configuración)
9. [Variables de Entorno](#variables-de-entorno)
10. [Despliegue y Optimización](#despliegue-y-optimización)

---

## Descripción General y Propósito

**BITTU Artist Portal** soluciona la necesidad de autogestión para los creadores de contenido dentro de la red BITTU[cite: 3]. En lugar de depender de intermediarios o procesos manuales, el portal ofrece herramientas avanzadas para la gestión directa de catálogos musicales y la consulta de analíticas[cite: 3].

Diseñado con un enfoque primordial en la experiencia de usuario (UX/UI), el portal combina una interfaz moderna con una comunicación fluida y segura hacia el backend (*BITTU Ecosystem API*), garantizando que las actualizaciones de perfil y las cargas de contenido se reflejen instantáneamente en las aplicaciones de streaming[cite: 3].

---

## Arquitectura del Frontend

La aplicación sigue los principios de una **Single Page Application (SPA)** escalable, construida modularmente sobre React con empaquetamiento rápido mediante Vite[cite: 3]:

* **Gestión de Estado Centralizada:** Control global de la sesión del artista, estado de subida de archivos y temas visuales mediante Context API / Redux[cite: 3].
* **Capa de Servicios y Cliente HTTP:** Abstracción completa de las llamadas a la API con interceptores para renovación automática de credenciales JWT[cite: 3].
* **Diseño Responsivo e Inmersivo:** Layout adaptable optimizado para pantallas de escritorio, tablets y dispositivos móviles[cite: 3].
* **Manejo de Formularios Avanzados:** Validaciones síncronas/asíncronas en el cliente para metadatos musicales, formatos de archivo e imágenes de portada[cite: 3].

---

## Estructura del Proyecto

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

Fragmento de código

---

## Funcionalidades Principales del Portal

### 1. Panel Principal del Artista (Artist Dashboard)
* **Resumen de Rendimiento:** Vista general de reproducciones totales, oyentes mensuales, canciones más escuchadas y rendimiento de lanzamientos recientes[cite: 3].
* **Estado de Verificación:** Indicador de estado del perfil del artista en la red BITTU[cite: 3].
* **Feed de Novedades y Notificaciones:** Alertas de aprobaciones de lanzamientos, métricas destacadas e hitos alcanzados[cite: 3].

### 2. Gestión de Perfil e Identidad Visual (Profile Management)
* **Personalización de Perfil:** Edición de biografía, nombre artístico, foto de perfil (avatar) y banner de cabecera[cite: 3].
* **Redes Sociales y Plataformas Externas:** Vinculación directa con perfiles de Spotify, Instagram, YouTube, Apple Music y sitios web oficiales[cite: 3].
* **Integrantes y Créditos:** Administración de información sobre los miembros de la banda o proyecto musical[cite: 3].

### 3. Centro de Carga y Gestión de Lanzamientos (Release Manager)
* **Carga de Audio en Alta Fidelidad:** Subida de pistas de audio en formatos comprimidos y no comprimidos (WAV, FLAC, MP3)[cite: 3].
* **Gestión de Metadatos Discográficos:** Configuración de títulos, nombres de versión (Remix, Instrumental, Explicit), código ISRC, género principal y subgéneros[cite: 3].
* **Portadas y Material Gráfico:** Carga de portadas de álbumes con validación automática de dimensiones y resolución mínima[cite: 3].
* **Pre-escucha Local:** Reproductor de audio integrado para verificar la calidad y mezcla de las pistas antes del envío final[cite: 3].

### 4. Analítica Avanzada y Métricas de Audiencia (Analytics & Insights)
* **Estadísticas de Reproducción:** Gráficos interactivos por período (diario, semanal, mensual, histórico)[cite: 3].
* **Demografía de Oyentes:** Desglose geográfico de escuchas y distribución por plataformas clientes (Web vs App Móvil)[cite: 3].
* **Consumo de Catálogo:** Métricas individuales por canción, álbum o EP para identificar las canciones con mejor rendimiento[cite: 3].

### 5. Control de Estado de Distribución
* **Seguimiento de Estado:** Visualización del flujo de aprobación de cada lanzamiento (*Borrador*, *En Revisión*, *Publicado*, *Rechazado*)[cite: 3].
* **Historial de Revisiones:** Registro de modificaciones y observaciones realizadas por los administradores en el *Management Cloud*[cite: 3].

---

## Flujos de Trabajo del Artista

### Flujo 1: Creación y Publicación de un Nuevo Lanzamiento
[ Artista ]
│
▼

Selecciona "Nuevo Lanzamiento" (Sencillo / EP / Álbum)
│
▼

Completa Metadatos (Título, Fecha de lanzamiento, Género, Créditos)
│
▼

Adjunta Portada en Alta Resolución (Validación en cliente)
│
▼

Sube Archivos de Audio + Asigna ISRC y estado Explícito
│
▼

Pre-escucha en el Reproductor del Portal
│
▼

Envío a BITTU Ecosystem API ──► Estado "En Revisión"

Fragmento de código

### Flujo 2: Actualización de Perfil e Identidad
[ Formulario de Perfil ]
│
▼

Selección / Recorte de Nueva Imagen de Portada / Banner
│
▼

Validación de Formato y Peso (MPEG/PNG/WebP)
│
▼

Subida asíncrona a Cloud Storage vía API
│
▼

Sincronización en Tiempo Real con Perfiles de Streaming Públicos

Fragmento de código

---

## Integración con BITTU Ecosystem API

El portal se comunica exclusivamente con la API del ecosistema a través de las siguientes rutas y convenios[cite: 3]:

* **Autenticación:** `/api/v1/auth/artist-login` y `/api/v1/auth/refresh-token`[cite: 3]
* **Perfil de Artista:** `/api/v1/artists/me` (GET / PUT)[cite: 3]
* **Catálogo:** `/api/v1/releases/artist` (GET / POST / PUT / DELETE)[cite: 3]
* **Carga Multimedia:** `/api/v1/media/upload` (Procesamiento multipart/form-data)[cite: 3]
* **Estadísticas:** `/api/v1/analytics/artist/metrics`[cite: 3]

---

## Stack Tecnológico

* **Core Framework:** React.js (v18+)[cite: 3]
* **Build Tool:** Vite[cite: 3]
* **Enrutamiento:** React Router DOM v6[cite: 3]
* **Cliente HTTP:** Axios con manejador global de peticiones e interceptores[cite: 3]
* **Estilos y Maquetación:** Tailwind CSS / CSS Modules[cite: 3]
* **Gestión de Estado:** React Context API / Redux Toolkit[cite: 3]
* **Componentes de Audio:** Web Audio API para pre-escucha[cite: 3]

---

## Instalación y Configuración

### Requisitos Previos

* **Node.js:** Versión 18.0.0 o superior[cite: 3].
* **Gestor de paquetes:** `npm` (v9+) o `yarn`[cite: 3].
* Instancia en ejecución de **BITTU Ecosystem API**[cite: 3].

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/jamesTautiva/BITU-ARTIST.git](https://github.com/jamesTautiva/BITU-ARTIST.git)
   cd BITU-ARTIST
   ```[cite: 3]

2. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```[cite: 3]

3. **Configurar las variables de entorno:**
   ```bash
   cp .env.example .env
   ```[cite: 3]

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```[cite: 3]
   La aplicación estará disponible en `http://localhost:5173`[cite: 3].

---

## Variables de Entorno

Configure los siguientes parámetros en su archivo `.env` antes de ejecutar la aplicación[cite: 3]:

| Variable | Descripción | Ejemplo / Valor por Defecto |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Endpoint base de BITTU Ecosystem API | `https://api.bittu.com/v1` |
| `VITE_APP_ENV` | Entorno de ejecución (`development`, `production`) | `development` |
| `VITE_MAX_UPLOAD_SIZE_MB` | Tamaño máximo permitido para archivos de audio (MB) | `50` |[cite: 3]

---

## Despliegue y Optimización

Para generar una compilación de producción optimizada[cite: 3]:

1. **Ejecutar la compilación:**
   ```bash
   npm run build
   ```[cite: 3]

2. **Previsualizar la compilación localmente:**
   ```bash
   npm run preview
   ```[cite: 3]

3. **Servidores Estáticos / Hosting Cloud:**
   Los archivos resultantes dentro del directorio `dist/` pueden desplegarse de manera directa en infraestructuras CDN como Netlify, Vercel, AWS CloudFront o servidores Nginx/Apache[cite: 3].
npm run preview
Servidores Estáticos / Hosting Cloud: Los archivos resultantes dentro del directorio dist/ pueden desplegarse directamente en infraestructuras CDN como Netlify, Vercel, AWS CloudFront o servidores Nginx/Apache.

