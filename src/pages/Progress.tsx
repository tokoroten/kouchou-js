import { useAppStore } from '../store';

export default function Progress() {
  const { isLoading, error, currentSessionId, sessions, clearError } = useAppStore();
  const current = sessions.find(s => s.id === currentSessionId);

  const progressItems = [
    { label: 'CSVアップロード', completed: !!current?.csvData },
    { label: '意見成形', completed: !!current?.processedOpinions },
    { label: 'エンベディング計算', completed: !!current?.embeddings },
    { label: 'UMAP次元削減モデル学習', completed: !!current?.umapModelId },
    { label: 'UMAP次元削減実行', completed: !!current?.reducedEmbeddings },
    { label: 'K-meansクラスタリング', completed: !!current?.clusters },
  ];

  const overallProgress = current
    ? (progressItems.filter(item => item.completed).length / progressItems.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-cyan-600 text-transparent bg-clip-text">
            処理進行状況
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
          <h2 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
            現在のセッション
          </h2>
          <p className="text-lg text-indigo-600 dark:text-indigo-400 mb-6 border-b pb-3 border-gray-300 dark:border-gray-700">
            {current ? `${current.name} (ID: ${current.id.substring(0,8)}...)` : 'セッションが選択されていません'}
          </p>

          {current && (
            <>
              <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">全体進捗</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 mb-6 shadow-inner">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full text-xs font-medium text-blue-100 text-center p-1 leading-none transition-all duration-500 ease-out"
                  style={{ width: `${overallProgress}%` }}
                >
                  {overallProgress.toFixed(0)}%
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">各ステップの状況</h3>
              <ul className="space-y-3">
                {progressItems.map((item, index) => (
                  <li key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
                    {item.completed ? (
                      <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    )}
                    <span className={`flex-grow ${item.completed ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>{item.label}</span>
                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${item.completed ? 'bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-200' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                      {item.completed ? '完了' : '未処理'}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">処理中です、しばらくお待ちください...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
