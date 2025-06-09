// filepath: src/workers/summary.worker.ts
// 要約生成 Worker（Gemini Nano）
import type { WorkerRequest, WorkerResponse } from './workerTypes';
import { runGeminiNanoPrompt } from '../lib/geminiNanoClient';

self.onmessage = async (event) => {
  const req = event.data as WorkerRequest<{ texts: string[] }>;
  try {
    const prompt = `次の意見群を要約してください: ${req.payload.texts.join('\n')}`;
    const summary = await runGeminiNanoPrompt(prompt);
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
