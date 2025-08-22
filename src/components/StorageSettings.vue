<template>
  <div class="storage-settings">
    <h3>Storage Settings</h3>

    <div class="storage-info" v-if="storageInfo">
      <div class="info-row">
        <span class="label">Current Storage:</span>
        <span class="value">{{ formatStorageType(storageInfo.type) }}</span>
      </div>

      <div class="info-row" v-if="storageInfo.usage.total > 0">
        <span class="label">Usage:</span>
        <span class="value">
          {{ formatBytes(storageInfo.usage.used) }} /
          {{ formatBytes(storageInfo.usage.total) }} ({{
            storageInfo.percentUsed.toFixed(1)
          }}%)
        </span>
      </div>

      <div class="storage-bar" v-if="storageInfo.usage.total > 0">
        <div
          class="storage-bar-fill"
          :style="{ width: `${storageInfo.percentUsed}%` }"
          :class="{
            warning: storageInfo.percentUsed > 75,
            danger: storageInfo.percentUsed > 90
          }"
        ></div>
      </div>
    </div>

    <div class="storage-type-selector">
      <label for="storage-type">Storage Type:</label>
      <select
        id="storage-type"
        v-model="selectedStorageType"
        :disabled="isChangingStorage"
        @change="handleStorageTypeChange"
      >
        <option :value="StorageType.LOCAL_STORAGE">
          Local Storage (5-10MB limit)
        </option>
        <option :value="StorageType.INDEXED_DB">IndexedDB (Unlimited*)</option>
      </select>
    </div>

    <div v-if="isChangingStorage" class="status-message info">
      <span class="spinner"></span>
      Migrating data to {{ formatStorageType(selectedStorageType) }}...
    </div>

    <div v-if="storageChangeError" class="status-message error">
      Error: {{ storageChangeError }}
    </div>

    <div class="storage-actions" v-if="showClearButton">
      <button
        @click="clearAllData"
        :disabled="isChangingStorage"
        class="clear-btn"
      >
        Clear All Data
      </button>
    </div>

    <div class="storage-notes">
      <h4>Notes:</h4>
      <ul>
        <li>
          <strong>Local Storage:</strong> Fast but limited to 5-10MB. Best for
          small datasets.
        </li>
        <li>
          <strong>IndexedDB:</strong> Virtually unlimited storage. Best for
          large datasets or many templates.
        </li>
        <li>Data is automatically migrated when switching storage types.</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useSettingsStore } from '../stores/settingsStore';
import { StorageType } from '../storage/types';

const settingsStore = useSettingsStore();

const selectedStorageType = ref(settingsStore.storageType);
interface StorageInfo {
  type: StorageType;
  usage: {
    used: number;
    total: number;
  };
  percentUsed: number;
}

const storageInfo = ref<StorageInfo | null>(null);
const showClearButton = ref(false);

const isChangingStorage = computed(() => settingsStore.isChangingStorage);
const storageChangeError = computed(() => settingsStore.storageChangeError);

async function loadStorageInfo() {
  storageInfo.value = await settingsStore.getStorageInfo();
}

async function handleStorageTypeChange() {
  if (selectedStorageType.value !== settingsStore.storageType) {
    const confirmed = confirm(
      `Are you sure you want to switch to ${formatStorageType(selectedStorageType.value)}? ` +
        'Your data will be migrated automatically.'
    );

    if (confirmed) {
      try {
        await settingsStore.changeStorageType(selectedStorageType.value);
        await loadStorageInfo();
      } catch {
        // Error is handled in the store and displayed in the UI
        selectedStorageType.value = settingsStore.storageType;
      }
    } else {
      selectedStorageType.value = settingsStore.storageType;
    }
  }
}


async function clearAllData() {
  const confirmed = confirm(
    'Are you sure you want to clear all data? This action cannot be undone.'
  );

  if (confirmed) {
    const storageManager = settingsStore.getStorageManager();
    await storageManager.clear();
    window.location.reload();
  }
}

function formatStorageType(type: StorageType): string {
  switch (type) {
    case StorageType.LOCAL_STORAGE:
      return 'Local Storage';
    case StorageType.INDEXED_DB:
      return 'IndexedDB';
    default:
      return type;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

watch(
  () => settingsStore.storageType,
  newType => {
    selectedStorageType.value = newType;
    loadStorageInfo();
  }
);

onMounted(async () => {
  await loadStorageInfo();
});
</script>

<style scoped>
.storage-settings {
  padding: 1rem;
  max-width: 100%;
}

.storage-settings h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--accent);
}

.storage-info {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.info-row .label {
  font-weight: 500;
  color: var(--text-secondary);
}

.info-row .value {
  color: var(--text-primary);
}

.storage-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.storage-bar-fill {
  height: 100%;
  background: var(--accent);
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}

.storage-bar-fill.warning {
  background: #ff9800;
}

.storage-bar-fill.danger {
  background: #f44336;
}

.storage-type-selector {
  margin-bottom: 1rem;
}

.storage-type-selector label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.storage-type-selector select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--background);
  color: var(--text-primary);
  font-size: 1rem;
}

.storage-type-selector select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-message {
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-message.info {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.status-message.error {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.storage-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.storage-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.storage-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn {
  background: #f44336;
  color: white;
}

.storage-notes {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 1rem;
}

.storage-notes h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.storage-notes ul {
  margin: 0;
  padding-left: 1.5rem;
}

.storage-notes li {
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.storage-notes li strong {
  color: var(--text-primary);
}
</style>
