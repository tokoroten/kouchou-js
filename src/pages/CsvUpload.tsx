import { useRef, useState, useEffect } from 'react';
import { validateCsv } from '../lib/validateCsv';
import { handleWorkerMessage } from '../lib/workerUtils';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';

export default function CsvUpload() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [validation, setValidation] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedTargetColumn, setSelectedTargetColumn] = useState<string>('');
  const [selectedAttributeColumns, setSelectedAttributeColumns] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<any[] | null>(null);
  const navigate = useNavigate();
  
  const globalError = useAppStore((s) => s.error);
  const clearError = useAppStore((s) => s.clearError);
  const setError = useAppStore((s) => s.setError);
  const currentSessionId = useAppStore((s) => s.currentSessionId);
  const updateSession = useAppStore((s) => s.updateSession);
  const createSession = useAppStore((s) => s.createSession);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setValidation(null);
    setFileName(null);
    setSelectedTargetColumn('');
    setSelectedAttributeColumns([]);
    setCsvData(null);
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('CSVファイル形式（.csv）を選択してください。');
      setFileName(file.name + ' (無効な形式)');
      if (fileInput.current) fileInput.current.value = ''; // Reset file input
      return;
    }

    setFileName(file.name);
    const text = await file.text();
    const worker = new Worker(new URL('../workers/csvParser.worker.ts', import.meta.url));
    handleWorkerMessage(
      worker,
      (parsed) => {
        const result = validateCsv(parsed);
        setValidation(result);
        setCsvData(parsed.data);
        
        // オピニオンカラムらしい名前を持つカラムがあれば、それを選択する
        const opinionColCandidates = ['opinion', 'text', '意見', 'テキスト', 'コメント', '自由回答', '回答', '内容'];
        const foundOpinionCol = result.stats.columns.find(col => 
          opinionColCandidates.some(candidate => 
            col.toLowerCase().includes(candidate.toLowerCase())
          )
        );
        
        if (foundOpinionCol) {
          setSelectedTargetColumn(foundOpinionCol);
        }
      },
      'CSVパース'
    );
    worker.postMessage({ csvText: text });
  };

  const triggerFileInput = () => {
    fileInput.current?.click();
  };

  useEffect(() => {
    if (validation && validation.valid && selectedTargetColumn) {
      // セッションにカラム情報を保存
      updateSession({
        csvColumns: validation.stats.columns,
        targetColumn: selectedTargetColumn,
        attributeColumns: selectedAttributeColumns,
      });
    }
  }, [validation, selectedTargetColumn, selectedAttributeColumns, updateSession]);

  return (
    <div className="w-full max-w-screen-lg mx-auto p-2 md:p-6">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 md:p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-4">CSVアップロード</h2>

        {globalError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">エラー</p>
            <p>{globalError}</p>
          </div>
        )}

        <div className="mb-8">
          <input
            type="file"
            accept=".csv" // Keep accept attribute for browser filtering
            ref={fileInput}
            onChange={handleFile}
            className="hidden"
          />
          <button
            onClick={triggerFileInput}
            className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 flex items-center justify-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span>CSVファイルを選択</span>
          </button>
          {fileName && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">選択中のファイル: {fileName}</p>
          )}
        </div>

        {validation && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow">
            <h3
              className={`text-xl font-semibold mb-4 ${
                validation.valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              検証結果: {validation.valid ? '成功' : '失敗'}
            </h3>
            {validation.errors.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-red-600 dark:text-red-400">エラー詳細:</p>
                <ul className="list-disc list-inside text-red-500 dark:text-red-300 pl-4">
                  {validation.errors.map((e: string, i: number) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-semibold">行数:</span> {validation.stats.rowCount}
              </p>
              <p>
                <span className="font-semibold">カラム数:</span> {validation.stats.columnCount}
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2 text-gray-700 dark:text-gray-300">サンプルデータ (最初の5行):</p>
              <pre className="bg-white dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto shadow-inner text-gray-800 dark:text-gray-200">
                {JSON.stringify(validation.sample, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {validation && validation.valid && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow">
            <h4 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-200">カラム選択</h4>
            <div className="mb-4">
              <label className="block font-semibold mb-2">分析対象カラム（意見テキスト）</label>
              <select
                className="w-full border rounded p-2 text-gray-800 dark:text-gray-900"
                value={selectedTargetColumn}
                onChange={e => setSelectedTargetColumn(e.target.value)}
              >
                <option value="">-- カラムを選択 --</option>
                {validation.stats.columns.map((col: string) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">属性カラム（複数選択可）</label>
              <div className="flex flex-wrap gap-4">
                {validation.stats.columns.map((col: string) => (
                  <label key={col} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      checked={selectedAttributeColumns.includes(col)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedAttributeColumns([...selectedAttributeColumns, col]);
                        } else {
                          setSelectedAttributeColumns(selectedAttributeColumns.filter(c => c !== col));
                        }
                      }}
                      disabled={col === selectedTargetColumn}
                    />
                    <span className="ml-2 text-gray-800 dark:text-gray-200">{col}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
