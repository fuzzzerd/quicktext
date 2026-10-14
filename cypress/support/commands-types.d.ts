export {};

declare global {
  namespace Cypress {
    interface Chainable {
      clearAllStorage(): Chainable<void>;
      setStorageTypeAndWait(storageType: 'localStorage' | 'indexedDB'): Chainable<void>;
    }
  }
}
