import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { useAppStore } from './store';

console.log('メインエントリポイント読み込み開始');

// グローバルエラーハンドリング
window.onerror = function (message) {
  console.error('Global error:', message);
  try {
    const setError = useAppStore.getState().setError;
    setError(`予期しないエラー: ${message}`);
  } catch (err) {
    console.error('Error in error handler:', err);
  }
};

window.onunhandledrejection = function (event) {
  console.error('Unhandled rejection:', event.reason);
  try {
    const setError = useAppStore.getState().setError;
    setError(`非同期エラー: ${event.reason}`);
  } catch (err) {
    console.error('Error in rejection handler:', err);
  }
};

// Check if root element exists
const rootElement = document.getElementById('root');
console.log('DOM要素を検索: #root', rootElement);

if (!rootElement) {
  document.body.innerHTML = '<div style="padding: 20px; color: red; background: #ffeeee;">Root element (#root) not found</div>';
} else {
  try {
    console.log('React DOM レンダリング開始');
    
    // Attempt to create simple content first to verify DOM manipulation works
    rootElement.innerHTML = '<div>Loading application...</div>';
    
    // Then render the full React app
    createRoot(rootElement).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    );
    console.log('React DOM レンダリング呼び出し完了');
  } catch (err) {
    console.error('レンダリングエラー:', err);
    rootElement.innerHTML = `<div style="padding: 20px; color: red; background: #ffeeee;">
      レンダリングエラー: ${err instanceof Error ? err.message : String(err)}
    </div>`;
  }
}
