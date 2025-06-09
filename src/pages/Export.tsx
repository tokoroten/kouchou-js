import { useState } from 'react';
import { useAppStore } from '../store';

export default function Export() {
  const [format, setFormat] = useState<'html' | 'csv' | 'json'>('html');
  const error = useAppStore((s) => s.error);

  // 仮のエクスポート処理
  const handleExport = () => {
    alert(`エクスポート: ${format}（本実装ではデータを生成しダウンロード）`);
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto p-2 md:p-6">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-4">エクスポート</h1>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">エラー</p>
            <p>{error}</p>
          </div>
        )}
        <div className="mb-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">エクスポートする形式を選択してください:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['html', 'csv', 'json'].map((f) => (
              <label
                key={f}
                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out 
                            ${format === f
                              ? 'bg-sky-500 border-sky-600 text-white dark:bg-sky-600 dark:border-sky-700'
                              : 'bg-gray-100 border-gray-300 hover:border-sky-400 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-sky-500'
                            }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={f}
                  checked={format === f}
                  onChange={() => setFormat(f as 'html' | 'csv' | 'json')}
                  className="sr-only" // Hide the default radio button
                />
                <span className="text-lg font-semibold uppercase">{f}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          onClick={handleExport}
        >
          エクスポート実行
        </button>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
          ※ 本実装では、分析結果（可視化データ、要約、クラスタ情報など）や現在の設定をエクスポートします。
        </div>
      </div>
    </div>
  );
}
