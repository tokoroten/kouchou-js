import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { PlusCircleIcon, ChevronRightIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { sessions, fetchSessions, createSession, currentSessionId, loadSession, deleteSession, error, clearError } = useAppStore();
  const [newSessionName, setNewSessionName] = useState('');

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleCreateSession = async () => {
    if (newSessionName.trim()) {
      await createSession(newSessionName.trim());
      setNewSessionName('');
    }
  };

  const handleDeleteSession = async (sessionId: string, sessionName: string) => {
    if (window.confirm(`セッション「${sessionName}」を削除してもよろしいですか？この操作は元に戻せません。`)) {
      await deleteSession(sessionId);
    }
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto p-2 md:p-6">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-4">ダッシュボード</h1>

        {error && (
          <div
            className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-300 p-4 mb-6 rounded-md shadow-lg relative"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg className="fill-current h-6 w-6 text-red-500 dark:text-red-400 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.414 10l2.829-2.828a1 1 0 1 0-1.414-1.414L10 8.586 7.172 5.757a1 1 0 0 0-1.414 1.414L8.586 10l-2.829 2.828a1 1 0 1 0 1.414 1.414L10 11.414l2.829 2.828a1 1 0 0 0 1.414-1.414L11.414 10z"/></svg>
              </div>
              <div>
                <p className="font-bold">エラーが発生しました</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-600"
              aria-label="閉じる"
            >
              <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>閉じる</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-6 md:p-8 mb-10">
          <h3 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-300 flex items-center">
            <PlusCircleIcon className="h-7 w-7 mr-2 text-indigo-500 dark:text-indigo-400" />
            新規セッション作成
          </h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              className="flex-grow w-full sm:w-auto bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition duration-150 ease-in-out text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="新しいセッション名を入力..."
              value={newSessionName}
              onChange={e => setNewSessionName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateSession()}
            />
            <button
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition duration-150 ease-in-out disabled:opacity-60 disabled:transform-none disabled:shadow-none flex items-center justify-center"
              onClick={handleCreateSession}
              disabled={!newSessionName.trim()}
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              作成する
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-6 md:p-8">
          <h3 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-300">
            既存のセッション
          </h3>
          {sessions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-10 text-lg">
              利用可能なセッションはありません。新しいセッションを作成してください。
            </p>
          ) : (
            <ul className="space-y-4">
              {sessions.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((s) => (
                <li
                  key={s.id}
                  className={`group p-4 md:p-5 border-2 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1
                    ${currentSessionId === s.id 
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 dark:border-indigo-600 ring-2 ring-indigo-500 dark:ring-indigo-600' 
                      : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'}`}
                >
                  <div className="flex-grow mb-3 sm:mb-0">
                    <span className={`block text-lg font-semibold ${currentSessionId === s.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>{s.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                      ID: {s.id.substring(0,8)}... | 作成日: {new Date(s.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      className={`w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm transition duration-150 ease-in-out transform hover:scale-105 active:scale-95 flex items-center justify-center
                        ${currentSessionId === s.id 
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white'}`}
                      onClick={() => loadSession(s.id)}
                      disabled={currentSessionId === s.id}
                    >
                      {currentSessionId === s.id ? <CheckCircleIcon className="h-5 w-5 mr-1.5" /> : <ChevronRightIcon className="h-5 w-5 mr-1.5" />}
                      {currentSessionId === s.id ? '選択中' : '選択'}
                    </button>
                    <button
                      onClick={() => handleDeleteSession(s.id, s.name)}
                      className="w-full sm:w-auto mt-2 sm:mt-0 px-3 py-2.5 text-sm font-medium rounded-lg shadow-sm transition duration-150 ease-in-out transform hover:scale-105 active:scale-95 flex items-center justify-center bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white disabled:opacity-50"
                      disabled={currentSessionId === s.id}
                      title="セッションを削除"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
