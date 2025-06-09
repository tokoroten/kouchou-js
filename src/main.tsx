import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { useAppStore } from './store';

// グローバルエラーハンドリング
window.onerror = function (message, source, lineno, colno, error) {
  const setError = useAppStore.getState().setError;
  setError(`予期しないエラー: ${message}`);
};
window.onunhandledrejection = function (event) {
  const setError = useAppStore.getState().setError;
  setError(`非同期エラー: ${event.reason}`);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
