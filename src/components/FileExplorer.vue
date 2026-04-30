<template>
  <!-- FIX: el aside siempre existe en el DOM (v-show en App),
       la clase "open" controla la animación de apertura/cierre -->
  <aside class="file-explorer" :class="{ open }">
    <div class="explorer-header">
      <span class="explorer-title">{{ t.files }}</span>
    </div>

    <div class="section">
      <button class="btn-full" @click="pickRoot">
        <svg v-if="!rootHandle && !pendingRoot" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 4v6h-6"></path>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        <span>{{ pendingRoot ? 'Restaurar acceso a archivos' : (rootHandle ? t.changeRoot : t.pickRoot) }}</span>
      </button>
      <div class="files-list">
        <div v-if="!rootHandle" class="empty">{{ t.noFolder }}</div>
        <table v-else class="file-table">
          <thead>
            <tr>
              <th class="col-title">{{ t.colTitle }}</th>
              <th class="col-artist">{{ t.colArtist }}</th>
              <th v-if="setRoot" class="col-add"></th>
              <th class="col-more"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="f in files"
              :key="f.name"
              @click="openFile(f.handle)"
            >
              <td class="col-title">{{ f.name }}</td>
              <td class="col-artist">{{ f.artist || '—' }}</td>
              <td v-if="setRoot" class="col-add">
                <button
                  class="btn-add"
                  @click.stop="addSongToSetlist(f)"
                  :title="t.addSetlist"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </td>
              <td class="col-more">
                <div class="more-menu-container" @click.stop>
                  <button class="btn-more" @click="toggleMenu(f.name)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </button>
                  <div class="more-menu" v-if="activeMenu === f.name">
                    <button @click="renameFile(f)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      {{ t.rename }}
                    </button>
                    <button @click="deleteFile(f)" class="danger">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      {{ t.delete }}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="section">
      <div class="section-label">{{ t.setlists }}</div>
      <button class="btn-full" @click="pickSetRoot">
        <svg v-if="!setRoot && !pendingSetRoot" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 4v6h-6"></path>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        <span>{{ pendingSetRoot ? 'Restaurar acceso a setlists' : (setRoot ? t.changeRoot : t.pickSetRoot) }}</span>
      </button>
      <div class="setlist-area">
        <div v-if="!setRoot" class="empty">{{ t.noFolder }}</div>
        <div v-else>
          <div class="setlist-controls">
            <button class="btn-mini" @click="newSetlist" :title="t.newSetlist">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            </button>
            <button class="btn-mini" @click="openSetlist" :title="t.openSetlist">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                <path d="M12 11v6"></path>
                <path d="M9 14h6"></path>
              </svg>
            </button>
            <button class="btn-mini" @click="addAllToSetlist" :title="t.addAll">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v10"></path>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
                <circle cx="18" cy="18" r="4"></circle>
                <line x1="18" y1="16" x2="18" y2="20"></line>
                <line x1="16" y1="18" x2="20" y2="18"></line>
              </svg>
            </button>
            <button class="btn-mini" @click="saveSetlist" :title="t.saveSetlist">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            </button>
          </div>
          <div v-if="setlistName" class="setlist-name">{{ setlistName }}</div>
          <ul class="setlist">
            <li
              v-for="(s, i) in setlistItems"
              :key="i"
              draggable="true"
              @dragstart="dragStart(i, $event)"
              @dragover.prevent="dragOver(i, $event)"
              @dragend="dragEnd"
              :class="{ 'drag-over': dragOverIndex === i }"
            >
              <span class="drag-handle" :title="t.dragToReorder">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="19" r="1"></circle>
                  <circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="19" r="1"></circle>
                </svg>
              </span>
              <span class="setlist-item-name" @click="openSetlistSong(s)">{{ s.name }}</span>
              <button class="btn-remove" @click="setlistItems.splice(i,1)" :title="t.remove">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { get, set } from '../idb';

