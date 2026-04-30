export function get(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('songeditorweb-db', 1);
    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore('keyval');
    };
    request.onsuccess = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('keyval')) {
        // Upgrade failed or old DB, just resolve undefined
        resolve(undefined);
        return;
      }
      const transaction = db.transaction('keyval', 'readonly');
      const store = transaction.objectStore('keyval');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    };
    request.onerror = () => reject(request.error);
  });
}

export function set(key, val) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('songeditorweb-db', 1);
    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore('keyval');
    };
    request.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction('keyval', 'readwrite');
      const store = transaction.objectStore('keyval');
      const req = store.put(val, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    };
    request.onerror = () => reject(request.error);
  });
}
