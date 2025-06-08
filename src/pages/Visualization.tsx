import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';
import { useAppStore } from '../store';

export default function Visualization() {
  const plotRef = useRef<HTMLDivElement>(null);
  // 仮データ: UMAP次元削減後の2次元座標とクラスタラベル
  const points = [
    { x: 1, y: 2, label: 0 },
    { x: 2, y: 1, label: 1 },
    { x: 1.5, y: 2.5, label: 0 },
    { x: 2.2, y: 1.2, label: 1 },
  ];
  const clusters = Array.from(new Set(points.map(p => p.label)));
  const error = useAppStore((s) => s.error);

  useEffect(() => {
    if (!plotRef.current) return;
    const data = clusters.map(cluster => ({
      x: points.filter(p => p.label === cluster).map(p => p.x),
      y: points.filter(p => p.label === cluster).map(p => p.y),
      mode: 'markers',
      type: 'scatter',
      name: `クラスタ${cluster}`,
      marker: { size: 12 },
    }));
    Plotly.newPlot(plotRef.current, data, {
      margin: { t: 20 },
      xaxis: { title: 'UMAP-X' },
      yaxis: { title: 'UMAP-Y' },
      legend: { orientation: 'h' },
    });
  }, [clusters]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">可視化画面</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div ref={plotRef} className="w-full h-96 bg-white rounded shadow" />
      <div className="text-xs text-gray-500 mt-2">※ 本実装ではUMAP・クラスタリング結果を描画</div>
    </div>
  );
}
