<template>
  <header class="toolbar">
    <div class="toolbar-left">
      <button class="btn-icon" @click="$emit('toggle-explorer')" :title="t.explorer">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
      <div class="app-brand">
        <span class="brand-text">SongEditor<span>Web</span></span>
      </div>
    </div>

    <div class="toolbar-center">
      <div class="button-group">
        <button class="btn-icon" @click="$emit('nuevo-archivo')" :title="t.new">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </button>
        <button class="btn-icon" @click="$emit('abrir-archivo')" :title="t.open">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            <path d="M12 11v6"></path>
            <path d="M9 14h6"></path>
          </svg>
        </button>
        <button class="btn-icon" @click="$emit('guardar-archivo')" :title="t.save">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
        </button>
        <button class="btn-icon" @click="$emit('guardar-como')" :title="t.saveAs">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>

      <div class="separator-v"></div>

      <div class="button-group">
        <button class="btn-icon" @click="$emit('edit-metadata')" :title="t.metadata">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        </button>
        <button class="btn-icon" @click="$emit('convert-to-opensong')" :title="t.convert">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
            <path d="M5 3v4"></path>
            <path d="M3 5h4"></path>
          </svg>
        </button>
      </div>

      <div class="separator-v"></div>

      <div class="button-group">
        <button class="btn-icon" @click="$emit('transpose-down')" :title="t.transposeDown">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button class="btn-icon" @click="$emit('transpose-up')" :title="t.transposeUp">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      <div class="separator-v"></div>

      <div class="button-group">
        <button class="btn-icon" @click="$emit('toggle-shortcuts')" :title="t.shortcuts">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
            <line x1="6" y1="8" x2="6" y2="8"></line>
            <line x1="10" y1="8" x2="10" y2="8"></line>
            <line x1="14" y1="8" x2="14" y2="8"></line>
            <line x1="18" y1="8" x2="18" y2="8"></line>
            <line x1="7" y1="16" x2="17" y2="16"></line>
          </svg>
        </button>
        <button class="btn-icon" @click="$emit('open-help')" :title="t.help">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>
        <button class="btn-icon" @click="$emit('toggle-lang')" :title="t.language">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span class="lang-code">{{ lang === 'es' ? 'ES' : 'EN' }}</span>
        </button>
        <button
          class="btn-icon btn-theme"
          @click="$emit('toggle-theme')"
          :title="t.theme"
        >
          <svg v-if="modo === 'dark'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="toolbar-right">
      <button class="btn-icon" @click="$emit('toggle-preview')" :title="t.preview">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: "MainToolbar",
  props: {
    modo: String,
    lang: String,
    t: Object
  },
  emits: [
    'toggle-explorer',
    'toggle-preview',
    'open-help',
    'edit-metadata',
    'toggle-shortcuts',
    'nuevo-archivo',
    'abrir-archivo',
    'guardar-archivo',
    'guardar-como',
    'toggle-theme',
    'transpose-up',
    'transpose-down',
    'convert-to-opensong',
    'toggle-lang'
  ]
};
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: var(--toolbar-h, 48px);
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-center {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg);
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.button-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.app-brand {
  margin-left: 8px;
  user-select: none;
}

.brand-text {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--fg);
}

.brand-text span {
  color: var(--accent);
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--fg2);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.btn-icon:hover {
  background: var(--accent);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(60, 168, 141, 0.2);
}

.btn-icon:active {
  transform: translateY(0);
}

.lang-code {
  position: absolute;
  bottom: -2px;
  right: -2px;
  font-size: 7px;
  font-weight: 900;
  background: var(--bg3);
  color: var(--fg);
  padding: 1px 2px;
  border-radius: 2px;
  border: 1px solid var(--border);
  line-height: 1;
}

.btn-icon:hover .lang-code {
  background: #fff;
  color: var(--accent);
  border-color: #fff;
}

.separator-v {
  width: 1px;
  height: 18px;
  background: var(--border);
  margin: 0 4px;
}

@media (max-width: 900px) {
  .brand-text { display: none; }
}
</style>
