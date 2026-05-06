<template>
  <aside
    class="preview-panel"
    :class="{ open, fullscreen: viewMode === 'fullscreen' }"
    :style="panelStyle"
  >
    <!-- Resize handle — only in normal mode -->
    <div
      v-if="viewMode === 'normal' && open"
      class="resize-handle"
      @mousedown.prevent="startResize"
    />

    <header class="preview-headerbar">
      <span class="preview-title">{{ t.preview }}</span>

      <div class="preview-controls">

        <!-- Modos de vista — mutuamente exclusivos -->
        <button
          class="btn-icon"
          :class="{ active: viewMode === 'phone' }"
          @click="setViewMode('phone')"
          :title="t.phoneView"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="7" y="2" width="10" height="20" rx="2"/>
            <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </button>

        <button
          class="btn-icon"
          :class="{ active: viewMode === 'tablet' }"
          @click="setViewMode('tablet')"
          :title="t.tabletView"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <circle cx="12" cy="18" r="0.8" fill="currentColor" stroke="none"/>
          </svg>
        </button>

        <button
          class="btn-icon"
          :class="{ active: viewMode === 'print' }"
          @click="setViewMode('print')"
          :title="t.printView"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="8" y1="13" x2="16" y2="13"/>
            <line x1="8" y1="17" x2="16" y2="17"/>
          </svg>
        </button>

        <button
          class="btn-icon"
          :class="{ active: viewMode === 'fullscreen' }"
          @click="setViewMode('fullscreen')"
          :title="t.fullscreen"
        >
          <!-- Expandir -->
          <svg v-if="viewMode !== 'fullscreen'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 3 21 3 21 9"/>
            <polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/>
            <line x1="3"  y1="21" x2="10" y2="14"/>
          </svg>
          <!-- Contraer -->
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="4 14 4 20 10 20"/>
            <polyline points="20 10 20 4 14 4"/>
            <line x1="14" y1="10" x2="21" y2="3"/>
            <line x1="3"  y1="21" x2="10" y2="14"/>
          </svg>
        </button>

        <span class="sep"/>

        <!-- Botón imprimir — solo visible en modo print -->
        <button
          v-if="viewMode === 'print'"
          class="btn-icon"
          @click="printSong"
          :title="t.print"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
        </button>

        <!-- Sync scroll: flecha arriba = iniciar/reanudar, pausa = detener -->
        <button
          class="btn-icon"
          :class="{ active: syncScrollActive }"
          @click="toggleSyncScroll"
          :title="syncScrollActive ? t.syncScrollPause : t.syncScrollStart"
        >
          <svg v-if="!syncScrollActive" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"/>
            <polyline points="5 12 12 5 19 12"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        </button>

        <span class="sep"/>

        <!-- Tamaño de fuente -->
        <button class="btn-icon" @click="decreaseFont" :title="t.decreaseFont">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
        <button class="btn-icon" @click="increaseFont" :title="t.increaseFont">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>

        <span class="sep"/>

        <!-- Cerrar -->
        <button class="btn-icon btn-close" @click="$emit('close')" :title="t.closePreview">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>

    <div
      class="preview-scroll"
      ref="content"
    >
      <div
        class="preview-content"
        :class="viewMode !== 'normal' ? `sim-${viewMode}` : ''"
        :style="{ fontSize: fontSize + 'px' }"
      >
        <div class="song-header" v-if="song && (song.title || song.author)">
          <div class="song-title">{{ song.title }}</div>
          <div class="song-meta" v-if="song.author">{{ song.author }}</div>
          <div class="song-meta" v-if="song.key">
            {{ t.key }}: {{ song.key }}{{ song.capo ? `  |  ${t.capo}: ${song.capo}` : '' }}
          </div>
        </div>

        <div v-if="song && song.lyrics" v-html="renderedLyrics"/>
        <div class="empty-state" v-else>
          <p>{{ t.emptyPreview }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: "SongPreview",
  props: {
    song:  Object,
    open:  { type: Boolean, default: false },
    t: Object
  },
  emits: ['update-song', 'close', 'show-alert'],

  data() {
    return {
      fontSize: 15,
      // Un único campo — solo un modo activo a la vez
      // Valores posibles: 'normal' | 'phone' | 'tablet' | 'print' | 'fullscreen'
      viewMode: 'normal',
      syncScrollActive: false,
      syncAnimation: null,
      syncStartTimeout: null,
      // Resize handle state
      customWidth: parseInt(localStorage.getItem('previewWidth')) || 450,
      isResizing: false
    };
  },

  computed: {
    panelStyle() {
      if (!this.open) return {};
      switch (this.viewMode) {
        case 'phone':      return { width: '375px' };
        case 'tablet':     return { width: '820px' };
        case 'print':      return { width: '850px' };
        case 'fullscreen': return { width: '100vw' };
        default:           return { width: this.customWidth + 'px' };
      }
    },

    renderedLyrics() {
      if (!this.song?.lyrics) return '';
      // FIX: regex más robusto para split de column break
      const columnas = this.song.lyrics.split(/\n?!--\n?/);
      const htmlColumnas = columnas.map(col => {
        const lineas = col.trim().split('\n');
        let dentroDeChorus = false;
        const contenido = lineas.map(linea => {
          if (/^\[.+\]$/.test(linea.trim())) {
            const nombre = linea.trim().slice(1, -1);
            // FIX: solo matchea "Chorus" exacto, no "Pre-Chorus"
            if (/^chorus(\s|$)/i.test(nombre)) {
              dentroDeChorus = true;
              return `<div class="chorus-block"><div class="section-label chorus">${nombre}</div>`;
            }
            if (dentroDeChorus) {
              dentroDeChorus = false;
              return `</div><div class="section-label">${nombre}</div>`;
            }
            return `<div class="section-label">${nombre}</div>`;
          }
          if (linea.trim().startsWith('.')) {
            const sinPunto = linea.replace(/^\s*\./, '');
            const conSpans = sinPunto.replace(
              /([A-G](?:#|b)?(?:m|maj|min|dim|aug|sus|add)?\d*(?:\/[A-G](?:#|b)?)?)/g,
              `<span class="chord">$1</span>`
            );
            return `<div class="line-chords">${conSpans}</div>`;
          }
          // FIX: remove extra space from start of lyrics line
          linea = linea.replace(/^ /, "");
          return linea.trim()
            ? `<div class="line-lyrics">${linea}</div>`
            : `<div class="line-empty"></div>`;
        }).join('');

        const cerrado = dentroDeChorus ? contenido + '</div>' : contenido;
        return `<div class="column">${cerrado}</div>`;
      }).join('');

      return `<div class="columns">${htmlColumnas}</div>`;
    }
  },

  methods: {
    // Si el modo ya está activo, vuelve a 'normal' (toggle)
    setViewMode(mode) {
      this.viewMode = this.viewMode === mode ? 'normal' : mode;
    },

    // ── Resize handle logic ──
    startResize(e) {
      this.isResizing = true;
      const startX = e.clientX;
      const startWidth = this.customWidth;

      const onMouseMove = (ev) => {
        // Panel is on the right, so moving mouse left increases width
        const delta = startX - ev.clientX;
        const newWidth = Math.max(300, Math.min(startWidth + delta, window.innerWidth * 0.7));
        this.customWidth = Math.round(newWidth);
      };

      const onMouseUp = () => {
        this.isResizing = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('blur', onMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        localStorage.setItem('previewWidth', this.customWidth);
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      window.addEventListener('blur', onMouseUp);
    },

    printSong() {
      const content = this.$refs.content?.innerHTML;
      if (!content) return;
      const win = window.open('', '_blank', 'width=850,height=700');
      win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${this.song?.title || 'Canción'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Roboto Mono', monospace; font-size: 11pt; color: #000; background: #fff; padding: 18mm 20mm; }
    .song-title  { font-size: 17pt; font-weight: bold; margin-bottom: 3pt; }
    .song-meta   { font-size: 9pt; color: #555; margin-bottom: 2pt; }
    .song-header { margin-bottom: 12pt; padding-bottom: 7pt; border-bottom: 1pt solid #ccc; }
    .columns     { display: flex; gap: 14pt; flex-wrap: wrap; }
    .column      { flex: 1; min-width: 200px; }
    .section-label { font-weight: bold; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.07em; color: #666; margin: 10pt 0 2pt; text-decoration: underline; }
    .section-label.chorus { color: #1e6e52; }
    .chorus-block { border-left: 2pt solid #1e6e52; padding-left: 6pt; margin: 5pt 0; background: rgba(30, 110, 82, 0.12); }
    .line-chords  { font-family: 'Roboto Mono', monospace; font-size: 9pt; font-weight: bold; color: #0050a0; white-space: pre-wrap; overflow-wrap: break-word; }
    .line-lyrics  { font-size: 10.5pt; white-space: pre-wrap; }
    .line-empty   { height: 5pt; }
    .chord        { color: #0050a0; font-weight: bold; }
    @page { margin: 15mm 18mm; }
  </style>
</head>
<body>${content}</body>
</html>`);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); win.close(); }, 350);
    },

    toggleSyncScroll() {
      this.syncScrollActive ? this.stopSyncScroll() : this.startSyncScroll();
    },

    startSyncScroll() {
      const delay    = Number(this.song?.predelay) || 0;
      const duration = Number(this.song?.duration) || 0;
      if (!duration) {
        this.$emit('show-alert', {
          title: this.t.durationMissingTitle,
          message: this.t.durationMissingText
        });
        return;
      }
      const el = this.$refs.content;
      if (!el) return;

      const totalPx = el.scrollHeight - el.clientHeight;
      if (totalPx <= 0) return;

      // Calculate current progress and remaining time
      const currentScroll = el.scrollTop;
      const currentProgress = currentScroll / totalPx;
      const remainingDuration = duration * (1 - currentProgress);

      if (remainingDuration <= 0) {
        // Already at the bottom, reset to top
        el.scrollTop = 0;
        return;
      }

      this.syncScrollActive = true;

      const startScroll = () => {
        const startScrollTop = el.scrollTop;
        const remainingPx = totalPx - startScrollTop;
        const start = performance.now();
        const run = (now) => {
          if (!this.syncScrollActive) return;
          const elapsed = now - start;
          const t = Math.min(elapsed / (remainingDuration * 1000), 1);
          el.scrollTop = startScrollTop + remainingPx * t;
          if (t >= 1) { this.stopSyncScroll(); return; }
          this.syncAnimation = requestAnimationFrame(run);
        };
        this.syncAnimation = requestAnimationFrame(run);
      };

      // If starting from the very beginning, apply delay
      if (currentProgress < 0.01 && delay > 0) {
        this.syncStartTimeout = setTimeout(startScroll, delay * 1000);
      } else {
        startScroll();
      }
    },

    stopSyncScroll() {
      this.syncScrollActive = false;
      clearTimeout(this.syncStartTimeout);
      cancelAnimationFrame(this.syncAnimation);
      this.syncStartTimeout = null;
      this.syncAnimation = null;
    },

    transposeUp()   { this.$emit('update-song', this.transposeSong(1));  },
    transposeDown() { this.$emit('update-song', this.transposeSong(-1)); },
    transposeSong(semitones) {
      if (!this.song?.lyrics) return this.song;
      const notas   = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
      const bemoles = { "Db":"C#","Eb":"D#","Gb":"F#","Ab":"G#","Bb":"A#" };
      const moverNota = (nota) => {
        if (bemoles[nota]) nota = bemoles[nota];
        const base = nota.match(/^[A-G](#|b)?/);
        if (!base) return nota;
        const idx = notas.indexOf(base[0]);
        if (idx === -1) return nota;
        return notas[(idx + semitones + 12) % 12] + nota.slice(base[0].length);
      };
      const lines = this.song.lyrics.split('\n').map(line => {
        if (!line.trim().startsWith('.')) return line;
        return line.replace(/([A-G](?:#|b)?(?:m|maj|min|dim|aug|sus)?\d*)/g, moverNota);
      });
      return {
        ...this.song,
        lyrics: lines.join('\n'),
        key: this.song.key ? moverNota(this.song.key) : this.song.key
      };
    },

    increaseFont() { this.fontSize = Math.min(32, this.fontSize + 1); },
    decreaseFont() { this.fontSize = Math.max(10, this.fontSize - 1); }
  },

  beforeUnmount() {
    this.stopSyncScroll();
  }
};
</script>

<style scoped>
.preview-panel {
  position: fixed;
  top: var(--toolbar-h, 48px);
  right: 0;
  bottom: 0;
  width: 0;
  background: var(--bg2, #111);
  border-left: 1px solid var(--border, #222);
  overflow: hidden;
  z-index: 1150;
  transition: width 280ms ease;
  display: flex;
  flex-direction: column;
}
/* width is now controlled via inline panelStyle, so no .preview-panel.open width rule */
.preview-panel.fullscreen { width: 100vw; z-index: 1500; }

/* ── Resize handle ── */
.resize-handle {
  position: absolute;
  top: 0;
  left: -3px;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
  background: transparent;
  transition: background 0.15s;
}
.resize-handle:hover,
.resize-handle:active {
  background: var(--accent, #3ca88d);
  opacity: 0.5;
}

/* ── Header ── */
.preview-headerbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  height: 40px;
  border-bottom: 1px solid var(--border, #222);
  flex-shrink: 0;
}
.preview-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--fg2, #aaa);
  white-space: nowrap;
}
.preview-controls {
  display: flex;
  align-items: center;
  gap: 2px;
}
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--fg2, #aaa);
  cursor: pointer;
  padding: 5px 6px;
  border-radius: 4px;
  line-height: 1;
  transition: background 0.1s, color 0.1s;
}
.btn-icon:hover  { background: var(--bg3, #2a2a2a); color: var(--fg, #fff); }
.btn-icon.active { color: var(--accent, #3ca88d); }
.sep {
  width: 1px;
  height: 16px;
  background: var(--border, #333);
  margin: 0 3px;
  flex-shrink: 0;
}

/* ── Scroll wrapper — NO horizontal scrollbar ── */
.preview-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
}

/* ── Área de contenido interior — Roboto Mono everywhere ── */
.preview-content {
  padding: 16px 20px;
  line-height: 1.55;
  min-height: 100%;
  font-family: 'Roboto Mono', monospace;
  /* Prevent content from exceeding panel width */
  max-width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* ── Modo teléfono ── */
.sim-phone {
  max-width: 100%;
  margin: 0 auto;
  border: 2px solid var(--border, #555);
  border-radius: 18px;
  padding: 20px 16px;
  min-height: 600px;
}

/* ── Modo tableta ── */
.sim-tablet {
  max-width: 100%;
  margin: 0 auto;
  border: 2px solid var(--border, #555);
  border-radius: 10px;
  padding: 20px 24px;
  min-height: 500px;
}

/* ── Modo impresión A4 ── */
.sim-print {
  max-width: 210mm;
  margin: 16px auto;
  background: #fff;
  color: #000;
  border: 1px solid #bbb;
  box-shadow: 0 2px 16px rgba(0,0,0,0.3);
  padding: 18mm 20mm;
  min-height: 297mm;
  font-family: 'Roboto Mono', monospace;
}

.empty-state { color: var(--fg2, #888); font-size: 13px; text-align: center; margin-top: 40px; }
</style>

<!-- Unscoped styles for v-html rendered content (scoped styles don't penetrate v-html) -->
<style>
/* ── Cabecera de canción (dentro del preview) ── */
.preview-panel .song-header {
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border, #333);
}
.preview-panel .song-title {
  font-size: 1.25em;
  font-weight: 700;
  margin-bottom: 3px;
}
.preview-panel .song-meta {
  font-size: 0.85em;
  color: var(--fg2, #aaa);
}

/* ── Letra y acordes ── */
.preview-panel .section-label {
  font-weight: 700;
  text-decoration: underline;
  font-size: 0.78em;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 14px 0 3px;
  color: var(--fg2, #aaa);
  font-family: 'Roboto Mono', monospace;
}
.preview-panel .section-label.chorus { color: var(--accent, #3ca88d); }
.preview-panel .chorus-block {
  background: rgba(255, 255, 255, 0.1);
  border-left: 2px solid var(--accent, #3ca88d);
  padding: 4px 10px;
  margin: 6px 0;
  border-radius: 0 4px 4px 0;
}
.preview-panel .line-chords {
  font-family: 'Roboto Mono', monospace;
  color: var(--chord-color, #4FC3F7);
  font-weight: 700;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-all;
  margin: 0;
  max-width: 100%;
}
.preview-panel .line-lyrics {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
  font-family: 'Roboto Mono', monospace;
  max-width: 100%;
}
.preview-panel .line-empty  { height: 0.55em; }
.preview-panel .chord { font-weight: bold; }

.preview-panel .columns {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
  max-width: 100%;
  overflow: hidden;
}
.preview-panel .column {
  flex: 1;
  min-width: 200px;
  padding-right: 16px;
  border-right: 1px dashed var(--border, #333);
  overflow: hidden;
  max-width: 100%;
}
.preview-panel .column:last-child { border-right: none; padding-right: 0; }

/* ── Print mode overrides ── */
.preview-panel .sim-print .song-title           { color: #000; }
.preview-panel .sim-print .song-meta             { color: #555; }
.preview-panel .sim-print .section-label         { color: #666; }
.preview-panel .sim-print .section-label.chorus  { color: #1e6e52; }
.preview-panel .sim-print .chorus-block          { border-left-color: #1e6e52; background: rgba(30, 110, 82, 0.12); }
.preview-panel .sim-print .line-chords           { color: #0050a0; }
</style>
