# 🎵 Song Editor PWA

¡Bienvenido al repositorio de **Song Editor PWA**! Esta es una aplicación web progresiva (PWA) construida con Vue 3 diseñada para visualizar, editar y gestionar canciones y setlists, con soporte para el formato XML de OpenSong.

## ✨ Características Principales

- **Edición en Tiempo Real:** Edita letras, acordes y metadatos de las canciones con una vista previa instantánea.
- **Soporte PWA (Offline):** Instalable en dispositivos móviles y de escritorio. Funciona sin conexión a internet manteniendo tus datos seguros.
- **Explorador de Archivos Integrado:** Gestiona tus canciones (crear, renombrar, eliminar) directamente desde la interfaz usando la File System Access API.
- **Compatibilidad OpenSong:** Soporte nativo para leer y escribir archivos en el formato XML de OpenSong.
- **Diseño Responsivo:** Interfaz adaptable a múltiples dispositivos (teléfonos, tablets, impresión).
- **Modo Oscuro/Claro:** Estilizado utilizando PicoCSS para una experiencia visual limpia y moderna.

## 🛠️ Tecnologías Utilizadas

- **[Vue.js 3](https://v3.vuejs.org/)** - Framework principal.
- **[PicoCSS](https://picocss.com/)** - Framework CSS minimalista para estilos rápidos y accesibles.
- **[Fast XML Parser](https://github.com/NaturalIntelligence/fast-xml-parser)** - Para la conversión bidireccional entre JSON y el formato XML de OpenSong.
- **Vue CLI** - Herramienta de construcción y desarrollo.

## 🚀 Requisitos Previos

Asegúrate de tener instalado en tu sistema:
- [Node.js](https://nodejs.org/) (versión 14.x o superior recomendada)
- `npm` (normalmente viene con Node.js)

## 📦 Instalación y Configuración Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local:

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/mi-editor.git
   cd mi-editor
   ```

2. **Instala las dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo (con hot-reload):**
   ```bash
   npm run serve
   ```
   La aplicación estará disponible típicamente en `http://localhost:8080`.

## 📜 Comandos Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

| Comando | Descripción |
|---------|-------------|
| `npm run serve` | Inicia el servidor de desarrollo local con recarga en caliente (hot-reload). |
| `npm run build` | Compila y minifica la aplicación para producción en la carpeta `dist`. |
| `npm run lint` | Analiza el código fuente en busca de errores de sintaxis y los corrige automáticamente si es posible. |

## 🤝 Cómo Contribuir

¡Las contribuciones son muy bienvenidas! Si deseas mejorar el proyecto, corregir un bug o añadir una nueva funcionalidad, sigue estos pasos de contribución (Fork & Pull Request):

1. **Haz un Fork** del repositorio haciendo clic en el botón "Fork" arriba a la derecha en GitHub.
2. **Clona tu Fork** a tu máquina local.
3. **Crea una nueva rama** para tu funcionalidad o corrección:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
   *(Usa prefijos estandarizados como `feature/`, `bugfix/`, `docs/`, etc.)*
4. **Realiza tus cambios** en el código.
5. **Haz commit** de tus cambios con mensajes descriptivos:
   ```bash
   git commit -m "Añade: nueva funcionalidad de exportación a PDF"
   ```
6. **Sube tus cambios** (push) a tu repositorio bifurcado:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
7. **Abre un Pull Request** (PR) en el repositorio original detallando qué cambiaste, por qué lo cambiaste y cómo probarlo.

### 📝 Guías de Código
- Mantén la consistencia con el estilo de código existente (usa `npm run lint` antes de hacer commit).
- Documenta cualquier cambio sustancial en la lógica o nuevos componentes.
- Si agregas nuevas características que requieran dependencias extra, justifícalo en la descripción del PR.

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](https://opensource.org/licenses/MIT). Siéntete libre de usarlo, modificarlo y distribuirlo.

---
⭐️ *Si este proyecto te resulta útil, ¡no olvides darle una estrella en GitHub!*
