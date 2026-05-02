<template>
  <div class="SongEditor">
    <textarea
      ref="lyricsTextarea"
      v-model="song.lyrics"
      placeholder="Escribe aquí las letras y acordes.../Write lyrics and chords here... 
Ejemplo:/Example:
[Verse]
.G      C
Línea de acordes arriba/Chord line above
 Letra debajo, no olvides agregar un espacio al principio./Lyrics below, don't forget to add a space at the beginning.

[Chorus]
.D    Em
Acorde del coro/Chorus chord
"
      spellcheck="false"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
      data-ms-editor="false"
    />
  </div>
</template>

<script>
export default {
  name: "SongEditor",
  props: {
    modelValue: Object
  },
  computed: {
    song: {
      get() { return this.modelValue; },
      set(val) { this.$emit("update:modelValue", val); }
    }
  }
};
</script>

<style scoped>
.SongEditor {
  position: fixed;
  top: var(--toolbar-h, 48px);
  /* FIX: se desplaza cuando el explorador está abierto (CSS var inyectada desde App) */
  left: var(--explorer-left, 0px);
  right: 0;
  bottom: 0;
  background: var(--bg, #0d0d0d);
  z-index: 1;
  transition: none !important;
}

.SongEditor textarea {
  width: 100%;
  height: 100%;
  resize: none;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background: var(--bg, #0d0d0d);
  color: var(--fg, #f0f0f0);
  padding: 20px 24px;
  box-sizing: border-box;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.7;
  cursor: auto;
  caret-color: var(--accent, #3ca88d);
}

.SongEditor textarea::placeholder {
  color: var(--fg2, #555);
  font-family: inherit;
}

/* Selección de texto con color del acento */
.SongEditor textarea::selection {
  background: rgba(60, 168, 141, 0.3);
}
</style>
