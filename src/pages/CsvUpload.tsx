import { useRef, useState } from 'react';
import { validateCsv } from '../lib/validateCsv';
import { handleWorkerMessage } from '../lib/workerUtils';
import { useAppStore } from '../store';

export default function CsvUpload() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [validation, setValidation] = useState<any>(null);
  const globalError = useAppStore((s) => s.error);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    // Web Workerでパース
    const worker = new Worker(new URL('../workers/csvParser.worker.ts', import.meta.url));
    handleWorkerMessage(worker, (parsed) => {
      const result = validateCsv(parsed);
      setValidation(result);
    }, 'CSVパース');
    worker.postMessage({ csvText: text });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">CSVアップロード</h2>
      <input type="file" accept=".csv" ref={fileInput} onChange={handleFile} className="mb-4" />
      {globalError && <div className="text-red-500">{globalError}</div>}
      {validation && (
        <div className="mt-4">
          <div className="font-bold">検証結果: {validation.valid ? 'OK' : 'NG'}</div>
          {validation.errors.length > 0 && (
            <ul className="text-red-500">
              {validation.errors.map((e: string, i: number) => <li key={i}>{e}</li>)}
            </ul>
          )}
          <div className="mt-2 text-sm text-gray-600">行数: {validation.stats.rowCount} / カラム数: {validation.stats.columnCount}</div>
          <div className="mt-2">サンプル:</div>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(validation.sample, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