export default {
  name: 'FileExplorer',
  props: {
    // FIX: recibe prop open para la animación CSS — el v-show lo maneja App.vue
    open: {
      type: Boolean,
      default: false
    },
    t: Object
  },
  emits: ['open-file'],
  data() {
    return {
      rootHandle: null,
      files: [],
      setRoot: null,
      setFiles: [],
      setlistItems: [],
      setlistName: '',
      setlistHandle: null,
      // Drag & drop state
      dragIndex: null,
      dragOverIndex: null,
      pendingRoot: null,
      pendingSetRoot: null,
      activeMenu: null
    };
  },
  async mounted() {
    await this.initFromDB();
    document.addEventListener('click', this.closeMenu);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeMenu);
  },
  methods: {
    toggleMenu(name) {
      this.activeMenu = this.activeMenu === name ? null : name;
    },
    closeMenu() {
      this.activeMenu = null;
    },
    async renameFile(file) {
      this.closeMenu();
      const newName = prompt(this.t.renamePrompt, file.name);
      if (!newName || newName === file.name) return;
      
      try {
        if (file.handle.move) {
          try {
            await file.handle.move(newName);
            await this.refreshRoot();
            return;
          } catch(e) { console.warn('Native move not supported or failed', e); }
        }
        
        // Fallback: read -> new file -> write -> delete old
        const oldFile = await file.handle.getFile();
        const data = await oldFile.arrayBuffer();
        const newHandle = await this.rootHandle.getFileHandle(newName, { create: true });
        const writable = await newHandle.createWritable();
        await writable.write(data);
        await writable.close();
        await this.rootHandle.removeEntry(file.name);
        await this.refreshRoot();
      } catch(err) {
        console.error("Error renaming file:", err);
        alert("Could not rename file.");
      }
    },
    async deleteFile(file) {
      this.closeMenu();
      if (!confirm(this.t.deleteConfirm)) return;
      try {
        await this.rootHandle.removeEntry(file.name);
        await this.refreshRoot();
      } catch(err) {
        console.error("Error deleting file:", err);
        alert("Could not delete file.");
      }
    },
    async initFromDB() {
      try {
        const root = await get('rootHandle');
        if (root) {
          if ((await root.queryPermission({ mode: 'readwrite' })) === 'granted') {
            this.rootHandle = root;
            await this.loadDirectory(root);
          } else {
            this.pendingRoot = root;
          }
        }
        const setRoot = await get('setRoot');
        if (setRoot) {
          if ((await setRoot.queryPermission({ mode: 'readwrite' })) === 'granted') {
            this.setRoot = setRoot;
            await this.loadSetDirectory(setRoot);
          } else {
            this.pendingSetRoot = setRoot;
          }
        }
      } catch (err) {
        console.error("Error loading handles from IDB", err);
      }
    },
    async pickRoot() {
      if (this.pendingRoot) {
        if ((await this.pendingRoot.requestPermission({ mode: 'readwrite' })) === 'granted') {
          this.rootHandle = this.pendingRoot;
          this.pendingRoot = null;
          await this.loadDirectory(this.rootHandle);
        }
        return;
      }
      if (!window.showDirectoryPicker) {
        alert('Browser not supported (use Chrome/Edge)');
        return;
      }
      try {
        const dir = await window.showDirectoryPicker();
        this.rootHandle = dir;
        await set('rootHandle', dir);
        await this.loadDirectory(dir);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Error picking root', err);
      }
    },

    async loadDirectory(dir) {
      this.files = [];
      try {
        for await (const [name, handle] of dir.entries()) {
          if (handle.kind === 'file' && (/\.(xml|ost|txt|song)$/i.test(name) || !name.includes('.'))) {
            const meta = await this.readMetadata(handle, name);
            this.files.push({ name, handle, ...meta });
          }
        }
        this.files.sort((a, b) => a.name.localeCompare(b.name));
      } catch (err) {
        console.error("Error loading directory", err);
      }
    },

    async refreshRoot() {
      if (this.rootHandle) {
        await this.loadDirectory(this.rootHandle);
      }
    },

    async pickSetRoot() {
      if (this.pendingSetRoot) {
        if ((await this.pendingSetRoot.requestPermission({ mode: 'readwrite' })) === 'granted') {
          this.setRoot = this.pendingSetRoot;
          this.pendingSetRoot = null;
          await this.loadSetDirectory(this.setRoot);
        }
        return;
      }
      if (!window.showDirectoryPicker) {
        alert('Browser not supported (use Chrome/Edge)');
        return;
      }
      try {
        const dir = await window.showDirectoryPicker();
        this.setRoot = dir;
        await set('setRoot', dir);
        await this.loadSetDirectory(dir);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Error picking setlist root', err);
      }
    },

    async loadSetDirectory(dir) {
      this.setFiles = [];
      try {
        for await (const [name, handle] of dir.entries()) {
          if (handle.kind === 'file' && (/\.(xml|ost|txt|song)$/i.test(name) || !name.includes('.'))) {
            const meta = await this.readMetadata(handle, name);
            this.setFiles.push({ name, handle, ...meta });
          }
        }
      } catch (err) {
        console.error("Error loading set directory", err);
      }
    },

    async readMetadata(handle, name) {
      try {
        const file = await handle.getFile();
        const text = await file.text();
        // Intentar parseo XML
        try {
          const doc = new DOMParser().parseFromString(text, 'application/xml');
          const q = (...names) => {
            for (const n of names) {
              const el = doc.querySelector(n);
              if (el?.textContent?.trim()) return el.textContent.trim();
            }
            return '';
          };
          const title  = q('title', 'songtitle', 'name');
          const artist = q('artist', 'author', 'composer', 'autor');
          if (title || artist) return { title, artist };
        } catch (_) { /* continúa con parseo plano */ }

        // Parseo key:value plano
        const kv = (pat) => {
          const m = text.match(new RegExp(`^\\s*(?:${pat})\\s*[:=]\\s*(.+)$`, 'im'));
          return m?.[1]?.trim() || '';
        };
        const title  = kv('title|titulo|songtitle');
        const artist = kv('artist|composer|autor');
        if (title || artist) return { title, artist };

        // Fallback: primera línea no vacía
        const firstLine = text.split(/\r?\n/).find(l => l.trim());
        return { title: firstLine || name, artist: '' };
      } catch (err) {
        console.error('readMetadata error', err);
        return { title: '', artist: '' };
      }
    },

    openFile(handle) {
      this.$emit('open-file', handle);
    },

    // ── Setlist methods ──

    newSetlist() {
      if (this.setlistItems.length && !confirm(this.t.confirmNewSetlist)) return;
      this.setlistItems = [];
      this.setlistName = '';
      this.setlistHandle = null;
    },

    addSongToSetlist(f) {
      // Evitar duplicados por nombre de archivo
      if (!this.setlistItems.find(si => si.fileName === f.name)) {
        this.setlistItems.push({
          name: f.title || f.name,
          fileName: f.name
        });
      }
    },

    addAllToSetlist() {
      for (const f of this.files) {
        if (!this.setlistItems.find(si => si.fileName === f.name)) {
          this.setlistItems.push({
            name: f.title || f.name,
            fileName: f.name
          });
        }
      }
    },

    openSetlistSong(item) {
      // Try to find the song in loaded files and open it
      const match = this.files.find(f => f.name === item.fileName);
      if (match) {
        this.$emit('open-file', match.handle);
      }
    },

    // ── Build OpenSong XML for setlist ──
    buildSetlistXml(name) {
      const items = this.setlistItems.map(s => {
        const escaped = s.name.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
          .replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const fileEscaped = (s.fileName || s.name).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
          .replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `    <slide_group name="${escaped}" type="song" presentation="" path="${fileEscaped}"/>`;
      }).join('\n');

      const escapedName = name.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

      return `<?xml version="1.0" encoding="UTF-8"?>\n<set name="${escapedName}">\n  <slide_groups>\n${items}\n  </slide_groups>\n</set>`;
    },

    // ── Parse OpenSong XML setlist ──
    parseSetlistXml(text) {
      try {
        const doc = new DOMParser().parseFromString(text, 'application/xml');
        const setEl = doc.querySelector('set');
        const name = setEl?.getAttribute('name') || '';
        const groups = doc.querySelectorAll('slide_group[type="song"]');
        const items = [];
        groups.forEach(g => {
          items.push({
            name: g.getAttribute('name') || '',
            fileName: g.getAttribute('path') || g.getAttribute('name') || ''
          });
        });
        return { name, items };
      } catch (err) {
        console.error('Error parsing setlist XML:', err);
        return null;
      }
    },

    async openSetlist() {
      try {
        // No type filter — OpenSong setlist files have no extension
        const [handle] = await window.showOpenFilePicker();
        const file = await handle.getFile();
        const text = await file.text();
        const parsed = this.parseSetlistXml(text);
        if (!parsed || !parsed.items.length) {
          alert(this.t.errorOpenSetlist);
          return;
        }
        this.setlistItems = parsed.items;
        this.setlistName = parsed.name || handle.name;
        this.setlistHandle = handle;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error opening setlist:', err);
          alert(this.t.errorOpenSetlist);
        }
      }
    },

    async saveSetlist() {
      if (!this.setlistItems.length) {
        alert(this.t.setlistEmpty);
        return;
      }

      try {
        // We removed prompt() to avoid SecurityError since showSaveFilePicker needs user gesture.
        // Save without extension — OpenSong format
        const handle = await window.showSaveFilePicker({
          suggestedName: this.setlistName || this.t.mySetlist
        });
        
        this.setlistName = handle.name;
        const xml = this.buildSetlistXml(this.setlistName);
        
        const writable = await handle.createWritable();
        await writable.write(xml);
        await writable.close();
        this.setlistHandle = handle;
        alert(this.t.setlistSaved);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error saving setlist:', err);
          alert('Error saving setlist');
        }
      }
    },

    // ── Drag & drop reorder ──
    dragStart(index, e) {
      this.dragIndex = index;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index);
    },

    dragOver(index) {
      this.dragOverIndex = index;
    },

    dragEnd() {
      if (this.dragIndex !== null && this.dragOverIndex !== null && this.dragIndex !== this.dragOverIndex) {
        const item = this.setlistItems.splice(this.dragIndex, 1)[0];
        this.setlistItems.splice(this.dragOverIndex, 0, item);
      }
      this.dragIndex = null;
      this.dragOverIndex = null;
    }
  }
};
</script>

