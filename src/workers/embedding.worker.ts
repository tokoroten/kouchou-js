// filepath: src/workers/embedding.worker.ts
// エンベディング Worker（Sentence Transformers）
import type { WorkerRequest, WorkerResponse } from './workerTypes';
import { pipeline } from '@tuesdaycrowd/sentence-transformers';

let embedder: any = null;

async function ensureEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

self.onmessage = async (event) => {
  const req = event.data as WorkerRequest<{ texts: string[] }>;
  try {
    const embedder = await ensureEmbedder();
    const vectors = await embedder(req.payload.texts);
    const result: WorkerResponse = {
      type: 'embedding',
      result: vectors,
    };
    self.postMessage(result);
  } catch (e) {
    const error: WorkerResponse = {
      type: 'embedding',
      error: String(e),
    };
    self.postMessage(error);
  }
};
