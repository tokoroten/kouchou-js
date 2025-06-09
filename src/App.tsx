import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CsvUpload from './pages/CsvUpload'
import Settings from './pages/Settings'
import Progress from './pages/Progress'
import Visualization from './pages/Visualization'
import Export from './pages/Export'
import { useAppStore } from './store';

function App() {
  const error = useAppStore(s => s.error);
  const clearError = useAppStore(s => s.clearError);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      {error && (
        <div className={`fixed top-0 left-0 w-full z-50 flex justify-center transition-all duration-300 ${typeof error === 'string' || error.type === 'error' ? 'bg-red-500' : error.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'} text-white py-3 shadow-lg`}> 
          <div className="max-w-screen-lg w-full flex items-center justify-between px-4">
            <span className="font-bold">{typeof error === 'string' ? error : error.message}</span>
            <button className="ml-4 px-2 py-1 rounded bg-white/20 hover:bg-white/40" onClick={clearError}>閉じる</button>
          </div>
        </div>
      )}
      <nav className="flex justify-center bg-white shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full max-w-screen-lg px-2 md:px-6 flex flex-wrap gap-2 md:gap-4 p-2 md:p-4 overflow-x-auto">
          <Link to="/" className="font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap">ダッシュボード</Link>
          <Link to="/upload" className="font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap">CSVアップロード</Link>
          <Link to="/settings" className="font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap">設定</Link>
          <Link to="/progress" className="font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap">進行状況</Link>
          <Link to="/visualization" className="font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap">可視化</Link>
          <Link to="/export" className="font-bold text-blue-700 hover:text-purple-600 transition whitespace-nowrap">エクスポート</Link>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center py-6 px-2 md:px-6 w-full">
        <div className="w-full max-w-screen-lg mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<CsvUpload />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/visualization" element={<Visualization />} />
            <Route path="/export" element={<Export />} />
          </Routes>
        </div>
      </main>
      <footer className="flex justify-center bg-white border-t border-gray-200 text-xs text-gray-500 py-2 shadow-inner">
        <div className="w-full max-w-screen-lg px-2 md:px-6 text-center">
          &copy; {new Date().getFullYear()} 広聴AI js — Powered by React, Vite, Gemini Nano, UMAP-js, plotly.js
        </div>
      </footer>
    </div>
  )
}

export default App
