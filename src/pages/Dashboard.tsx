import { useEffect, useState } from 'react';
import { useAppStore } from '../store';

export default function Dashboard() {
  const { sessions, fetchSessions, createSession, currentSessionId, loadSession } = useAppStore();
  const [newSessionName, setNewSessionName] = useState('');

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">セッション一覧</h2>
      <ul className="mb-6">
        {sessions.map((s) => (
          <li key={s.id} className={`p-2 border-b flex items-center ${currentSessionId === s.id ? 'bg-blue-100' : ''}`}>
            <span className="flex-1">{s.name} <span className="text-xs text-gray-400">({s.id})</span></span>
            <button className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded" onClick={() => loadSession(s.id)}>選択</button>
          </li>
        ))}
      </ul>
      <div className="mb-4">
        <input
          className="border px-2 py-1 mr-2 rounded"
          placeholder="新規セッション名"
          value={newSessionName}
          onChange={e => setNewSessionName(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={async () => {
            if (newSessionName.trim()) {
              await createSession(newSessionName.trim());
              setNewSessionName('');
              fetchSessions();
            }
          }}
        >新規作成</button>
      </div>
    </div>
  );
}
