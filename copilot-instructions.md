# Copilot Instructions for mi-editor

## Contexto del proyecto
- Proyecto Vue 3 para un editor de canciones con acordes y letras.
- El editor debe ocupar toda la pantalla por defecto, con fondo oscuro y sin pestaña de resize.
- El preview debe abrirse como ventana flotante, única, redimensionable y arrastrable.
- Cumplir reglas ESLint (multi‑word components, no mutar props, no duplicar métodos).
- Modularidad estricta: MainToolbar, SongEditor, SongPreview.

## Plan de trabajo

### Base estable
- Editor fullscreen con fondo negro.
- Toolbar fija arriba con botones principales (Nuevo, Abrir, Guardar, Preview, Metadatos, Atajos).
- Preview flotante independiente, no dentro de `.workspace`.

### Funciones esenciales
- Transposición de acordes con actualización dinámica de tonalidad.
- Preview con ajuste de línea automático (`white-space: normal`).
- Ventana flotante arrastrable con barra superior como “handle”.

### Atajos y ergonomía
- Inserción rápida de bloques (Intro, Verse, Chorus, etc.).
- Corrección de comportamiento de teclado.
- Eliminar botones de “full” (ya no se usan porque editor es fullscreen).

### Mejoras de usabilidad
- Autoscroll para practicar canciones en tiempo real.
- Configuración de resolución/aspecto para simular vista en tablet.
- Bloques de acordes/tab con vista previa clara.

### Funciones avanzadas
- Crear setlists al estilo SongbookPro.
- Importar canciones desde Ultimate-Guitar y convertirlas automáticamente.
- Explorador de carpetas con sets/tags para cambiar de canción con clic.
- Grilla de acordes y shortcuts gráficos.

## Estilo de código
- Cumplir ESLint y Prettier.
- Usar Volar para soporte Vue 3.
- Evitar duplicación de métodos.
- Modularidad estricta: cada componente con responsabilidad clara.