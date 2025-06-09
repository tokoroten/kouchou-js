import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppSimple from './AppSimple';

console.log('=== 詳細デバッグメインエントリポイント読み込み開始 ===');

// シンプルなエラーハンドリング
window.onerror = function (message, source, lineno, colno, error) {
  console.error('グローバルエラー:', { message, source, lineno, colno });
  console.error('エラーオブジェクト:', error);
  return false;
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
    console.log('React DOM レンダリング開始 (スーパーデバッグモード)');
    
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
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">スーパーデバッグモード</h1>
            <p className="mb-4">これはルーターなしのシンプルなレンダリングテストです</p>
            <div className="p-4 bg-blue-100 rounded">
              {new Date().toLocaleString()}
            </div>
          </div>
        </StrictMode>
      );
      
      console.log('基本Reactレンダリング成功');
      
      // 基本レンダリングが成功したら、1秒後にルーターを使用したコンポーネントをレンダリング
      setTimeout(() => {
        console.log('React Routerを使用したレンダリング開始');
        try {
          root.render(
            <StrictMode>
              <BrowserRouter>
                <AppSimple />
              </BrowserRouter>
            </StrictMode>
          );
          console.log('React Routerを使用したレンダリング完了');
        } catch (routerError) {
          console.error('React Routerレンダリングエラー:', routerError);
          rootElement.innerHTML = `<div style="padding: 20px; color: red; background: #ffeeee;">
            Router レンダリングエラー: ${routerError instanceof Error ? routerError.message : String(routerError)}
          </div>`;
        }
      }, 1000);
      
      renderPhase = 'complete';
      console.log('React DOM レンダリング呼び出し完了 (スーパーデバッグモード)');
    } catch (renderErr) {
      console.error(`レンダリング中のエラー (phase: ${renderPhase}):`, renderErr);
      rootElement.innerHTML = `<div style="padding: 20px; color: red; background: #ffeeee;">
        レンダリングエラー (phase: ${renderPhase}): ${renderErr instanceof Error ? renderErr.message : String(renderErr)}
      </div>`;
    }
  } catch (err) {
    console.error('トップレベルエラー:', err);
    rootElement.innerHTML = `<div style="padding: 20px; color: red; background: #ffeeee;">
      トップレベルエラー: ${err instanceof Error ? err.message : String(err)}
    </div>`;
  }
}
