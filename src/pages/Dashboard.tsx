import { useEffect, useState } from 'react';
import { useAppStore } from '../store';

export default function Dashboard() {
  const { sessions, fetchSessions, createSession, currentSessionId, loadSession, error } = useAppStore();
  const [newSessionName, setNewSessionName] = useState('');

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="container mx-auto p-4 md:p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">セッション管理</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      
      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">新規セッション作成</h3>
        <div className="flex items-center space-x-3">
          <input
            className="flex-grow border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            placeholder="新しいセッション名を入力..."
            value={newSessionName}
            onChange={e => setNewSessionName(e.target.value)}
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-md shadow-md hover:shadow-lg transform hover:scale-105 transition duration-150 ease-in-out disabled:opacity-50"
            onClick={async () => {
              if (newSessionName.trim()) {
                await createSession(newSessionName.trim());
                setNewSessionName('');
                // fetchSessions(); // createSession内で更新される想定
              }
            }}
            disabled={!newSessionName.trim()}
          >新規作成</button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">既存のセッション</h3>
        {sessions.length === 0 ? (
          <p className="text-gray-500">利用可能なセッションはありません。新しいセッションを作成してください。</p>
        ) : (
          <ul className="space-y-3">
            {sessions.map((s) => (
              <li 
                key={s.id} 
                className={`p-4 border rounded-lg flex items-center justify-between transition-all duration-150 ease-in-out shadow hover:shadow-lg ${currentSessionId === s.id ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}
              >
                <div>
                  <span className={`font-medium ${currentSessionId === s.id ? 'text-blue-700' : 'text-gray-800'}`}>{s.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({s.id.substring(0,8)}...)</span>
                  <p className="text-xs text-gray-400">作成日: {new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
                <button 
                  className={`ml-3 px-4 py-2 text-sm font-medium rounded-md shadow-sm transition duration-150 ease-in-out transform hover:scale-105 ${currentSessionId === s.id ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white'}`}
                  onClick={() => loadSession(s.id)}
                  disabled={currentSessionId === s.id}
                >
                  {currentSessionId === s.id ? '選択中' : '選択'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
