// Enhanced storage commands for testing both localStorage and IndexedDB

Cypress.Commands.add('clearAllStorage', () => {
  cy.clearLocalStorage();
  cy.window().then(async (win) => {
    try {
      // Clear IndexedDB databases - wait for completion
      if ('indexedDB' in win) {
        const databases = await win.indexedDB.databases();
        await Promise.all(
          databases.map(db => {
            return new Promise<void>((resolve, reject) => {
              const deleteReq = win.indexedDB.deleteDatabase(db.name || 'quicktext-storage');
              deleteReq.onsuccess = () => resolve();
              deleteReq.onerror = () => reject(deleteReq.error);
              deleteReq.onblocked = () => {
                // Force close any open connections and retry
                setTimeout(() => resolve(), 100);
              };
            });
          })
        );
      }
    } catch (error) {
      // If databases() isn't supported, try to delete known database
      return new Promise<void>((resolve) => {
        const deleteReq = win.indexedDB.deleteDatabase('quicktext-storage');
        deleteReq.onsuccess = () => resolve();
        deleteReq.onerror = () => resolve(); // Continue even if delete fails
        deleteReq.onblocked = () => {
          setTimeout(() => resolve(), 100);
        };
      });
    }
  });
});

Cypress.Commands.add('setStorageTypeAndWait', (storageType: 'localStorage' | 'indexedDB') => {
  cy.window().then(async (win) => {
    // Set the storage type preference
    win.localStorage.setItem('storageType', storageType);
  });
  
  // If IndexedDB, wait for initialization
  if (storageType === 'indexedDB') {
    cy.window().then(async (win) => {
      // Wait for IndexedDB to be ready by attempting to open the database
      return new Promise<void>((resolve) => {
        const request = win.indexedDB.open('quicktext-storage', 1);
        request.onsuccess = () => {
          request.result.close();
          resolve();
        };
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('data')) {
            db.createObjectStore('data');
          }
          db.close();
          resolve();
        };
        request.onerror = () => {
          // Even if there's an error, continue - the app will handle it
          resolve();
        };
      });
    });
    
    // Add a small additional wait to ensure the app's storage initialization completes
    cy.wait(200);
  }
});

// Type declarations for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      clearAllStorage(): Chainable<void>;
      setStorageTypeAndWait(storageType: 'localStorage' | 'indexedDB'): Chainable<void>;
    }
  }
}