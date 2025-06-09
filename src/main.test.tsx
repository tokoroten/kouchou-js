import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      <h1 className="text-3xl font-bold text-center p-4">テストアプリ</h1>
      <p className="text-center">アプリが正常に表示されています</p>
    </div>
  );
}

try {
  console.log('テスト React DOM レンダリング開始');
  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('テスト React DOM レンダリング呼び出し完了');
} catch (err) {
  console.error('レンダリングエラー:', err);
  document.body.innerHTML = `<div style="padding: 20px; background: #ffdddd; color: #990000;">レンダリングエラー: ${err instanceof Error ? err.message : String(err)}</div>`;
}
