// filepath: src/workers/embedding.worker.ts
// エンベディング Worker（Sentence Transformers）
import type { WorkerRequest, WorkerResponse, WorkerError, WorkerType } from './workerTypes';
// @ts-ignore
import { pipeline } from '@tuesdaycrowd/sentence-transformers';

let embedder: any = null;
const WORKER_TYPE: WorkerType = 'embedding';

async function ensureEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

self.onmessage = async (event: MessageEvent<WorkerRequest<{ texts: string[] }>>) => {
  if (event.data.type !== WORKER_TYPE) {
    console.warn(`[${WORKER_TYPE}] Received message for incorrect worker type: ${event.data.type}`);
    const errorResponse: WorkerResponse<any> = {
      type: WORKER_TYPE,
      payloadId: event.data.payloadId,
      error: {
        message: `Incorrect worker type. Expected ${WORKER_TYPE}, got ${event.data.type}`,
        name: "WorkerTypeError",
      },
    };
    self.postMessage(errorResponse);
    return;
  }

  const { payload, payloadId } = event.data;

  if (!payload || !payload.texts) {
    const errorResponse: WorkerResponse<any> = {
      type: WORKER_TYPE,
      payloadId,
      error: {
        message: "テキストデータが提供されていません。",
        name: "DataValidationError",
      },
    };
    self.postMessage(errorResponse);
    return;
  }

  try {
    const embedderInstance = await ensureEmbedder();
    // @ts-ignore
    const vectors = await embedderInstance(payload.texts, { pooling: 'mean', normalize: true });
    
    const successResponse: WorkerResponse<any> = { // `any` は適切な型に置き換えるべき
      type: WORKER_TYPE,
      payloadId,
      result: vectors.tolist(), // Xenova/all-MiniLM-L6-v2 の出力は Tensor なので tolist() で配列に変換
    };
    self.postMessage(successResponse);

  } catch (e: any) {
    const error: WorkerError = {
      message: e.message || "エンベディング処理中に不明なエラーが発生しました。",
      name: e.name || "EmbeddingError",
      stack: e.stack,
      details: e.toString(),
    };
    const errorResponse: WorkerResponse<any> = {
      type: WORKER_TYPE,
      payloadId,
      error,
    };
    self.postMessage(errorResponse);
  }
};
