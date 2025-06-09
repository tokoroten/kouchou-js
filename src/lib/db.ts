import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

console.log('db モジュール読み込み');

const DB_NAME = 'KouchouAI-DB';
const DB_VERSION = 1;

// Define the database schema
interface KouchouDBSchema extends DBSchema {
  sessions: {
    key: string; // session UUID
    value: SessionData;
    indexes: { 'createdAt': Date };
  };
  // TODO: Add other object stores as needed (e.g., models, embeddings)
  models: {
    key: string; // model name or ID
    value: any; // Store serialized models (e.g., UMAP model)
  };
  embeddingsCache: {
    key: string; // hash of the opinion text
    value: number[]; // embedding vector
  };
}

// Define data structures (example for SessionData)
export interface SessionData {
  id: string;
  name: string;
  createdAt: Date;
  // Add other session-related data here
  csvData?: any[]; // Raw CSV data (or reference)
  csvColumns?: string[]; // All columns from the CSV
  targetColumn?: string; // Selected column for analysis (opinions)
  attributeColumns?: string[]; // Selected columns for attributes
  processedOpinions?: any[]; // Processed opinions
  embeddings?: number[][]; // Added: Embedding vectors for opinions
  umapModelId?: string; // Reference to a model in the 'models' store
  reducedEmbeddings?: number[][]; // Added: UMAP reduced embeddings
  clusters?: number[]; // Added: Cluster assignments for opinions
  // ... and so on for other stages
}

let dbPromise: Promise<IDBPDatabase<KouchouDBSchema>> | null = null;

type StoreName = 'sessions' | 'models' | 'embeddingsCache';

const getDb = (): Promise<IDBPDatabase<KouchouDBSchema>> => {
  console.log('getDb 呼び出し - DBPromise状態:', dbPromise ? 'キャッシュあり' : 'なし');  if (!dbPromise) {
    console.log('IndexedDBの初期化を開始');
    try {
      dbPromise = openDB<KouchouDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion) {
          console.log(`Upgrading DB from version ${oldVersion} to ${newVersion}`);
          if (oldVersion < 1) {
            const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
            sessionStore.createIndex('createdAt', 'createdAt');

            db.createObjectStore('models', { keyPath: 'key' });
            db.createObjectStore('embeddingsCache', { keyPath: 'key' });
            // TODO: Create other stores and their indexes if necessary
          }
          // Example for future upgrades:
          // if (oldVersion < 2) {
          //   // Perform schema changes for version 2
          // }
        }
      });
    } catch (error) {
      console.error('IndexedDBの初期化エラー:', error);
      throw error;
    }
  }
  return dbPromise;
};

// Generic CRUD operations

export async function idbGet<T extends StoreName>(
  storeName: T,
  key: KouchouDBSchema[T]['key']
): Promise<KouchouDBSchema[T]['value'] | undefined> {
  const db = await getDb();
  return db.get(storeName, key);
}

export async function idbGetAll<T extends StoreName>(
  storeName: T
): Promise<KouchouDBSchema[T]['value'][]> {
  const db = await getDb();
  return db.getAll(storeName);
}

export async function idbPut<T extends StoreName>(
  storeName: T,
  value: KouchouDBSchema[T]['value']
): Promise<KouchouDBSchema[T]['key']> {
  const db = await getDb();
  return db.put(storeName, value);
}

export async function idbDelete<T extends StoreName>(
  storeName: T,
  key: KouchouDBSchema[T]['key']
): Promise<void> {
  const db = await getDb();
  return db.delete(storeName, key);
}

export async function idbClear(storeName: StoreName): Promise<void> {
  const db = await getDb();
  return db.clear(storeName);
}

// Call example usage for testing (optional, remove for production)
// exampleUsage();

console.log('IndexedDB wrapper initialized. デバッグログ出力モードで実行中');
