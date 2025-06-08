// filepath: src/workers/csvParser.worker.ts
// CSVパース専用Web Worker
// Phase 2: CSV Parser Worker 実装

// @ts-ignore
importScripts('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js');

// パース結果型
export interface CsvParseResult {
  data: any[];
  errors: string[];
  fields: string[];
}

self.onmessage = async (event) => {
  const { csvText } = event.data;
  try {
    // @ts-ignore
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const result = {
      data: parsed.data,
      errors: (parsed.errors as Array<{ message: string }>).map((e) => e.message),
      fields: parsed.meta.fields || [],
    };
    self.postMessage({ result });
  } catch (e) {
    self.postMessage({ error: String(e) });
  }
};
