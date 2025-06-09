import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Simple pages for testing
const Home = () => <div className="p-8 bg-blue-100">ホームページ</div>;
const About = () => <div className="p-8 bg-green-100">詳細ページ</div>;

export default function AppSimple() {
  const [count, setCount] = useState(0);
  
  console.log('AppSimple rendering');
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white p-4 shadow">
        <h1 className="text-2xl font-bold text-center">シンプルテストアプリ</h1>
        
        <div className="flex justify-center space-x-4 mt-4">
          <Link to="/" className="text-blue-600 hover:underline">ホーム</Link>
          <Link to="/about" className="text-blue-600 hover:underline">詳細</Link>
        </div>
        
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCount(c => c + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            カウント: {count}
          </button>
        </div>
      </header>
      
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      
      <footer className="bg-white p-4 border-t">
        <p className="text-center text-gray-500">
          シンプルテストアプリ © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
