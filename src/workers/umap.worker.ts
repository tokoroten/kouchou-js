// filepath: src/workers/umap.worker.ts
// UMAP-js Worker
import type { WorkerRequest, WorkerResponse } from './workerTypes';
import { UMAP } from 'umap-js';

self.onmessage = (event) => {
  const req = event.data as WorkerRequest<{ vectors: number[][]; params?: any }>;
  try {
    const { vectors, params } = req.payload;
    const umap = new UMAP(params);
    const embedding = umap.fit(vectors);
    const result: WorkerResponse = {
      type: 'umap',
      result: embedding,
    };
    self.postMessage(result);
  } catch (e) {
    const error: WorkerResponse = {
      type: 'umap',
      error: String(e),
    };
    self.postMessage(error);
  }
};
