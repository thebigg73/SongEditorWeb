<template>
  <div v-if="show" class="modal-overlay" @click.self="cancel">
    <div class="modal osa-modal">
      <div class="modal-icon-header">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
          <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20" stroke-width="3" stroke-linecap="round"></line>
        </svg>
        <h3>{{ t.osaSettingsTitle }}</h3>
        <span class="alpha-badge">ALPHA</span>
      </div>

      <div class="modal-body">
        <label class="input-group">
          <span class="label-text">{{ t.osaIpPlaceholder }}</span>
          <div class="input-wrapper">
            <input 
              v-model="endpoint" 
              placeholder="192.168.1.XX:8080" 
              @keyup.enter="save"
              ref="ipInput"
            />
          </div>
        </label>

        <div class="warning-box alpha-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            <strong>{{ t.osaAlphaWarning }}</strong>
            <p>{{ t.osaAlphaDesc }}</p>
          </div>
        </div>

        <div class="warning-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <p>{{ t.osaMixedContentWarning }}</p>
        </div>
      </div>

      <div class="modal-buttons">
        <button @click="cancel" class="btn-ghost">{{ t.osaCancel }}</button>
        <button @click="save" class="btn-primary">{{ t.osaSave }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OsaSettingsModal",
  props: {
    show: Boolean,
    t: Object,
    initialEndpoint: String,
  },
  data() {
    return {
      endpoint: this.initialEndpoint || "",
    };
  },
  methods: {
    save() {
      this.$emit("save", this.endpoint);
    },
    cancel() {
      this.$emit("cancel");
    },
  },
  watch: {
    initialEndpoint(newVal) {
      this.endpoint = newVal;
    },
    show(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.ipInput?.focus();
        });
      }
    }
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.osa-modal {
  background: var(--bg2);
  border: 1px solid var(--border);
  padding: 24px;
  border-radius: 16px;
  width: 400px;
  max-width: 90vw;
  color: var(--fg);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-icon-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--accent);
}

.modal-icon-header h3 {
  font-size: 18px;
  font-weight: 700;
}

.alpha-badge {
  background: #ff4757;
  color: white;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label-text {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--fg2);
  letter-spacing: 0.05em;
}

.input-wrapper input {
  width: 100%;
  background: var(--bg3);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  transition: all 0.2s;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(60, 168, 141, 0.2);
}

.warning-box {
  display: flex;
  gap: 12px;
  background: rgba(255, 177, 0, 0.1);
  border: 1px solid rgba(255, 177, 0, 0.3);
  padding: 12px;
  border-radius: 8px;
  color: #ffb100;
}

.warning-box p {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.warning-box svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.alpha-box {
  background: rgba(255, 71, 87, 0.1);
  border-color: rgba(255, 71, 87, 0.3);
  color: #ff4757;
}

.alpha-box strong {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-ghost {
  background: transparent;
  color: var(--fg2);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-ghost:hover {
  background: var(--bg3);
  color: var(--fg);
}
</style>
