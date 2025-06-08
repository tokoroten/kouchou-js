import './App.css'
import './index.css'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CsvUpload from './pages/CsvUpload'
import Settings from './pages/Settings'
import Progress from './pages/Progress'
import Visualization from './pages/Visualization'
import Export from './pages/Export'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      <nav className="flex gap-4 p-4 bg-white shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <Link to="/" className="font-bold text-blue-700 hover:text-purple-600 transition">ダッシュボード</Link>
        <Link to="/upload" className="font-bold text-blue-700 hover:text-purple-600 transition">CSVアップロード</Link>
        <Link to="/settings" className="font-bold text-blue-700 hover:text-purple-600 transition">設定</Link>
        <Link to="/progress" className="font-bold text-blue-700 hover:text-purple-600 transition">進行状況</Link>
        <Link to="/visualization" className="font-bold text-blue-700 hover:text-purple-600 transition">可視化</Link>
        <Link to="/export" className="font-bold text-blue-700 hover:text-purple-600 transition">エクスポート</Link>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center py-8 px-2">
        <div className="w-full max-w-4xl">
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
      <footer className="bg-white border-t border-gray-200 text-xs text-gray-500 py-2 text-center shadow-inner">
        &copy; {new Date().getFullYear()} 広聴AI js — Powered by React, Vite, Gemini Nano, UMAP-js, plotly.js
      </footer>
    </div>
  )
}

export default App
