// filepath: src/lib/workerUtils.ts
// Web Workerの共通エラーハンドリングユーティリティ
import { useAppStore } from '../store';
import type { WorkerResponse, WorkerType } from '../workers/workerTypes';

/**
 * Workerからのメッセージを受けてエラーならZustandに通知する共通関数
 * @param worker Web Workerインスタンス
 * @param onSuccess 成功時コールバック
 * @param context エラー時に付加する文脈（例: 'CSVパース', 'UMAP次元削減'など）
 */
export function handleWorkerMessage<T = any>(
  worker: Worker,
  onSuccess: (result: T) => void,
  context: string
) {
  worker.onmessage = (ev: MessageEvent<WorkerResponse<T>>) => {
    if (ev.data.error) {
      useAppStore.getState().setError(`[${context}] ${ev.data.error}`);
    } else if (ev.data.result !== undefined) {
      onSuccess(ev.data.result);
      useAppStore.getState().setError(null); // 成功時はエラー解除
    }
    worker.terminate();
  };
}
