<template>
  <div id="app">
    <MainToolbar
      :modo="modo"
      :lang="lang"
      :t="t"
      @toggle-explorer="showExplorer = !showExplorer"
      @toggle-preview="showPreview = !showPreview"
      @open-help="openHelp"
      @edit-metadata="mostrarMetadata = true"
      @toggle-shortcuts="mostrarAtajos = !mostrarAtajos"
      @nuevo-archivo="nuevoArchivo"
      @abrir-archivo="abrirArchivoDirecto"
      @guardar-archivo="guardarDirecto"
      @guardar-como="guardarComo"
      @toggle-theme="toggleTheme"
      @toggle-lang="toggleLang"
      @transpose-up="transposeUp"
      @transpose-down="transposeDown"
      @convert-to-opensong="convertToOpenSong"
    />

    <!-- v-show en lugar de v-if: mantiene el estado de archivos cargados al cerrar -->
    <FileExplorer
      ref="fileExplorer"
      v-show="showExplorer"
      :open="showExplorer"
      :t="t"
      @open-file="openFileFromHandle"
    />

    <!-- El editor se desplaza cuando el explorador está abierto -->
    <SongEditor
      v-model="song"
      ref="editor"
      :style="{ '--explorer-left': showExplorer ? '320px' : '0px' }"
    />

    <!-- Preview como panel lateral derecho -->
    <SongPreview
      v-show="showPreview"
      :open="showPreview"
      :song="song"
      :t="t"
      @update-song="song = $event"
      @close="showPreview = false"
      @show-alert="showAlert"
    />

    <!-- Modal de metadatos -->
    <div v-if="mostrarMetadata" class="modal-overlay">
      <div class="modal">
        <h3>{{ t.metadataTitle }}</h3>
        <label>{{ t.title }}: <input v-model="song.title" :placeholder="t.title" /></label>
        <label>{{ t.artist }}: <input v-model="song.author" :placeholder="t.artist" /></label>
        <label>{{ t.notes }}: <textarea v-model="song.notes" :placeholder="t.notes"></textarea></label>
        <label>{{ t.key }}: <input v-model="song.key" placeholder="Ex. C, G, Am" /></label>
        <label>{{ t.originalKey }}: <input v-model="song.originalKey" placeholder="Ex. G" /></label>
        <label>{{ t.capo }}: <input type="number" v-model.number="song.capo" placeholder="Ex. 3" /></label>
        <label>{{ t.tempo }}: <input type="number" v-model.number="song.tempo" placeholder="Ex. 120" /></label>
        <label>{{ t.timeSignature }}: <input v-model="song.timeSignature" placeholder="Ex. 4/4" /></label>
        <label>{{ t.instrument }}: <input v-model="song.instrument" placeholder="Ex. Guitar/Piano" /></label>
        <label>{{ t.duration }}:
          <div class="duration-row">
            <input type="number" v-model.number="durationMin" placeholder="min" min="0" />
            <span class="duration-label">min</span>
            <input type="number" v-model.number="durationSec" placeholder="seg" min="0" max="59" />
            <span class="duration-label">seg</span>
          </div>
        </label>
        <label>{{ t.delay }}: <input type="number" v-model.number="song.delay" placeholder="Ex. 5" /></label>
        <label>{{ t.tags }}: <input v-model="song.tags" placeholder="Ex. Rock, Church, Acoustic" /></label>
        <label>{{ t.presentation }}: <input v-model="song.presentationOrder" placeholder="Ex. V1, C, V2, C" /></label>
        <div class="modal-buttons">
          <button @click="cerrarModal">{{ t.saveClose }}</button>
        </div>
      </div>
    </div>

    <!-- Modal de cambios sin guardar -->
    <div v-if="showUnsavedDialog" class="modal-overlay unsaved-overlay">
      <div class="modal">
        <div class="modal-icon-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h3>{{ t.unsavedTitle }}</h3>
        </div>
        <p class="modal-text">{{ t.unsavedText }}</p>
        <div class="modal-buttons vertical">
          <button class="btn-primary" @click="resolveUnsaved('save')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            {{ t.btnSave }}
          </button>
          <button class="btn-secondary" @click="resolveUnsaved('discard')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            {{ t.btnDiscard }}
          </button>
          <button class="btn-ghost" @click="resolveUnsaved('cancel')">{{ t.btnCancel }}</button>
        </div>
      </div>
    </div>

    <!-- Modal de Ayuda -->
    <div v-if="showHelpModal" class="modal-overlay">
      <div class="modal help-modal">
        <div class="modal-icon-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <h3>{{ t.helpTitle }}</h3>
        </div>
        <div class="help-content">
          <div class="help-item">
            <strong>{{ t.helpAbout }}</strong>
            <span>{{ t.helpAboutText }}</span>
          </div>
          <div class="help-item">
            <strong>{{ t.helpExplorer }}</strong>
            <span>{{ t.helpExplorerText }}</span>
          </div>
          <div class="help-item">
            <strong>{{ t.helpPreview }}</strong>
            <span>{{ t.helpPreviewText }}</span>
          </div>
          <div class="help-item">
            <strong>{{ t.helpFormat }}</strong>
            <span>{{ t.helpFormatText }}</span>
          </div>
          <div class="help-item">
            <strong>{{ t.helpNote }}</strong>
            <span>{{ t.helpNoteText }}</span>
          </div>
          <div class="help-footer">
            {{ t.helpContact }}
          </div>
        </div>
        <div class="modal-buttons">
          <button class="btn-close-modal" @click="showHelpModal = false">{{ t.btnClose }}</button>
        </div>
      </div>
    </div>

    <!-- Modal de Alerta Genérico (Duración, etc) -->
    <div v-if="alertModal.show" class="modal-overlay">
      <div class="modal alert-modal">
        <div class="modal-icon-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <h3>{{ alertModal.title }}</h3>
        </div>
        <p class="modal-text">{{ alertModal.message }}</p>
        <div class="modal-buttons">
          <button class="btn-close-modal" @click="alertModal.show = false">{{ t.btnClose }}</button>
        </div>
      </div>
    </div>

    <!-- Panel de atajos Rediseñado -->
    <Transition name="fade">
      <div v-if="mostrarAtajos" class="atajos-panel">
        <div class="atajos-header">
          <span>{{ t.shortcutsTitle }}</span>
          <button class="btn-close-mini" @click="mostrarAtajos = false">✕</button>
        </div>
        <div class="atajos-grid">
          <div class="atajo-row"><span>Alt + 1..9</span> <span>{{ t.shortcutSections }}</span></div>
          <div class="atajo-row"><span>Alt + T</span> <span>{{ t.shortcutTab }}</span></div>
          <div class="atajo-row"><span>Alt + G</span> <span>{{ t.shortcutGrid }}</span></div>
          <div class="atajo-row"><span>Alt + C</span> <span>{{ t.shortcutColumn }}</span></div>
          <div class="atajo-row"><span>Ctrl + S</span> <span>{{ t.shortcutSave }}</span></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { translations } from "./i18n";
