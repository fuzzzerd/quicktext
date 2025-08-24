import type { StorageAdapter } from './types';

export class IndexedDBAdapter implements StorageAdapter {
  private dbName = 'quicktext-storage';
  private storeName = 'data';
  private version = 2; // Increment version to force upgrade
  private db: IDBDatabase | null = null;

  private async openDB(): Promise<IDBDatabase> {
    // Always close existing connection before opening new one
    if (this.db) {
      this.db.close();
      this.db = null;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        // Check if object store exists, if not we need to recreate the database
        if (!this.db.objectStoreNames.contains(this.storeName)) {
          this.db.close();
          this.db = null;
          // Delete and recreate the database
          const deleteReq = indexedDB.deleteDatabase(this.dbName);
          deleteReq.onsuccess = () => {
            // Retry opening the database
            this.openDB().then(resolve).catch(reject);
          };
          deleteReq.onerror = () => reject(deleteReq.error);
        } else {
          resolve(this.db);
        }
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result !== undefined ? result : null);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async set<T>(key: string, value: T): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      // Convert to plain object to avoid proxy cloning issues
      const plainValue = JSON.parse(JSON.stringify(value));
      const request = store.put(plainValue, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async remove(key: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        // Close the database connection after clearing to ensure fresh state
        if (this.db) {
          this.db.close();
          this.db = null;
        }
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(): Promise<Record<string, unknown>> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.openCursor();
      const results: Record<string, unknown> = {};

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          results[cursor.key as string] = cursor.value;
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
}
