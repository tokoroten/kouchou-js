import { useState } from 'react';
import { isGeminiNanoAvailable, getGeminiNanoInfo } from '../lib/geminiNanoDetect';
import { useAppStore } from '../store';

export default function Settings() {
  const [param, setParam] = useState({
    umapNeighbors: 15,
    umapMinDist: 0.1,
    kmeansClusters: 5,
  });
  const geminiAvailable = isGeminiNanoAvailable();
  const geminiInfo = getGeminiNanoInfo();
  const error = useAppStore((s) => s.error);
  const clearError = useAppStore((s) => s.clearError);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            設定
          </h1>
        </header>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md relative dark:bg-red-900 dark:text-red-300"
            role="alert"
          >
            <strong className="font-bold">エラー:</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <button
              onClick={clearError}
              className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-500"
            >
              <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-300 dark:border-gray-700">
            Gemini Nano 機能検出
          </h2>
          <div className={`p-3 rounded-md ${geminiAvailable ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200'}`}>
            {geminiInfo}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-300 dark:border-gray-700">
            UMAP パラメータ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="umapNeighbors" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                n_neighbors:
              </label>
              <input
                type="number"
                id="umapNeighbors"
                min={2}
                max={100}
                value={param.umapNeighbors}
                onChange={e => setParam(p => ({ ...p, umapNeighbors: Number(e.target.value) }))}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label htmlFor="umapMinDist" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                min_dist:
              </label>
              <input
                type="number"
                id="umapMinDist"
                step={0.01}
                min={0}
                max={1}
                value={param.umapMinDist}
                onChange={e => setParam(p => ({ ...p, umapMinDist: Number(e.target.value) }))}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-300 dark:border-gray-700">
            K-means クラスタ数
          </h2>
          <div>
            <label htmlFor="kmeansClusters" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              クラスタ数:
            </label>
            <input
              type="number"
              id="kmeansClusters"
              min={1}
              max={100}
              value={param.kmeansClusters}
              onChange={e => setParam(p => ({ ...p, kmeansClusters: Number(e.target.value) }))}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
          ※ 設定値は今後セッションごとに保存・反映予定
        </div>
      </div>
    </div>
  );
}
