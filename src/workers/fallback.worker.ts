// filepath: src/workers/fallback.worker.ts
// フォールバック機能 Worker（ルールベース処理）
import type { WorkerRequest, WorkerResponse } from './workerTypes';

self.onmessage = (event) => {
  const req = event.data as WorkerRequest<{ texts: string[] }>;
  try {
    // ルールベース要約: 先頭3件を連結
    const summary = req.payload.texts.slice(0, 3).join(' / ');
    const result: WorkerResponse = {
      type: 'opinionProcessor',
      result: summary,
    };
    self.postMessage(result);
  } catch (e) {
    const error: WorkerResponse = {
      type: 'opinionProcessor',
      error: { message: String(e) },
    };
    self.postMessage(error);
  }
};
