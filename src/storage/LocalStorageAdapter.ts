import type { StorageAdapter } from './types';

export class LocalStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'QuotaExceededError'
      ) {
        throw new Error(
          'Local storage quota exceeded. Consider switching to IndexedDB storage.'
        );
      }
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    // Only clear our application's data keys, not metadata like storageType
    const appKeys = [
      'quickTexts',
      'categories', 
      'activeCategoryId',
      'settings'
    ];
    
    for (const key of appKeys) {
      localStorage.removeItem(key);
    }
  }

  async getAll(): Promise<Record<string, unknown>> {
    const results: Record<string, unknown> = {};
    // Only get keys that belong to our application
    const appKeys = [
      'quickTexts',
      'categories',
      'activeCategoryId',
      'settings'
    ];

    for (const key of appKeys) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        try {
          results[key] = JSON.parse(value);
        } catch {
          // If parsing fails, skip this key as it's not valid JSON
          // This handles cases where the value might be corrupted
        }
      }
    }
    return results;
  }
}
