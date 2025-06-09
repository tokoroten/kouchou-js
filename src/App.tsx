import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CsvUpload from './pages/CsvUpload';
import Settings from './pages/Settings';
import Progress from './pages/Progress';
import Visualization from './pages/Visualization';
import Export from './pages/Export';
import GeminiTest from './pages/GeminiTest';
import { useAppStore } from './store';

console.log('App コンポーネント読み込み');

// Simple fallback component in case there's an error with the store
function FallbackApp() {
  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <h1 className='text-3xl font-bold mb-4'>広聴AI js - エラー</h1>
      <div className='bg-red-100 p-4 border-l-4 border-red-500 rounded'>
        <h2 className='text-xl font-bold mb-2'>アプリの初期化に問題が発生しました</h2>
        <p>Zustandストアの初期化に失敗しました。以下を確認してください：</p>
        <ul className='list-disc pl-6 mt-2'>
          <li>ブラウザのコンソールにエラーがないか確認してください</li>
          <li>ローカルストレージをクリアしてみてください</li>
          <li>ブラウザをリロードしてください</li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  console.log('App コンポーネント関数実行');
  // State to track Zustand store initialization
  const [storeInitialized, setStoreInitialized] = useState(false);
  
  useEffect(() => {
    console.log('App コンポーネント useEffect 実行');
  }, []);
  
  try {
    // Check if we can access the store
    useAppStore.getState(); // Just check if store can be accessed
    
    const error = useAppStore((s) => s.error);
    const clearError = useAppStore((s) => s.clearError);
    
    // If we get here, the store is initialized
    if (!storeInitialized) {
      setStoreInitialized(true);
    }
    // If the store is initialized, render the full app
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col'>
        {error && (
          <div
            className={`fixed top-0 left-0 w-full z-50 flex justify-center transition-all duration-300 ${typeof error === 'string' || error.type === 'error' ? 'bg-red-500' : error.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'} text-white py-3 shadow-lg`}
          >
            <div className='max-w-screen-lg w-full flex items-center justify-between px-4'>
              <span className='font-bold'>{typeof error === 'string' ? error : error.message}</span>
              <button className='ml-4 px-2 py-1 rounded bg-white/20 hover:bg-white/40' onClick={clearError}>
                閉じる
              </button>
            </div>
          </div>
        )}
        
        <nav className='flex justify-center bg-white shadow-lg border-b border-gray-200 sticky top-0 z-10'>
          <div className='w-full max-w-screen-lg px-2 md:px-6 flex flex-wrap gap-2 md:gap-4 p-2 md:p-4 overflow-x-auto'>
            <Link to='/' className='font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap'>
              ダッシュボード
            </Link>
            <Link to='/upload' className='font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap'>
              CSVアップロード
            </Link>
            <Link to='/settings' className='font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap'>
              設定
            </Link>
            <Link to='/progress' className='font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap'>
              進行状況
            </Link>
            <Link
              to='/visualization'
              className='font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap'
            >
              可視化
            </Link>
            <Link to='/export' className='font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap'>
              エクスポート
            </Link>
            <Link 
              to='/gemini-test'
              className='font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap bg-indigo-100 px-2 py-1 rounded'>
              Gemini Test
            </Link>
          </div>
        </nav>
        
        <main className='flex-1 flex flex-col items-center justify-center py-6 px-2 md:px-6 w-full'>
          <div className='w-full max-w-screen-lg mx-auto'>
            {/* Routes レンダリング開始 */}
            <Routes>
              {/* Route 定義: / (ダッシュボード) */}
              <Route path='/' element={<Dashboard />} />
              {/* Route 定義: /upload (CSVアップロード) */}
              <Route path='/upload' element={<CsvUpload />} />
              {/* Route 定義: /settings (設定) */}
              <Route path='/settings' element={<Settings />} />
              {/* Route 定義: /progress (進行状況) */}
              <Route path='/progress' element={<Progress />} />
              {/* Route 定義: /visualization (可視化) */}
              <Route path='/visualization' element={<Visualization />} />
              {/* Route 定義: /export (エクスポート) */}
              <Route path='/export' element={<Export />} />
              {/* Route 定義: /gemini-test (Gemini Nano テスト) */}
              <Route path='/gemini-test' element={<GeminiTest />} />
            </Routes>
            {/* Routes レンダリング完了 */}
          </div>
        </main>
        
        <footer className='flex justify-center bg-white border-t border-gray-200 text-xs text-gray-500 py-2 shadow-inner'>
          <div className='w-full max-w-screen-lg px-2 md:px-6 text-center'>
            &copy; {new Date().getFullYear()} 広聴AI js — Powered by React, Vite, Gemini Nano, UMAP-js, plotly.js
          </div>
        </footer>
      </div>
    );
  } catch (err) {
    console.error('Appコンポーネント実行エラー:', err);
    
    // Return the fallback UI if there's an error with the store
    return <FallbackApp />;
  }
}

console.log('App コンポーネント定義完了');
export default App;
