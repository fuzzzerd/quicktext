export enum StorageType {
  LOCAL_STORAGE = 'localStorage',
  INDEXED_DB = 'indexedDB'
}

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  getAll(): Promise<Record<string, unknown>>;
}

export interface StorageData {
  quickTexts: unknown[];
  categories: unknown[];
  activeCategoryId: number | null;
}

export interface StorageSettings {
  storageType: StorageType;
}
