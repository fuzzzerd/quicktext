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

  async exportData(): Promise<string> {
    const data = await this.getAllData();
    
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      storageType: this.currentType,
      data: data
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  async importData(jsonData: string, mode: 'replace' | 'append' = 'replace'): Promise<void> {
    const importData = JSON.parse(jsonData);
    
    // Validate the import data structure
    if (!importData.data || typeof importData.data !== 'object') {
      throw new Error('Invalid backup file format');
    }
    
    const { quickTexts, categories, activeCategoryId } = importData.data;
    
    if (!Array.isArray(quickTexts) || !Array.isArray(categories)) {
      throw new Error('Invalid backup file format: missing required data');
    }
    
    if (mode === 'replace') {
      // Clear existing data first
      await this.clear();
      
      // Import the data
      await this.set('quickTexts', quickTexts);
      await this.set('categories', categories);
      if (activeCategoryId !== undefined) {
        await this.set('activeCategoryId', activeCategoryId);
      }
    } else {
      // Append mode - merge with existing data
      const existingData = await this.getAllData();
      
      // Merge quickTexts - add timestamp to IDs to avoid conflicts
      const timestamp = Date.now();
      const mergedQuickTexts = [
        ...(existingData.quickTexts || []),
        ...quickTexts.map((qt: unknown) => {
          const quickText = qt as { id: number; [key: string]: unknown };
          return {
            ...quickText,
            id: quickText.id + timestamp // Ensure unique IDs
          };
        })
      ];
      
      // Merge categories - add timestamp to IDs to avoid conflicts
      const mergedCategories = [
        ...(existingData.categories || []),
        ...categories.map((cat: unknown) => {
          const category = cat as { id: number; sortOrder: number; [key: string]: unknown };
          return {
            ...category,
            id: category.id + timestamp, // Ensure unique IDs
            sortOrder: (existingData.categories?.length || 0) + category.sortOrder
          };
        })
      ];
      
      // Update quickTexts with new category IDs if they have categories
      const updatedQuickTexts = mergedQuickTexts.map((qt: unknown) => {
        const quickText = qt as { id: number; categoryIds?: number[]; [key: string]: unknown };
        if (quickText.categoryIds && quickText.id >= timestamp) {
          return {
            ...quickText,
            categoryIds: quickText.categoryIds.map((id: number) => id + timestamp)
          };
        }
        return quickText;
      });
      
      await this.set('quickTexts', updatedQuickTexts);
      await this.set('categories', mergedCategories);
    }
  }
}
