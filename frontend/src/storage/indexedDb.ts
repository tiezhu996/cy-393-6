import type { MindMapFile } from "../types/mindmap";

const DB_NAME = "mindmap-editor-db";
const STORE = "files";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadFiles(): Promise<MindMapFile[]> {
  const db = await openDb();
  return new Promise((resolve) => {
    const req = db.transaction(STORE).objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as MindMapFile[]);
  });
}

export async function saveFile(file: MindMapFile) {
  const db = await openDb();
  db.transaction(STORE, "readwrite").objectStore(STORE).put(file);
}

export async function deleteFile(id: string) {
  const db = await openDb();
  db.transaction(STORE, "readwrite").objectStore(STORE).delete(id);
}
