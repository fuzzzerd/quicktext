import { LocalStorageAdapter } from './LocalStorageAdapter';
import { IndexedDBAdapter } from './IndexedDBAdapter';
import { StorageType, type StorageAdapter, type StorageData } from './types';

export class StorageManager {
  private adapter: StorageAdapter;
  private currentType: StorageType;

  constructor(type: StorageType = StorageType.LOCAL_STORAGE) {
    this.currentType = type;
    this.adapter = this.createAdapter(type);
  }

  private createAdapter(type: StorageType): StorageAdapter {
    switch (type) {
      case StorageType.INDEXED_DB:
        return new IndexedDBAdapter();
      case StorageType.LOCAL_STORAGE:
      default:
        return new LocalStorageAdapter();
    }
  }

  async switchStorage(newType: StorageType): Promise<void> {
    if (newType === this.currentType) {
      return;
    }

    // Migrate data from current storage to new storage
    const data = await this.getAllData();

    // Create new adapter
    const newAdapter = this.createAdapter(newType);

    // Write data to new storage (ensure plain objects)
    for (const [key, value] of Object.entries(data)) {
      // Convert to plain object to ensure compatibility
      const plainValue = JSON.parse(JSON.stringify(value));
      await newAdapter.set(key, plainValue);
    }

    // Keep reference to old adapter for cleanup
    const oldAdapter = this.adapter;

    // Switch to new adapter
    this.adapter = newAdapter;
    this.currentType = newType;

    // Clear old storage after successful migration
    // This frees up space and prevents confusion with stale data
    try {
      await oldAdapter.clear();
    } catch (error) {
      console.warn('Failed to clear old storage after migration:', error);
      // Non-critical error, continue anyway
    }

    // Note: storageType preference is saved in localStorage by the settingsStore
    // We don't save it in the adapter to avoid migration issues
  }

  async getAllData(): Promise<StorageData> {
    const allData = await this.adapter.getAll();
    return {
      quickTexts: (allData.quickTexts as unknown[]) || [],
      categories: (allData.categories as unknown[]) || [],
      activeCategoryId: (allData.activeCategoryId as number | null) || null
    };
  }

  async migrateFromLocalStorage(): Promise<void> {
    if (this.currentType === StorageType.LOCAL_STORAGE) {
      return;
    }

    const localAdapter = new LocalStorageAdapter();
    const data = await localAdapter.getAll();

    for (const [key, value] of Object.entries(data)) {
      await this.adapter.set(key, value);
    }
  }

  getCurrentType(): StorageType {
    return this.currentType;
  }

  getAdapter(): StorageAdapter {
    return this.adapter;
  }

  async get<T>(key: string): Promise<T | null> {
    return this.adapter.get<T>(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    return this.adapter.set(key, value);
  }

  async remove(key: string): Promise<void> {
    return this.adapter.remove(key);
  }

  async clear(): Promise<void> {
    return this.adapter.clear();
  }
}
