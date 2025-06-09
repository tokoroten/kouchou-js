import { useState, useEffect } from 'react';
import { isGeminiNanoAvailable, getGeminiNanoInfo, isAiFlagEnabled, getGeminiModelDownloadStatus } from '../lib/geminiNanoDetect';
import { useAppStore } from '../store';
import { runGeminiNanoPrompt, checkGeminiNanoUsable } from '../lib/geminiNanoClient';

export default function Settings() {
  const [param, setParam] = useState({
    umapNeighbors: 15,
    umapMinDist: 0.1,
    kmeansClusters: 5,
  });
  const [testInput, setTestInput] = useState('こんにちは、Gemini Nano!');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [geminiUsable, setGeminiUsable] = useState<{ ok: boolean; error?: string } | null>(null);
  const [modelStatus, setModelStatus] = useState<'not-supported' | 'downloading' | 'available' | 'error'>('not-supported');
  const geminiAvailable = isGeminiNanoAvailable();
  const geminiInfo = getGeminiNanoInfo();
  const error = useAppStore((s) => s.error);
  const clearError = useAppStore((s) => s.clearError);

  // Gemini Nano 実利用可否チェック
  useEffect(() => {
    let ignore = false;
    (async () => {
      const usable = await checkGeminiNanoUsable();
      if (!ignore) setGeminiUsable(usable);
    })();
    return () => { ignore = true; };
  }, [geminiAvailable]);

  // モデルダウンロード状況取得
  useEffect(() => {
    let ignore = false;
    (async () => {
      const status = await getGeminiModelDownloadStatus();
      if (!ignore) setModelStatus(status);
    })();
    return () => { ignore = true; };
  }, [isAiFlagEnabled()]);

  const handleGeminiTest = async () => {
    setTestLoading(true);
    setTestResult(null);
    // テスト前に再度利用可否チェック
    const usable = await checkGeminiNanoUsable();
    setGeminiUsable(usable);
    if (!usable.ok) {
      setTestResult('Gemini Nano利用不可: ' + (usable.error || '不明なエラー'));
      setTestLoading(false);
      return;
    }
    try {
      const result = await runGeminiNanoPrompt(testInput);
      setTestResult(result);
    } catch (e) {
      setTestResult('エラー: ' + String(e));
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto p-2 md:p-6">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-4">
          設定
        </h1>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md relative dark:bg-red-900 dark:text-red-300"
            role="alert"
          >
            <strong className="font-bold">エラー:</strong>
            <span className="block sm:inline ml-2">{typeof error === 'string' ? error : error?.message}</span>
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
            Gemini Nano 利用環境チェック
          </h2>
          <ul className="mb-4 space-y-2">
            <li>
              <input type="checkbox" readOnly checked={isAiFlagEnabled()} className="mr-2" />
              <span className={isAiFlagEnabled() ? '' : 'text-red-600 dark:text-red-400 font-bold'}>
                AI機能フラグ（chrome://flags/#enable-ai）が有効
                {!isAiFlagEnabled() && '（chrome://flags/#enable-ai を有効化してください）'}
              </span>
            </li>
            <li>
              <input type="checkbox" readOnly checked={modelStatus === 'available'} className="mr-2" />
              <span className={modelStatus === 'available' ? '' : 'text-red-600 dark:text-red-400 font-bold'}>
                Gemini Nanoモデルの状態: {
                  modelStatus === 'available' ? 'ダウンロード完了' :
                  modelStatus === 'downloading' ? 'ダウンロード中（しばらくお待ちください）' :
                  modelStatus === 'not-supported' ? '未対応ブラウザ/flag未設定' :
                  'エラー'
                }
                {modelStatus === 'downloading' && '（ダウンロード完了まで数分かかる場合があります）'}
              </span>
            </li>
          </ul>
          <div className="mb-4 text-sm text-gray-700 dark:text-gray-200">
            <b>【Gemini Nano有効化手順】</b><br />
            1. <b>chrome://flags/#prompt-api-for-gemini-nano</b> → <b>Enabled</b> に設定<br />
            2. <b>chrome://flags/#optimization-guide-on-device-model</b> → <b>Enabled (BypassPerfRequirement)</b> に設定<br />
            3. 設定後、<b>ブラウザを完全再起動</b>（「Relaunch」だけでなく一度終了→再起動が確実）<br />
          </div>
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

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2 border-gray-300 dark:border-gray-700">
            Gemini Nano 動作確認
          </h2>
          <div className="mb-4">
            <textarea
              className="w-full border rounded p-2 text-gray-800 dark:text-gray-900 mb-2"
              rows={2}
              value={testInput}
              onChange={e => setTestInput(e.target.value)}
              placeholder="Gemini Nanoに送るテキストを入力"
              disabled={!geminiAvailable}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              onClick={handleGeminiTest}
              disabled={!geminiAvailable || testLoading}
            >
              {testLoading ? '実行中...' : 'Gemini Nanoで実行'}
            </button>
          </div>
          {geminiUsable && !geminiUsable.ok && (
            <div className="mt-2 p-2 bg-red-100 dark:bg-red-900 rounded text-sm text-red-800 dark:text-red-200">
              Gemini Nano利用不可: {geminiUsable.error || '不明なエラー'}
            </div>
          )}
          {testResult && (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {testResult}
            </div>
          )}
          {!geminiAvailable && (
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
              <div className="font-bold mb-1">Gemini Nanoが利用できません</div>
              <div>
                <span className="block mb-1">
                  <b>Chrome Dev版のインストールが必要です：</b>
                  <a href="https://www.google.com/chrome/dev/" target="_blank" rel="noopener noreferrer" className="underline text-blue-700 ml-1">Chrome Dev版ダウンロード</a>
                </span>
                Chrome Canary/Dev版で <code>chrome://flags/#enable-ai</code> を有効化し、<br />
                window.ai APIが使える環境でお試しください。<br />
                <span className="block mt-2">
                  <b>※ 初回利用時は <code>chrome://components/</code> でGemini Nanoモデルのダウンロードが必要です。</b><br />
                  「Gemini Nano」または「On-Device AI」コンポーネントを手動で「更新」してください。
                </span>
                詳細: <a href="https://developer.chrome.com/docs/ai/gemini-nano/" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">公式ガイド（Chrome Developers）</a>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
          ※ 設定値は今後セッションごとに保存・反映予定
        </div>
      </div>
    </div>
  );
}
