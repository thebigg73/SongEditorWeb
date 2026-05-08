# Registro de Cambios / Changelog - SongEditorWeb

## [v0.2.0] - 2026-05-08

### 🇪🇸 Español
#### ✨ Nuevas Funcionalidades
- **Reproductor Estilo Spotify:** Integración con YouTube para escuchar y ensayar canciones directamente en el editor.
- **Controles de Ensayo:** Botones de Play/Pausa y un nuevo botón de **retroceso de -10 segundos** para facilitar la transcripción y práctica.
- **Soporte Bilingüe Avanzado:** Ahora las secciones marcadas con `L` (ej: `[V1L]`) se muestran con colores adaptativos al tema para diferenciar idiomas.
- **Tooltips Instantáneos:** Se eliminó la latencia de los tooltips nativos en el explorador de archivos; ahora la información aparece de inmediato.

#### 🔧 Mejoras y Correcciones
- **Estabilización XML:** Se corrigió un error crítico que corrompía archivos al guardar etiquetas como `<capo>`, asegurando compatibilidad total con OpenSongApp.
- **Nuevo Atajo de Guardado:** Se cambió a `Alt + S` para evitar conflictos con las funciones nativas del navegador.
- **Alertas Premium:** Sustitución de alertas nativas por modales integrados con el diseño del editor.
- **Persistencia de Tema:** El modo oscuro/claro ahora se guarda entre sesiones.

---

### 🇺🇸 English
#### ✨ New Features
- **Spotify-Style Player:** YouTube integration to listen and rehearse songs directly within the editor.
- **Rehearsal Controls:** Play/Pause buttons and a new **-10s rewind button** for easier transcription and practice.
- **Advanced Bilingual Support:** Sections marked with `L` (e.g., `[V1L]`) now display with theme-adaptive colors to differentiate languages.
- **Instant Tooltips:** Native browser tooltip latency removed in the file explorer; information now appears immediately.

#### 🔧 Improvements and Fixes
- **XML Stability:** Fixed a critical bug that corrupted files when saving tags like `<capo>`, ensuring full compatibility with OpenSongApp.
- **New Save Shortcut:** Changed to `Alt + S` to avoid conflicts with native browser functions.
- **Premium Alerts:** Replaced native browser alerts with custom modals integrated into the editor's design.
- **Theme Persistence:** Dark/Light mode settings now persist between sessions.