import MainToolbar from "./components/MainToolbar.vue";
import SongEditor from "./components/SongEditor.vue";
import SongPreview from "./components/SongPreview.vue";
import FileExplorer from "./components/FileExplorer.vue";

const SONG_DEFAULTS = () => ({
  title: '',
  author: '',
  lyrics: '',
  notes: '',
  key: '',
  originalKey: '',
  capo: 0,
  tempo: 120,
  timeSignature: '4/4',
  instrument: '',
  duration: 0,
  delay: 0,
  tags: '',
  presentationOrder: ''
});

export default {
  name: "App",
  components: { MainToolbar, SongEditor, SongPreview, FileExplorer },

  data() {
    return {
      mostrarMetadata: false,
      mostrarAtajos: false,
      showPreview: false,
      showExplorer: false,
      // FIX: modo inicializa desde localStorage para persistir entre sesiones
      modo: localStorage.getItem('theme') || 'dark',
      lang: localStorage.getItem('lang') || 'es',
      song: SONG_DEFAULTS(),
      fileHandle: null,
      tabBlock: `;E|-------|\n;B|-------|\n;G|-------|\n;D|-------|\n;A|-------|\n;E|-------|`,
      gridBlock: `[ChordGrid]\n | C . . . | G . . . | Am . . . | F . D . | \n`,
      // ── Unsaved changes tracking ──
      savedSongSnapshot: JSON.stringify(SONG_DEFAULTS()),
      showUnsavedDialog: false,
      unsavedResolve: null,
      // ── New UI states ──
      showHelpModal: false,
      alertModal: {
        show: false,
        title: '',
        message: ''
      }
    };
  },

  computed: {
    hasUnsavedChanges() {
      return JSON.stringify(this.song) !== this.savedSongSnapshot;
    },
    t() {
      return translations[this.lang];
    },
    // ── Duration split into min and sec ──
    durationMin: {
      get() {
        const total = Number(this.song.duration) || 0;
        return Math.floor(total / 60);
      },
      set(val) {
        const sec = (Number(this.song.duration) || 0) % 60;
        this.song.duration = (Number(val) || 0) * 60 + sec;
      }
    },
    durationSec: {
      get() {
        const total = Number(this.song.duration) || 0;
        return total % 60;
      },
      set(val) {
        const min = Math.floor((Number(this.song.duration) || 0) / 60);
        this.song.duration = min * 60 + (Number(val) || 0);
      }
    }
  },

  methods: {
    // ── Snapshot helpers ──
    takeSongSnapshot() {
      this.savedSongSnapshot = JSON.stringify(this.song);
    },

    // ── Unsaved changes dialog ──
    // Returns a promise that resolves to 'save', 'discard', or 'cancel'
    askUnsavedChanges() {
      return new Promise((resolve) => {
        this.showUnsavedDialog = true;
        this.unsavedResolve = resolve;
      });
    },

    async resolveUnsaved(action) {
      this.showUnsavedDialog = false;
      if (action === 'save') {
        await this.guardarDirecto();
      }
      if (this.unsavedResolve) {
        this.unsavedResolve(action);
        this.unsavedResolve = null;
      }
    },

    // Helper: check unsaved and ask user. Returns true if safe to proceed.
    async checkUnsaved() {
      if (!this.hasUnsavedChanges) return true;
      const action = await this.askUnsavedChanges();
      return action !== 'cancel';
    },

    // FIX: toggle-theme ahora funciona — aplica data-theme al <html> para Pico CSS
    toggleTheme() {
      this.modo = this.modo === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', this.modo);
      localStorage.setItem('theme', this.modo);
    },

    toggleLang() {
      this.lang = this.lang === 'es' ? 'en' : 'es';
      localStorage.setItem('lang', this.lang);
    },

    async openFileFromHandle(handle) {
      // Check unsaved changes before opening another song
      if (!(await this.checkUnsaved())) return;
      try {
        const file = await handle.getFile();
        const texto = await file.text();
        const parser = new XMLParser({ ignoreAttributes: false });
        const json = parser.parse(texto);
        // FIX: fallback robusto si el XML no tiene <song>
        this.song = { ...SONG_DEFAULTS(), ...(json.song || {}) };
        this.fileHandle = handle;
        this.takeSongSnapshot();
      } catch (err) {
        console.error("Error opening file from handle:", err);
        alert("No se pudo abrir el archivo");
      }
    },

    // FIX: ya no necesita guardarMetadatos separado — los v-model ya actualizan reactivamente
    cerrarModal() {
      this.mostrarMetadata = false;
    },

    async nuevoArchivo() {
      // Check unsaved changes before creating new
      if (!(await this.checkUnsaved())) return;
      // FIX: campos numéricos con valores correctos en lugar de strings vacíos
      this.song = SONG_DEFAULTS();
      this.fileHandle = null;
      this.takeSongSnapshot();
      this.mostrarMetadata = true;
    },

    openHelp() {
      this.showHelpModal = true;
    },

    showAlert(config) {
      this.alertModal = {
        show: true,
        title: config.title || 'Aviso',
        message: config.message || ''
      };
    },

    insertarBloque(texto) {
      const textarea = this.$refs.editor?.$refs?.lyricsTextarea;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.setRangeText(texto, start, end, "end");
      textarea.focus();
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    },

    async guardarComo() {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: this.song.title || 'Nueva Canción'
        });
        const writable = await handle.createWritable();
        const builder = new XMLBuilder({ ignoreAttributes: false });
        await writable.write(builder.build({ song: this.song }));
        await writable.close();
        this.fileHandle = handle;
        this.takeSongSnapshot();
        this.$refs.fileExplorer?.refreshRoot();
        alert("Archivo guardado correctamente");
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Error al guardar como:", err);
          alert("No se pudo guardar el archivo");
        }
      }
    },

    async abrirArchivoDirecto() {
      // Check unsaved changes before opening another file
      if (!(await this.checkUnsaved())) return;
      try {
        const [handle] = await window.showOpenFilePicker();
        this.fileHandle = handle;
        const file = await handle.getFile();
        const texto = await file.text();
        const parser = new XMLParser({ ignoreAttributes: false });
        const json = parser.parse(texto);
        // FIX: fallback si el XML no contiene <song>
        this.song = { ...SONG_DEFAULTS(), ...(json.song || {}) };
        this.takeSongSnapshot();
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Error al abrir:", err);
          alert("No se pudo abrir el archivo");
        }
      }
    },

    async guardarDirecto() {
      try {
        if (!this.fileHandle) {
          return this.guardarComo();
        }
        const writable = await this.fileHandle.createWritable();
        const builder = new XMLBuilder({ ignoreAttributes: false });
        await writable.write(builder.build({ song: this.song }));
        await writable.close();
        this.takeSongSnapshot();
        this.$refs.fileExplorer?.refreshRoot();
        alert("Archivo guardado");
      } catch (err) {
        console.error("Error al guardar:", err);
        alert("No se pudo guardar el archivo");
      }
    },

    // ── Convert editor text to OpenSong format ──
    convertToOpenSong() {
      if (!this.song?.lyrics) {
        alert('El editor está vacío. Escribe o pega texto primero.');
        return;
      }

      const CHORD_REGEX = /^[\s]*([A-G][#b]?(?:m|maj|min|dim|aug|sus|add|7|9|11|13|6|2|4|M)*(?:\d*)(?:\/[A-G][#b]?)?\s*)+$/;
      const SECTION_REGEX = /^\s*(Intro|Verse|Pre[-\s]?Chorus|Chorus|Bridge|Solo|Instrumental|Outro|Interlude|Tag|Ending|Coda|Segue)\s*:?\s*(\d*)\s*$/i;

      const lines = this.song.lyrics.split('\n');
      const converted = lines.map(line => {
        // Already in OpenSong format (starts with . or [ or ;)
        // eslint-disable-next-line no-useless-escape
        if (/^\s*[.\[;]/.test(line)) return line;

        // Empty line
        if (!line.trim()) return '';

        // Section header: "Verse:", "Chorus 2:", etc.
        const sectionMatch = line.match(SECTION_REGEX);
        if (sectionMatch) {
          const name = sectionMatch[1] + (sectionMatch[2] ? ' ' + sectionMatch[2] : '');
          return `[${name}]`;
        }

        // Chord line: all tokens are valid chords
        if (CHORD_REGEX.test(line)) {
          return '.' + line;
        }

        // Lyrics line: leave as-is (space prefix for OpenSong format)
        return ' ' + line.trimStart();
      }).join('\n');

      this.song.lyrics = converted;
      alert('Texto convertido a formato OpenSong.');
    },

    transponer(semitonos) {
      if (!this.song?.lyrics) return;
      const notas = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
      const bemoles = { "Db":"C#","Eb":"D#","Gb":"F#","Ab":"G#","Bb":"A#" };
      const moverNota = (nota) => {
        if (bemoles[nota]) nota = bemoles[nota];
        const base = nota.match(/^[A-G](#|b)?/);
        if (!base) return nota;
        const idx = notas.indexOf(base[0]);
        if (idx === -1) return nota;
        return notas[(idx + semitonos + 12) % 12] + nota.slice(base[0].length);
      };
      // FIX: solo transpone en líneas que empiezan con "." (líneas de acordes)
      const lines = this.song.lyrics.split('\n');
      this.song.lyrics = lines.map(line => {
        if (!line.trim().startsWith('.')) return line;
        return line.replace(/([A-G](?:#|b)?(?:m|maj|min|dim|aug|sus)?\d*)/g, moverNota);
      }).join('\n');
      if (this.song.key) this.song.key = moverNota(this.song.key);
    },

    transposeUp()   { this.transponer(1);  },
    transposeDown() { this.transponer(-1); },

    handleKeydown(e) {
      if (!e.altKey) return;
      const key = e.key.toUpperCase();
      const map = {
        "1": "[ ]", "2": "[Intro]", "3": "[Verse]", "4": "[Pre-Chorus]",
        // FIX: era "[ChoruSs]"
        "5": "[Chorus]",
        "6": "[Bridge]", "7": "[Solo]", "8": "[Instrumental]", "9": "[Outro]",
        "T": this.tabBlock,
        "G": this.gridBlock,
        "C": "\n!--\n"
      };
      if (map[key]) {
        this.insertarBloque(map[key]);
        e.preventDefault();
      }
    },

    // ── beforeunload guard ──
    handleBeforeUnload(e) {
      if (this.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    }
  },

  mounted() {
    // Aplicar tema guardado al arrancar
    document.documentElement.setAttribute('data-theme', this.modo);
    this._escapeHandler = (e) => { if (e.key === "Escape") this.cerrarModal(); };
    window.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("keydown", this._escapeHandler);
    window.addEventListener("beforeunload", this.handleBeforeUnload);

    // Request persistent storage for PWA
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(granted => {
        if (granted) console.log("Storage will not be cleared except by explicit user action");
      });
    }
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("keydown", this._escapeHandler);
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  }
};
</script>

<style>
/* ── Variables de tema (Pico CSS las sobreescribe si está instalado) ── */
:root {
  --bg: #0d0d0d;
  --bg2: #1a1a1a;
  --bg3: #2a2a2a;
  --fg: #f0f0f0;
  --fg2: #aaa;
  --accent: #3ca88d;
  --border: #333;
  --chord-color: #4FC3F7;
  --toolbar-h: 48px;
}
[data-theme="light"] {
  --bg: #f5f5f5;
  --bg2: #ffffff;
  --bg3: #e8e8e8;
  --fg: #111;
  --fg2: #555;
  --border: #ccc;
  --chord-color: #0070b8;
}

/* ── Reset base ── */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: 'Segoe UI', system-ui, sans-serif;
  overflow-x: hidden;
}

/* ==========================================================================
   FIX: Custom Scrollbars to prevent Windows Overlay Scrollbar bug.
   This prevents the 5-second fade-out timer, the pixel shifting, and 
   the GPU cursor flickering caused by OS-level scrollbars.
   ========================================================================== */
::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}
::-webkit-scrollbar-track {
  background: var(--bg, #0d0d0d);
}
::-webkit-scrollbar-thumb {
  background: var(--border, #333);
  border-radius: 7px;
  border: 3px solid var(--bg, #0d0d0d);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--fg2, #555);
}

/* Transiciones originales restauradas (sin afectar el rendimiento) */
.file-explorer, .preview-panel, .SongEditor {
  transition: width 280ms ease, left 280ms ease;
}

/* Evitamos transiciones en el textarea para asegurar fluidez extrema */
textarea {
  transition: none !important;
}

/* ── Toolbar ── */
header.toolbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--toolbar-h);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 10px;
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  z-index: 1200;
}

/* ── Botones globales ── */
button {
  padding: 8px 16px;
  background: var(--bg3);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
button:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(60, 168, 141, 0.2);
}
button:active {
  transform: none !important;
}

/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex; justify-content: center; align-items: center;
  z-index: 1300;
}
.modal {
  background: var(--bg2);
  border: 1px solid var(--border);
  padding: 24px;
  border-radius: 12px;
  width: 440px;
  max-height: 85vh;
  overflow-y: auto;
  color: var(--fg);
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}
.modal h3 { 
  margin: 0; 
  font-size: 18px; 
  font-weight: 700;
  color: var(--accent);
}
.modal label {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 13px;
  color: var(--fg2);
}
.modal label input,
.modal label textarea {
  background: var(--bg3);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 13px;
  font-family: inherit;
}
.modal label textarea { resize: vertical; min-height: 60px; }
.modal-buttons { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }

/* ── Duration row ── */
.duration-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.duration-row input {
  width: 70px;
  background: var(--bg3);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 13px;
  font-family: inherit;
}
.duration-label {
  font-size: 12px;
  color: var(--fg2);
}

/* ── Panel de atajos Rediseñado ── */
.atajos-panel {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 280px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  z-index: 1250;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.atajos-header {
  padding: 10px 14px;
  background: var(--bg3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--fg2);
  border-bottom: 1px solid var(--border);
}

.atajos-grid {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.atajo-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.atajo-row span:first-child {
  color: var(--accent);
  font-weight: 600;
  font-family: monospace;
}

.atajo-row span:last-child {
  color: var(--fg2);
}

.btn-close-mini {
  background: transparent;
  border: none;
  color: var(--fg2);
  cursor: pointer;
  padding: 2px;
  font-size: 10px;
  line-height: 1;
}
.btn-close-mini:hover { color: var(--accent); }

/* ── Estilos de Modales Premium ── */
.modal-icon-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.modal-icon-header svg {
  color: var(--accent);
}

.modal-text {
  font-size: 14px;
  color: var(--fg2);
  line-height: 1.5;
  margin: 0;
}

.modal-buttons.vertical {
  flex-direction: column;
  gap: 8px;
}

.modal-buttons.vertical button {
  width: 100%;
  justify-content: flex-start;
}

.btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.btn-secondary { background: var(--bg3); color: var(--fg); border-color: var(--border); }
.btn-ghost { background: transparent; border: none; color: var(--fg2); }
.btn-ghost:hover { background: rgba(255,255,255,0.05); color: var(--fg); }

.btn-close-modal {
  background: var(--bg3);
  color: var(--fg2);
  border: 1px solid var(--border);
  min-width: 100px;
}
.btn-close-modal:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.help-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding-right: 8px;
}

.help-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.help-item strong {
  font-size: 13px;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.help-item span {
  font-size: 13px;
  color: var(--fg2);
  line-height: 1.6;
}

.help-footer {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--fg2);
  font-style: italic;
  text-align: center;
}

/* Transiciones */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Utilidades de contenido (letras/acordes) ── */
.chord { white-space: pre; font-family: monospace; color: var(--chord-color); font-weight: bold; }
.columns { display: flex; gap: 20px; }
.column { flex: 1; min-width: 200px; padding-right: 10px; border-right: 1px dashed var(--border); }
.column:last-child { border-right: none; }
</style>
