import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppSimple from './AppSimple';

console.log('デバッグメインエントリポイント読み込み開始');

// シンプルなエラーハンドリング
window.onerror = function (message) {
  console.error('Global error:', message);
};

// 詳細なデバッグ情報を出力
console.log('=== デバッグ情報 ===');
console.log('window.location:', window.location.href);
console.log('document.readyState:', document.readyState);
console.log('React version:', React.version);
console.log('==================');

// Check if root element exists
const rootElement = document.getElementById('root');
console.log('DOM要素を検索: #root', rootElement);

if (!rootElement) {
  document.body.innerHTML = '<div style="padding: 20px; color: red; background: #ffeeee;">Root element (#root) not found</div>';
} else {
  try {
    console.log('React DOM レンダリング開始 (デバッグモード)');
    
    // DOM操作が機能するか確認
    console.log('DOM操作テスト - innerHTML設定前');
    rootElement.innerHTML = '<div style="padding: 10px; background: #eef; color: #008;">Loading debug application...</div>';
    console.log('DOM操作テスト - innerHTML設定後');
    
    // React Routerが正しく初期化されるか確認
    console.log('React Router初期化開始');
    
    // ダミーの要素を設定して、レンダリング過程を追跡
    let renderPhase = 'initialization';
    
    try {
      renderPhase = 'createRoot';
      const root = createRoot(rootElement);
      
      renderPhase = 'render';
      root.render(
        <StrictMode>
          <BrowserRouter>
            <AppSimple />
          </BrowserRouter>
        </StrictMode>
      );
      
      renderPhase = 'complete';
      console.log('React DOM レンダリング呼び出し完了 (デバッグモード)');
    } catch (renderErr) {
      console.error(`レンダリング中のエラー (phase: ${renderPhase}):`, renderErr);
      throw renderErr;
    }
  } catch (err) {
    console.error('レンダリングエラー:', err);
    rootElement.innerHTML = `<div style="padding: 20px; color: red; background: #ffeeee;">
      レンダリングエラー (デバッグモード): ${err instanceof Error ? err.message : String(err)}
    </div>`;
  }
}
