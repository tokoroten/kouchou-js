import { useRef, useState } from 'react';
import { validateCsv } from '../lib/validateCsv';

export default function CsvUpload() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState('');
  const [validation, setValidation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCsvText(text);
    // Web Workerでパース
    const worker = new Worker(new URL('../workers/csvParser.worker.ts', import.meta.url));
    worker.onmessage = (ev) => {
      if (ev.data.result) {
        const result = validateCsv(ev.data.result);
        setValidation(result);
        setError(null);
      } else if (ev.data.error) {
        setError(ev.data.error);
      }
      worker.terminate();
    };
    worker.postMessage({ csvText: text });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">CSVアップロード</h2>
      <input type="file" accept=".csv" ref={fileInput} onChange={handleFile} className="mb-4" />
      {error && <div className="text-red-500">{error}</div>}
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
