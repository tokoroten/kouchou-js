// filepath: src/workers/csvParser.worker.ts
// CSVパース専用Web Worker
// Phase 2: CSV Parser Worker 実装

// @ts-ignore
importScripts('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js');

import type { WorkerRequest, WorkerResponse, WorkerError, WorkerType } from './workerTypes';

// パース結果型
export interface CsvParseResult {
  data: any[];
  errors: string[]; // PapaParseのエラーは文字列の配列として保持
  fields: string[];
}

const WORKER_TYPE: WorkerType = 'csvParser';

self.onmessage = async (event: MessageEvent<WorkerRequest<string>>) => {
  // 送られてくるデータが csvParser 向けであることを確認
  if (event.data.type !== WORKER_TYPE) {
    // 想定外のtypeの場合はエラーを返すか、何もしない
    console.warn(`[${WORKER_TYPE}] Received message for incorrect worker type: ${event.data.type}`);
    const errorResponse: WorkerResponse<CsvParseResult> = {
      type: WORKER_TYPE, // 自身のタイプを明示
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

  if (!payload) {
    const errorResponse: WorkerResponse<CsvParseResult> = {
      type: WORKER_TYPE,
      payloadId,
      error: {
        message: "CSVデータが提供されていません。",
        name: "DataValidationError",
      },
    };
    self.postMessage(errorResponse);
    return;
  }

  try {
    // @ts-ignore
    const parsed = Papa.parse(payload, { header: true, skipEmptyLines: true });
    
    const result: CsvParseResult = {
      data: parsed.data,
      // PapaParseのエラーオブジェクトは { message: string, code: string, type: string, row: number } の形式を持つことがある
      // ここではシンプルにmessageのみを抽出する
      errors: (parsed.errors as Array<{ message: string }>).map((e) => e.message),
      fields: parsed.meta.fields || [],
    };

    const successResponse: WorkerResponse<CsvParseResult> = {
      type: WORKER_TYPE,
      payloadId,
      result: result, // `payload` ではなく `result` を使用
    };
    self.postMessage(successResponse);

  } catch (e: any) {
    const error: WorkerError = {
      message: e.message || "CSVパース中に不明なエラーが発生しました。",
      name: e.name || "CsvParseError",
      stack: e.stack,
      details: e.toString(), // より詳細なエラー情報
    };
    const errorResponse: WorkerResponse<CsvParseResult> = {
      type: WORKER_TYPE,
      payloadId,
      error,
    };
    self.postMessage(errorResponse);
  }
};
