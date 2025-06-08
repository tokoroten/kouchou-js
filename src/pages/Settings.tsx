import { useState } from 'react';
import { isGeminiNanoAvailable, getGeminiNanoInfo } from '../lib/geminiNanoDetect';
import { useAppStore } from '../store';

export default function Settings() {
  const [param, setParam] = useState({
    umapNeighbors: 15,
    umapMinDist: 0.1,
    kmeansClusters: 5,
  });
  const geminiAvailable = isGeminiNanoAvailable();
  const geminiInfo = getGeminiNanoInfo();
  const error = useAppStore((s) => s.error);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">設定画面</h2>
      {error && <div className="text-red-500">{error}</div>}
      <div className="mb-4">
        <div className="font-bold mb-1">Gemini Nano 機能検出</div>
        <div className={geminiAvailable ? 'text-green-600' : 'text-red-500'}>{geminiInfo}</div>
      </div>
      <div className="mb-4">
        <div className="font-bold mb-1">UMAPパラメータ</div>
        <label className="block mb-1">
          n_neighbors: <input type="number" min={2} max={100} value={param.umapNeighbors} onChange={e => setParam(p => ({ ...p, umapNeighbors: Number(e.target.value) }))} className="border px-2 py-1 rounded w-20" />
        </label>
        <label className="block mb-1">
          min_dist: <input type="number" step={0.01} min={0} max={1} value={param.umapMinDist} onChange={e => setParam(p => ({ ...p, umapMinDist: Number(e.target.value) }))} className="border px-2 py-1 rounded w-20" />
        </label>
      </div>
      <div className="mb-4">
        <div className="font-bold mb-1">K-meansクラスタ数</div>
        <input type="number" min={1} max={100} value={param.kmeansClusters} onChange={e => setParam(p => ({ ...p, kmeansClusters: Number(e.target.value) }))} className="border px-2 py-1 rounded w-20" />
      </div>
      <div className="text-xs text-gray-500">※ 設定値は今後セッションごとに保存・反映予定</div>
    </div>
  );
}
