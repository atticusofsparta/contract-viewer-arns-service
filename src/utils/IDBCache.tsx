import { TransactionCache } from "../types";

export class IDBCache implements TransactionCache {
    private _dbPromise: Promise<IDBDatabase>;
  
    constructor() {
      this._dbPromise = new Promise((resolve, reject) => {
        const openRequest = indexedDB.open('arns-transactions', 1);
  
        openRequest.onupgradeneeded = () => {
          openRequest.result.createObjectStore('cache');
        };
  
        openRequest.onsuccess = () => {
          resolve(openRequest.result);
        };
  
        openRequest.onerror = () => {
          reject(openRequest.error);
        };
      });
    }
  
    async get(key: string) {
      const db = await this._dbPromise;
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('cache', 'readonly');
        const store = transaction.objectStore('cache');
        const request = store.get(key);
  
        request.onsuccess = () => {
          resolve(request.result);
        };
  
        request.onerror = () => {
          reject(request.error);
        };
      });
    }
  
    async set(key: string, value: any) {
      const db = await this._dbPromise;
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('cache', 'readwrite');
        const store = transaction.objectStore('cache');
        const request = store.put(value, key);
  
        request.onsuccess = () => {
          resolve(request.result);
        };
  
        request.onerror = () => {
          reject(request.error);
        };
      });
    }

    async del(key: string) {
        const db = await this._dbPromise;
        return new Promise((resolve, reject) => {
          const transaction = db.transaction('cache', 'readwrite');
          const store = transaction.objectStore('cache');
          const request = store.delete(key);
    
          request.onsuccess = () => {
            resolve(request.result);
          };
    
          request.onerror = () => {
            reject(request.error);
          };
        });
      }
    
      async push(key: string, value: any) {
        const db = await this._dbPromise;
        const transaction = db.transaction('cache', 'readwrite');
        const store = transaction.objectStore('cache');
        
        return new Promise(async (resolve, reject) => {
          const current = await this.get(key);
          const data = Array.isArray(current) ? current : [];
    
          data.push(value);
          const request = store.put(data, key);
    
          request.onsuccess = () => {
            resolve(request.result);
          };
    
          request.onerror = () => {
            reject(request.error);
          };
        });
      }
  }
  