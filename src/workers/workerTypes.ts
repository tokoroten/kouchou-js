// filepath: src/workers/workerTypes.ts
// Web Worker間の型定義とアーキテクチャ設計

// 各ワーカーの役割
export type WorkerType =
  | 'csvParser'
  | 'opinionProcessor'
  | 'embedding'
  | 'umap'
  | 'clustering';

// 共通メッセージ型
export interface WorkerRequest<T = any> {
  type: WorkerType;
  payload: T;
}

export interface WorkerResponse<T = any> {
  type: WorkerType;
  result?: T;
  error?: string;
}

// 各ワーカーの入出力型例
export interface CsvParserRequest { csvText: string; }
export interface CsvParserResponse {
  data: any[];
  errors: string[];
  fields: string[];
}

// ...今後、opinionProcessor, embedding, umap, clustering用の型を追加...

// アーキテクチャ設計メモ:
// - 各ワーカーは type で識別し、payload/result でデータをやりとり
// - メインスレッドは WorkerRequest/WorkerResponse で統一的に管理
// - IndexedDBとの連携はメインスレッドで行う
// - ワーカーは「小さな責務・疎結合・型安全」を重視
