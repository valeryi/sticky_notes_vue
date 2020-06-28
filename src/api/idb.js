const DBVersion = 2;
let DB = null;
const storages = ['notes', 'history', 'cursor'];
const dbName = 'main';

export default {

    async getDB() {
        return new Promise(async (resolve, reject) => {
            if (DB) return resolve(DB);

            let request = window.indexedDB.open(dbName, DBVersion);

            request.onerror = e => {
                console.error('Error opening IndexedDB', e);
                reject(e);
            };

            request.onsuccess = e => {
                DB = e.target.result;
                resolve(DB);
            };

            request.onupgradeneeded = e => {
                let db = e.target.result;

                for (let i = 0; i < storages.length; i++) {
                    const store = storages[i];
                    db.createObjectStore(store, { autoIncrement: true, keyPath: 'id' });
                }

            };

        })
    },

    async get(storageName) {
        let db = await this.getDB();
        return new Promise(resolve => {
            let trans = db.transaction([storageName], 'readonly');
            trans.oncomplete = _ => {
                resolve(result);
            };

            let store = trans.objectStore(storageName);
            let result = [];

            store.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if (cursor) {
                    result.push(cursor.value);
                    cursor.continue();
                }
            };

        });
    },

    async delete(note, storageName) {
        const db = await this.getDB(storageName);
        return new Promise(resolve => {
            const trans = db.transaction([storageName], 'readwrite');
            trans.oncomplete = e => {
                resolve(e);
            }
            const store = trans.objectStore(storageName);
            store.delete(note.id);
        })
    },

    async update(item, storageName) {
        let db = await this.getDB(storageName);
        return new Promise(async (resolve) => {
            let trans = db.transaction([storageName], 'readwrite');
            trans.oncomplete = _ => {
                resolve({ ...item, id: req.result });
            }

            let store = trans.objectStore(storageName);
            const req = await store.put(item);
        })
    },

    async save(item, storageName) {
        let db = await this.getDB(storageName)
        return new Promise(async (resolve) => {
            let trans = db.transaction([storageName], 'readwrite')
            trans.oncomplete = _ => {
                resolve({ ...item, id: req.result });
            }

            let store = trans.objectStore(storageName)
            const req = await store.add(item);
        })
    },

    async clear(storageName) {
        const db = await this.getDB(storageName)
        return new Promise(resolve => {
            const trans = db.transaction([storageName], 'readwrite')
            trans.oncomplete = e => {
                resolve(e)
            }
            const store = trans.objectStore(storageName)
            store.clear();
        })
    },
};