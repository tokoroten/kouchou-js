import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';
import { useAppStore } from '../store';

export default function Visualization() {
  const plotRef = useRef<HTMLDivElement>(null);
  const { currentSessionId, sessions, error, clearError } = useAppStore();
  const currentSession = sessions.find(s => s.id === currentSessionId);

  // 仮データ: UMAP次元削減後の2次元座標とクラスタラベル
  // TODO: currentSessionから実際のデータを取得するように変更
  const points = currentSession?.reducedEmbeddings && currentSession.clusters
    ? currentSession.reducedEmbeddings.map((coord, index) => ({
        x: coord[0],
        y: coord[1],
        label: currentSession.clusters?.[index] ?? 0,
        text: currentSession.processedOpinions?.[index]?.summary || `Opinion ${index + 1}` // 要約または意見番号
      }))
    : [
        { x: 1, y: 2, label: 0, text: 'Opinion 1' },
        { x: 2, y: 1, label: 1, text: 'Opinion 2' },
        { x: 1.5, y: 2.5, label: 0, text: 'Opinion 3' },
        { x: 2.2, y: 1.2, label: 1, text: 'Opinion 4' },
      ];

  const clusters = Array.from(new Set(points.map(p => p.label)));

  useEffect(() => {
    if (!plotRef.current || !points || points.length === 0) {
        if (plotRef.current) Plotly.purge(plotRef.current);
        return;
    }

    const data: Partial<any>[] = clusters.map(cluster => ({
      x: points.filter(p => p.label === cluster).map(p => p.x),
      y: points.filter(p => p.label === cluster).map(p => p.y),
      text: points.filter(p => p.label === cluster).map(p => p.text),
      mode: 'markers',
      type: 'scattergl', // WebGL for better performance
      name: `クラスタ ${cluster}`,
      marker: { 
        size: 10,
        opacity: 0.8,
       },
      hoverinfo: 'text',
    }));

    const layout: Partial<any> = {
      margin: { t: 40, b: 40, l: 40, r: 20 },
      xaxis: { 
        title: 'UMAP Dimension 1',
        zeroline: false,
        gridcolor: 'rgba(200, 200, 200, 0.3)', // Softer grid lines
        titlefont: { color: '#666' },
        tickfont: { color: '#666' },
      },
      yaxis: { 
        title: 'UMAP Dimension 2',
        zeroline: false,
        gridcolor: 'rgba(200, 200, 200, 0.3)',
        titlefont: { color: '#666' },
        tickfont: { color: '#666' },
      },
      legend: { 
        orientation: 'h', 
        yanchor: 'bottom', 
        y: 1.02, 
        xanchor: 'right', 
        x: 1,
        bgcolor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent legend
        bordercolor: '#ccc',
        borderwidth: 1,
      },
      hovermode: 'closest',
      plot_bgcolor: 'rgba(0,0,0,0)', // Transparent plot background
      paper_bgcolor: 'rgba(0,0,0,0)', // Transparent paper background
      font: {
        family: 'Arial, sans-serif',
        size: 12,
        color: '#333'
      }
    };

    Plotly.react(plotRef.current, data, layout, {responsive: true}); // Use Plotly.react for dynamic updates

    // Clean up on unmount
    return () => {
        if (plotRef.current) {
            Plotly.purge(plotRef.current);
        }
    };
  }, [points, clusters]); // Re-run effect if points or clusters change

  return (
    <div className="w-full max-w-screen-lg mx-auto p-2 md:p-6">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-4">可視化</h1>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md relative dark:bg-red-900 dark:text-red-300"
            role="alert"
          >
            <strong className="font-bold">エラー:</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <button
              onClick={clearError}
              className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-500"
            >
              <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
          </div>
        )}

        {!currentSession || !currentSession.reducedEmbeddings || !currentSession.clusters ? (
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">データがありません</h2>
            <p className="text-gray-600 dark:text-gray-400">
              可視化を行うには、まずセッションを選択し、CSVをアップロードして処理を完了させてください。
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              現在の進捗は「処理進行状況」ページで確認できます。
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-2 md:p-4">
            <div ref={plotRef} className="w-full h-[60vh] min-h-[400px]" />
          </div>
        )}

        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
          ※ UMAPとK-meansクラスタリングの結果をプロットしています。点にカーソルを合わせると意見の要約が表示されます。
        </div>
      </div>
    </div>
  );
}
