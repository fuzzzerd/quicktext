import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { StorageManager } from '../storage/StorageManager';
import { StorageType } from '../storage/types';

export const useSettingsStore = defineStore('settingsStore', () => {
  // Initialize storage manager with saved preference or auto-detect
  const savedStorageTypeRaw = localStorage.getItem('storageType');
  let savedStorageType: StorageType | null = null;
  
  // Handle both raw string and JSON formatted storage type
  if (savedStorageTypeRaw) {
    try {
      // Try to parse as JSON first
      savedStorageType = JSON.parse(savedStorageTypeRaw) as StorageType;
    } catch {
      // If not JSON, use as raw string
      savedStorageType = savedStorageTypeRaw as StorageType;
    }
  }
  
  const initialStorageType = savedStorageType || StorageType.LOCAL_STORAGE;

  const storageManager = new StorageManager(initialStorageType);
  const storageType = ref<StorageType>(initialStorageType);
  const isChangingStorage = ref(false);
  const storageChangeError = ref<string | null>(null);

  // Watch for storage type changes
  watch(storageType, async newType => {
    if (newType !== storageManager.getCurrentType()) {
      await changeStorageType(newType);
    }
  });

  async function changeStorageType(newType: StorageType) {
    isChangingStorage.value = true;
    storageChangeError.value = null;

    try {
      await storageManager.switchStorage(newType);
      localStorage.setItem('storageType', newType);
    } catch (error) {
      storageChangeError.value =
        error instanceof Error ? error.message : 'Failed to switch storage';
      // Revert to previous storage type on error
      storageType.value = storageManager.getCurrentType();
      throw error;
    } finally {
      isChangingStorage.value = false;
    }
  }

  function getStorageManager() {
    return storageManager;
  }

  async function getStorageInfo() {
    const currentType = storageManager.getCurrentType();
    let usage = { used: 0, total: 0 };

    if (currentType === StorageType.LOCAL_STORAGE) {
      // Estimate localStorage usage
      let used = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          used += (key.length + (localStorage.getItem(key) || '').length) * 2; // UTF-16 encoding
        }
      }
      // Most browsers have a 5-10MB limit for localStorage
      usage = {
        used,
        total: 5 * 1024 * 1024 // 5MB estimate
      };
    } else if (
      currentType === StorageType.INDEXED_DB &&
      'storage' in navigator &&
      'estimate' in navigator.storage
    ) {
      // Get IndexedDB storage estimate
      const estimate = await navigator.storage.estimate();
      usage = {
        used: estimate.usage || 0,
        total: estimate.quota || 0
      };
    }

    return {
      type: currentType,
      usage,
      percentUsed: usage.total > 0 ? (usage.used / usage.total) * 100 : 0
    };
  }

  return {
    storageType,
    isChangingStorage,
    storageChangeError,
    changeStorageType,
    getStorageManager,
    getStorageInfo
  };
});
