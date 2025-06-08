import './App.css'
import './index.css'
import { useAppStore } from './store'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CsvUpload from './pages/CsvUpload'

function Settings() {
  return <div className="p-4">設定画面（Gemini Nano設定・パラメータ）</div>
}
function Progress() {
  return <div className="p-4">処理進行状況画面</div>
}
function Visualization() {
  return <div className="p-4">可視化画面（plotly.js統合）</div>
}
function Export() {
  return <div className="p-4">エクスポート機能画面</div>
}

function App() {
  const count = useAppStore((state) => state.count)
  const increment = useAppStore((state) => state.increment)
  const decrement = useAppStore((state) => state.decrement)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex gap-4 p-4 bg-white shadow">
        <Link to="/">ダッシュボード</Link>
        <Link to="/upload">CSVアップロード</Link>
        <Link to="/settings">設定</Link>
        <Link to="/progress">進行状況</Link>
        <Link to="/visualization">可視化</Link>
        <Link to="/export">エクスポート</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<CsvUpload />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/visualization" element={<Visualization />} />
        <Route path="/export" element={<Export />} />
      </Routes>
      {/* Zustand counter for test */}
      <div className="p-4">
        <button
          onClick={increment}
          className="m-2 rounded bg-blue-500 p-2 text-white"
        >
          Increment
        </button>
        <button
          onClick={decrement}
          className="m-2 rounded bg-red-500 p-2 text-white"
        >
          Decrement
        </button>
        <span className="ml-4 text-xl">count is {count}</span>
      </div>
    </div>
  )
}

export default App
