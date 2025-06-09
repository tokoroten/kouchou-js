// filepath: src/workers/opinionProcessor.worker.ts
// 意見成形 Worker（Gemini Nano）
import type { WorkerRequest, WorkerResponse } from './workerTypes';
import { runGeminiNanoPrompt } from '../lib/geminiNanoClient';

self.onmessage = async (event) => {
  const req = event.data as WorkerRequest<{ text: string }>;
  try {
    // Gemini Nanoで意見の正規化・分割
    const prompt = `次の市民意見を丁寧語に変換し、個人情報を除去し、必要に応じて文を分割してください: ${req.payload.text}`;
    const resultText = await runGeminiNanoPrompt(prompt);
    const result: WorkerResponse = {
      type: 'opinionProcessor',
      result: resultText,
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