<style scoped>
.file-explorer {
  position: fixed;
  top: var(--toolbar-h, 48px);
  left: 0;
  bottom: 0;
  width: 0;
  background: var(--bg2, #111);
  border-right: 1px solid var(--border, #222);
  overflow: hidden;
  z-index: 1150;
  transition: width 280ms ease;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.file-explorer.open {
  width: 320px;
  overflow-x: hidden;
  overflow-y: auto;
}

.explorer-header {
  padding: 12px 14px 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--fg2, #aaa);
  border-bottom: 1px solid var(--border, #222);
  flex-shrink: 0;
}

.section {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border, #222);
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  overflow-x: hidden;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--fg2, #aaa);
}

.btn-full {
  width: 100%;
  text-align: left;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--fg);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-full:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.files-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(50vh - 80px);
  padding-bottom: 60px;
}

.empty {
  font-size: 12px;
  color: var(--fg2, #888);
  padding: 8px 0;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  table-layout: fixed;
}
.file-table th {
  text-align: left;
  padding: 4px 6px;
  color: var(--fg2, #aaa);
  font-weight: 600;
  border-bottom: 1px solid var(--border, #222);
}
.file-table td {
  padding: 8px 6px;
  border-bottom: 1px solid var(--border, #1a1a1a);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Column widths — fixed layout ensures + button is always visible */
.col-title {
  width: 48%;
}
.col-artist {
  width: 38%;
}
.col-add {
  width: 24px;
  text-align: center;
}
.file-table th.col-more,
.file-table td.col-more {
  width: 24px;
  text-align: center;
  position: relative;
  overflow: visible !important;
}

.file-table tbody tr {
  cursor: pointer;
  transition: background 0.1s;
}
.file-table tbody tr:hover {
  background: var(--bg3, #2a2a2a);
}

/* ── Botón agregar individual ── */
.btn-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--accent);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-add:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

/* ── More menu ── */
.more-menu-container {
  position: relative;
  display: inline-block;
}
.btn-more {
  background: transparent;
  border: none;
  color: var(--fg2);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
}
.file-table tbody tr:hover .btn-more,
.btn-more:focus,
.more-menu-container:has(.more-menu) .btn-more {
  opacity: 1;
}
.btn-more:hover {
  background: var(--bg3);
  color: var(--fg);
}
.more-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 4px;
  min-width: 120px;
}
.more-menu button {
  background: transparent;
  border: none;
  color: var(--fg);
  padding: 6px 10px;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}
.more-menu button:hover {
  background: var(--bg2);
}
.more-menu button.danger:hover {
  background: #e05;
  color: #fff;
}

/* ── Setlist ── */
.setlist-controls {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.btn-mini {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--fg2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-mini:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.setlist-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent, #3ca88d);
  padding: 8px 0 4px;
}

.setlist {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.setlist li {
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 6px;
  background: var(--bg3, #2a2a2a);
  cursor: grab;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.setlist li:hover {
  border-color: var(--border);
  background: var(--bg3);
}
.setlist li:active {
  cursor: grabbing;
}
.setlist li.drag-over {
  border-color: var(--accent);
  box-shadow: 0 0 8px rgba(60, 168, 141, 0.2);
}

.drag-handle {
  color: var(--fg2, #666);
  margin-right: 8px;
  display: flex;
  align-items: center;
  cursor: grab;
  user-select: none;
}

.setlist-item-name {
  flex: 1;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.setlist-item-name:hover {
  color: var(--accent, #3ca88d);
}

.btn-remove {
  background: transparent;
  border: none;
  color: var(--fg2, #aaa);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}
.btn-remove:hover { 
  color: #fff; 
  background: #e05; 
}
</style>
